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

      setPrograms(loadedPrograms);
      setSelectedProgramId(selectedId || loadedPrograms[0]?.id || null);

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