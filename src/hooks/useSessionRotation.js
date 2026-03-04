import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ACTIVITY_KEY = 'push_last_activity';
// const ROTATION_DELAY_MS = 12 * 60 * 60 * 1000;
const ROTATION_DELAY_MS = 5 * 1000; // 5s for testing

/**
 * Hook that checks if enough time has passed since last activity.
 * If so, rotates the workout data:
 *   - Current becomes Previous (simplified to raw values)
 *   - Each field of the new Current is resolved individually:
 *     next value (planned) > previous value (previous) > empty
 *   - Next initializes with current workout values as a starting point
 *   - History is updated with tonnage from the completed session
 *
 * Also updates the last activity timestamp on every call.
 */
export default function useSessionRotation({
  workout,
  setWorkout,
  previousWorkout,
  setPreviousWorkout,
  nextWorkout,
  setNextWorkout,
  sessionIndex,
  updateSelectedSessions,
  isLoading,
}) {
  const hasRotated = useRef(false);

  useEffect(() => {
    if (isLoading || hasRotated.current) return;
    if (!workout || !workout.exercises) return;

    const checkRotation = async () => {
      try {
        const lastActivity = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
        const now = Date.now();

        if (lastActivity) {
          const elapsed = now - parseInt(lastActivity, 10);

          if (elapsed >= ROTATION_DELAY_MS) {
            hasRotated.current = true;
            rotate();
          }
        }

        await AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(now));
      } catch (error) {
        console.warn('Session rotation check failed:', error);
      }
    };

    checkRotation();
  }, [isLoading]);

  const rotate = () => {
    // Build history entry from current workout
    const historyEntry = buildHistoryEntry();

    const newPrevious = buildNewPrevious();
    const newCurrent = buildNewCurrent();
    const newNext = buildNewNext();

    // Update all 3 slots + history atomically via updateSelectedSessions
    if (updateSelectedSessions && sessionIndex !== undefined) {
      updateSelectedSessions((prev) => {
        const next = [...prev];
        next[sessionIndex] = {
          ...next[sessionIndex],
          previous: newPrevious,
          current: newCurrent,
          next: newNext,
          history: historyEntry
            ? [...(next[sessionIndex].history || []), historyEntry]
            : next[sessionIndex].history,
        };
        return next;
      });
    } else {
      // Fallback: use individual setters
      setPreviousWorkout(newPrevious);
      setWorkout(newCurrent);
      setNextWorkout(newNext);
    }
  };

  /**
   * Build a history entry from the current workout's tonnage.
   */
  const buildHistoryEntry = () => {
    if (!workout.exercises || workout.exercises.length === 0) return null;

    const exercises = workout.exercises.map((exercise) => {
      const tonnage = exercise.sets.reduce((sum, set) => {
        const w = set.weight?.value ?? 0;
        const r = set.reps?.value ?? 0;
        return sum + (w * r);
      }, 0);
      return { name: exercise.name, tonnage: Math.round(tonnage) };
    });

    const totalTonnage = exercises.reduce((sum, e) => sum + e.tonnage, 0);

    // Only add to history if there's actual data
    if (totalTonnage === 0) return null;

    return {
      date: new Date().toISOString(),
      exercises,
      totalTonnage,
    };
  };

  /**
   * Converts the current workout into a simplified previous format.
   */
  const buildNewPrevious = () => ({
    ...workout,
    completedAt: workout.completedAt || new Date().toISOString(),
    exercises: workout.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        id: set.id,
        weight: set.weight?.value ?? null,
        reps: set.reps?.value ?? null,
        rir: set.rir?.value ?? null,
      })),
    })),
  });

  /**
   * Builds a new current workout with pre-filled values.
   * Priority: next planned value > previous value > empty.
   */
  const buildNewCurrent = () => ({
    ...workout,
    completedAt: null,
    exercises: workout.exercises.map((exercise) => {
      const nextExercise = nextWorkout?.exercises?.find(
        (e) => e.id === exercise.id
      );
      const prevExercise = previousWorkout?.exercises?.find(
        (e) => e.id === exercise.id
      );

      return {
        ...exercise,
        sets: exercise.sets.map((set, index) => {
          const nextSet = nextExercise?.sets?.[index];
          const prevSet = prevExercise?.sets?.[index];

          return {
            id: set.id,
            weight: resolveField(nextSet?.weight, prevSet?.weight),
            reps: resolveField(nextSet?.reps, prevSet?.reps),
            rir: { value: null, state: 'empty' },
          };
        }),
      };
    }),
  });

  /**
   * Initializes the next workout with values from the current workout.
   */
  const buildNewNext = () => ({
    ...(nextWorkout || workout),
    exercises: workout.exercises.map((exercise) => {
      const nextExercise = nextWorkout?.exercises?.find(
        (e) => e.id === exercise.id
      );

      return {
        id: nextExercise?.id || exercise.id,
        name: exercise.name,
        sets: exercise.sets.map((set, index) => ({
          id: nextExercise?.sets?.[index]?.id || set.id,
          weight: set.weight?.value ?? null,
          reps: set.reps?.value ?? null,
        })),
      };
    }),
  });
}

/**
 * Determines the pre-filled value and state for a single field.
 * Priority: user-edited next (planned) > pre-filled next (previous) > previous > empty.
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