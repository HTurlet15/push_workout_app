import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ACTIVITY_KEY = 'push_last_activity';
const ROTATION_DELAY_MS = 5*1000; //12 * 60 * 60 * 1000;

/**
 * Hook that checks if 12h have passed since last activity.
 * If so, rotates the workout data:
 *   - Current becomes Previous (simplified to raw values)
 *   - Each field of the new Current is resolved individually:
 *     next value (planned) > previous value (previous) > empty
 *   - Next initializes with current workout values as a starting point
 *
 * Also updates the last activity timestamp on every call.
 *
 * @param {Object} params
 * @param {Object} params.workout - Current workout state.
 * @param {Function} params.setWorkout - Setter for current workout.
 * @param {Object} params.previousWorkout - Previous workout state.
 * @param {Function} params.setPreviousWorkout - Setter for previous workout.
 * @param {Object} params.nextWorkout - Next workout state.
 * @param {Function} params.setNextWorkout - Setter for next workout.
 * @param {boolean} params.isLoading - Whether data is still loading from storage.
 */
export default function useSessionRotation({
  workout,
  setWorkout,
  previousWorkout,
  setPreviousWorkout,
  nextWorkout,
  setNextWorkout,
  isLoading,
}) {
  useEffect(() => {
    if (isLoading) return;

    const checkRotation = async () => {
      try {
        const lastActivity = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
        const now = Date.now();

        if (lastActivity) {
          const elapsed = now - parseInt(lastActivity, 10);

          if (elapsed >= ROTATION_DELAY_MS) {
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

  /**
   * Performs the data rotation across all three workout slots.
   */
  const rotate = () => {
    const newPrevious = buildNewPrevious();
    const newCurrent = buildNewCurrent();
    const newNext = buildNewNext();

    setPreviousWorkout(newPrevious);
    setWorkout(newCurrent);
    setNextWorkout(newNext);
  };

  /**
   * Converts the current workout into a simplified previous format.
   * Strips field-level state objects down to raw values.
   */
  const buildNewPrevious = () => ({
    ...workout,
    completedAt: workout.startedAt,
    exercises: workout.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        id: set.id,
        weight: set.weight.value,
        reps: set.reps.value,
        rir: set.rir.value,
      })),
    })),
  });

  /**
   * Builds a new current workout with pre-filled values.
   * For each field in each set, checks next first, then falls back to previous.
   */
  const buildNewCurrent = () => ({
    ...workout,
    startedAt: new Date().toISOString(),
    exercises: workout.exercises.map((exercise) => {
      const nextExercise = nextWorkout.exercises.find(
        (e) => e.id === exercise.id
      );
      const prevExercise = previousWorkout.exercises.find(
        (e) => e.id === exercise.id
      );

      return {
        ...exercise,
        sets: exercise.sets.map((set, index) => {
          const nextSet = nextExercise?.sets[index];
          const prevSet = prevExercise?.sets[index];

          return {
            id: set.id,
            completed: false,
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
   * Gives a starting point that the user can then adjust for progression.
   */
  const buildNewNext = () => ({
    ...nextWorkout,
    exercises: workout.exercises.map((exercise) => {
      const nextExercise = nextWorkout.exercises.find(
        (e) => e.id === exercise.id
      );

      return {
        ...nextExercise,
        sets: exercise.sets.map((set, index) => ({
          id: nextExercise?.sets[index]?.id || set.id,
          weight: set.weight.value,
          reps: set.reps.value,
        })),
      };
    }),
  });
}

/**
 * Determines the pre-filled value and state for a single field.
 * Priority: user-edited next value (planned) > pre-filled next value (previous) > previous workout value > empty.
 *
 * Next field format:
 * - { value, edited: true } → user explicitly set this, becomes 'planned' with calendar
 * - raw number → pre-filled from current, treated same as previous (no calendar)
 * - null → no data
 *
 * @param {number|Object|null} nextValue - Value from next workout.
 * @param {number|null} prevValue - Value from previous workout (fallback).
 * @returns {Object} Field object with value and state.
 */
function resolveField(nextValue, prevValue) {
  if (nextValue !== null && nextValue !== undefined) {
    /** User-edited next value → planned with calendar */
    if (typeof nextValue === 'object' && nextValue.edited) {
      return { value: nextValue.value, state: 'planned' };
    }

    /** Pre-filled next value (raw number) → treat as previous, no calendar */
    const rawValue = typeof nextValue === 'object' ? nextValue.value : nextValue;
    return { value: rawValue, state: 'previous' };
  }

  if (prevValue !== null && prevValue !== undefined) {
    return { value: prevValue, state: 'previous' };
  }

  return { value: null, state: 'empty' };
}