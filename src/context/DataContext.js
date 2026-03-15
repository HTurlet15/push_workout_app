import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STARTER_PROGRAM from '../data/starterProgram';

const DataContext = createContext(null);

// ── AsyncStorage keys ──────────────────────────────────────

const KEYS = {
  programIds: '@push_program_ids',
  selectedProgramId: '@push_selected_program_id',
  program: (id) => `@push_program_${id}`,
  settings: '@push_settings',
};

// ── Rotation helpers ───────────────────────────────────────

/**
 * Resolves a single field for the new current workout.
 * Priority: next edited (planned) > next pre-filled (previous) > prev > empty.
 */
function resolveField(nextValue, prevValue) {
  if (nextValue !== null && nextValue !== undefined) {
    if (typeof nextValue === 'object' && nextValue.edited) {
      return { value: nextValue.value, state: 'planned' };
    }
    const rawValue = typeof nextValue === 'object' ? nextValue.value : nextValue;
    if (rawValue !== null) {
      return { value: rawValue, state: 'previous' };
    }
  }
  if (prevValue !== null && prevValue !== undefined) {
    return { value: prevValue, state: 'previous' };
  }
  return { value: null, state: 'empty' };
}

/**
 * Rotates all sessions in a program: current→previous, next→current, new empty next.
 * Also pushes tonnage to history.
 */
function rotateAllSessions(program) {
  return {
    ...program,
    sessions: program.sessions.map((session) => {
      const { current, next, history } = session;
      if (!current || !current.exercises) return session;

      // Check if user actually trained this session (at least one set filled)
      const hasActivity = current.exercises.some((ex) =>
        ex.sets.some((set) => set.weight?.state === 'filled' || set.reps?.state === 'filled')
      );

      // Skip rotation for untouched sessions
      if (!hasActivity) return session;

      // Build history entry from current — only count sets the user actually did (filled)
      const exercises = current.exercises.map((ex) => {
        const tonnage = ex.sets.reduce((sum, set) => {
          const wState = set.weight?.state;
          const rState = set.reps?.state;
          const isDone = (wState === 'filled' || wState === 'plannedFilled') &&
                         (rState === 'filled' || rState === 'plannedFilled');
          if (!isDone) return sum;
          const rawW = set.weight?.value ?? 0;
          const w = typeof rawW === 'object' ? (rawW.kg ?? 0) : rawW;
          const r = set.reps?.value ?? 0;
          return sum + (w * r);
        }, 0);
        return { name: ex.name, tonnage: Math.round(tonnage) };
      });
      const totalTonnage = exercises.reduce((sum, e) => sum + e.tonnage, 0);
      const historyEntry = totalTonnage > 0 ? {
        date: new Date().toISOString(),
        exercises,
        totalTonnage,
      } : null;

      // Current → Previous (flatten to raw values)
      const newPrevious = {
        ...current,
        completedAt: current.completedAt || new Date().toISOString(),
        exercises: current.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((set) => ({
            id: set.id,
            weight: set.weight?.value ?? null,
            reps: set.reps?.value ?? null,
            rir: set.rir?.value ?? null,
          })),
        })),
      };

      // Next → Current (resolve fields with priority)
      // Fallback uses newPrevious (= the session we just completed), not the old previous
      const newCurrent = {
        ...current,
        completedAt: null,
        exercises: current.exercises.map((ex) => {
          const nextEx = next?.exercises?.find((e) => e.id === ex.id);
          const newPrevEx = newPrevious.exercises.find((e) => e.id === ex.id);
          return {
            ...ex,
            sets: ex.sets.map((set, i) => {
              const nextSet = nextEx?.sets?.[i];
              const prevSet = newPrevEx?.sets?.[i];
              return {
                id: set.id,
                weight: resolveField(nextSet?.weight, prevSet?.weight),
                reps: resolveField(nextSet?.reps, prevSet?.reps),
                rir: { value: null, state: 'empty' },
              };
            }),
          };
        }),
      };

      // New empty Next
      const newNext = {
        id: next?.id || `${current.id}-next`,
        name: current.name,
        exercises: current.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets.map((set) => ({
            id: set.id,
            weight: null,
            reps: null,
          })),
        })),
      };

      return {
        history: historyEntry ? [...(history || []), historyEntry] : (history || []),
        current: newCurrent,
        previous: newPrevious,
        next: newNext,
      };
    }),
  };
}

// ── Default settings ───────────────────────────────────────

const DEFAULT_SETTINGS = {
  defaultUnit: 'kg',
  defaultRestSeconds: 90,
};

// ── Provider ───────────────────────────────────────────────

export function DataProvider({ children }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Track which programs are fully loaded (with sessions data)
  const loadedProgramsRef = useRef(new Set());

  // ── Initial load ────────────────────────────────────────

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [idsJson, selectedId, settingsJson] = await Promise.all([
        AsyncStorage.getItem(KEYS.programIds),
        AsyncStorage.getItem(KEYS.selectedProgramId),
        AsyncStorage.getItem(KEYS.settings),
      ]);

      let programIds = idsJson ? JSON.parse(idsJson) : null;

      // First launch — seed with starter program
      if (!programIds) {
        await seedStarterData();
        return;
      }

      // Load all programs
      const programPromises = programIds.map(async (id) => {
        const json = await AsyncStorage.getItem(KEYS.program(id));
        if (json) {
          loadedProgramsRef.current.add(id);
          return JSON.parse(json);
        }
        return null;
      });

      const loadedPrograms = (await Promise.all(programPromises)).filter(Boolean);

      // Check session rotation before setting state
      const lastActivity = await AsyncStorage.getItem('push_last_activity');
      const now = Date.now();
      //const ROTATION_DELAY_MS = 12 * 60 * 60 * 1000;
      const ROTATION_DELAY_MS = 5 * 1000; // 5s for testing
      const shouldRotate = lastActivity && (now - parseInt(lastActivity, 10)) >= ROTATION_DELAY_MS;

      const finalPrograms = shouldRotate
        ? loadedPrograms.map((prog) => rotateAllSessions(prog))
        : loadedPrograms;

      if (shouldRotate) {
        // Save rotated programs
        for (const prog of finalPrograms) {
          await AsyncStorage.setItem(KEYS.program(prog.id), JSON.stringify(prog));
        }
      }

      await AsyncStorage.setItem('push_last_activity', String(now));

      setPrograms(finalPrograms);
      setSelectedProgramId(selectedId || finalPrograms[0]?.id || null);

      if (settingsJson) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) });
      }
    } catch (err) {
      console.error('[DataContext] Load error:', err);
      // Fallback to starter
      await seedStarterData();
    } finally {
      setLoading(false);
    }
  };

  const seedStarterData = async () => {
    try {
      const prog = STARTER_PROGRAM;
      await AsyncStorage.setItem(KEYS.programIds, JSON.stringify([prog.id]));
      await AsyncStorage.setItem(KEYS.selectedProgramId, prog.id);
      await AsyncStorage.setItem(KEYS.program(prog.id), JSON.stringify(prog));
      await AsyncStorage.setItem(KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
      await AsyncStorage.setItem('push_last_activity', String(Date.now()));

      loadedProgramsRef.current.add(prog.id);
      setPrograms([prog]);
      setSelectedProgramId(prog.id);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error('[DataContext] Seed error:', err);
    }
    setLoading(false);
  };

  // ── Save helpers ────────────────────────────────────────

  const saveProgramIds = async (ids) => {
    await AsyncStorage.setItem(KEYS.programIds, JSON.stringify(ids));
  };

  const saveProgram = async (program) => {
    await AsyncStorage.setItem(KEYS.program(program.id), JSON.stringify(program));
  };

  const saveSelectedProgramId = async (id) => {
    await AsyncStorage.setItem(KEYS.selectedProgramId, id);
  };

  const saveSettings = async (s) => {
    await AsyncStorage.setItem(KEYS.settings, JSON.stringify(s));
  };

  // ── Program CRUD ────────────────────────────────────────

  const addProgram = useCallback(async () => {
    const id = `prog-${Date.now()}`;
    const newProg = {
      id,
      name: 'New Program',
      note: null,
      frequency: null,
      sessions: [],
    };

    setPrograms((prev) => {
      const next = [...prev, newProg];
      saveProgramIds(next.map((p) => p.id));
      saveProgram(newProg);
      return next;
    });

    return id;
  }, []);

  const deleteProgram = useCallback(async (index) => {
    setPrograms((prev) => {
      const toDelete = prev[index];
      if (!toDelete) return prev;

      const next = prev.filter((_, i) => i !== index);
      saveProgramIds(next.map((p) => p.id));
      AsyncStorage.removeItem(KEYS.program(toDelete.id));

      // If we deleted the selected program, select the first one
      if (toDelete.id === selectedProgramId && next.length > 0) {
        setSelectedProgramId(next[0].id);
        saveSelectedProgramId(next[0].id);
      } else if (next.length === 0) {
        setSelectedProgramId(null);
        saveSelectedProgramId('');
      }

      return next;
    });
  }, [selectedProgramId]);

  const updateProgram = useCallback((programId, updater) => {
    setPrograms((prev) => {
      const next = prev.map((p) => {
        if (p.id !== programId) return p;
        const updated = typeof updater === 'function' ? updater(p) : { ...p, ...updater };
        // Save async (non-blocking)
        saveProgram(updated);
        return updated;
      });
      return next;
    });
  }, []);

  const updateProgramName = useCallback((index, name) => {
    setPrograms((prev) => {
      const p = prev[index];
      if (!p) return prev;
      const updated = { ...p, name };
      const next = [...prev];
      next[index] = updated;
      saveProgram(updated);
      return next;
    });
  }, []);

  const updateProgramNote = useCallback((index, note) => {
    setPrograms((prev) => {
      const p = prev[index];
      if (!p) return prev;
      const updated = { ...p, note };
      const next = [...prev];
      next[index] = updated;
      saveProgram(updated);
      return next;
    });
  }, []);

  const updateProgramFrequency = useCallback((index, frequency) => {
    setPrograms((prev) => {
      const p = prev[index];
      if (!p) return prev;
      const updated = { ...p, frequency };
      const next = [...prev];
      next[index] = updated;
      saveProgram(updated);
      return next;
    });
  }, []);

  // ── Select program ──────────────────────────────────────

  const selectProgram = useCallback((programId) => {
    setSelectedProgramId(programId);
    saveSelectedProgramId(programId);
  }, []);

  // ── Sessions (workouts within selected program) ─────────

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const sessions = selectedProgram?.sessions ?? [];

  const updateSelectedSessions = useCallback((updater) => {
    setPrograms((prev) => {
      const next = prev.map((p) => {
        if (p.id !== selectedProgramId) return p;
        const updated = {
          ...p,
          sessions: typeof updater === 'function' ? updater(p.sessions) : updater,
        };
        saveProgram(updated);
        return updated;
      });
      return next;
    });
  }, [selectedProgramId]);

  const addWorkout = useCallback(() => {
    const ts = Date.now();
    const newSession = {
      history: [],
      current: {
        id: `wk-${ts}`,
        name: 'New Workout',
        completedAt: null,
        exercises: [],
      },
      previous: null,
      next: {
        id: `wk-${ts}-next`,
        name: 'New Workout',
        exercises: [],
      },
    };

    updateSelectedSessions((prev) => [...prev, newSession]);
  }, [updateSelectedSessions]);

  const deleteWorkout = useCallback((index) => {
    updateSelectedSessions((prev) => prev.filter((_, i) => i !== index));
  }, [updateSelectedSessions]);

  // ── Settings ────────────────────────────────────────────

  const updateSettings = useCallback((updater) => {
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveSettings(next);
      return next;
    });
  }, []);

  // ── Context value ───────────────────────────────────────

  const value = {
    // State
    loading,
    programs,
    selectedProgramId,
    selectedProgram,
    sessions,
    settings,

    // Program CRUD
    addProgram,
    deleteProgram,
    updateProgram,
    updateProgramName,
    updateProgramNote,
    updateProgramFrequency,
    selectProgram,

    // Sessions
    updateSelectedSessions,
    addWorkout,
    deleteWorkout,

    // Settings
    updateSettings,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}