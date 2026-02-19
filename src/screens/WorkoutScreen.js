import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Text from '../components/Text';
import ExerciseCard from '../components/ExerciseCard';
import usePersistedState from '../hooks/usePersistedState';
import useSessionRotation from '../hooks/useSessionRotation';
import MOCK_WORKOUT from '../data/mockWorkout';
import MOCK_PREVIOUS_WORKOUT from '../data/mockPreviousWorkout';
import MOCK_NEXT_WORKOUT from '../data/mockNextWorkout';
import { COLORS, SPACING, RADIUS, FONT_FAMILY } from '../theme/theme';
import BottomBar from '../components/BottomBar';
import useRestTimer from '../hooks/useRestTimer';
import TimerPicker from '../components/TimerPicker';

/**
 * Main workout session screen.
 *
 * Orchestrates the entire workout experience:
 * - Loads and persists current, previous, and next workout data
 * - Handles session rotation (previous → current → next) after 12h
 * - Manages edit mode state for add/delete sets and notes
 * - Provides rest timer with configurable duration
 *
 * All workout mutations (update set, add/delete set, update note)
 * are defined here and passed down to ExerciseCard via callbacks.
 * Data flows down, events flow up.
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  /** Rest timer hook — manages countdown lifecycle */
  const {
    timerState, timeRemaining, duration,
    playPause, reset, updateDuration,
  } = useRestTimer(90);

  // ── Persisted workout data ────────────────────────────────
  // Each workout is saved to AsyncStorage and restored on app launch.

  const [workout, setWorkout, workoutLoading] = usePersistedState(
    'push_current_workout', MOCK_WORKOUT
  );
  const [previousWorkout, setPreviousWorkout, previousLoading] = usePersistedState(
    'push_previous_workout', MOCK_PREVIOUS_WORKOUT
  );
  const [nextWorkout, setNextWorkout, nextLoading] = usePersistedState(
    'push_next_workout', MOCK_NEXT_WORKOUT
  );

  const isLoading = workoutLoading || previousLoading || nextLoading;

  /** Automatic session rotation check on mount */
  useSessionRotation({
    workout, setWorkout,
    previousWorkout, setPreviousWorkout,
    nextWorkout, setNextWorkout,
    isLoading,
  });

  // ── Helpers ───────────────────────────────────────────────

  /** Find matching exercise in a workout by ID */
  const findExercise = (sourceWorkout, exerciseId) =>
    sourceWorkout.exercises.find((e) => e.id === exerciseId);

  // ── Workout mutation handlers ─────────────────────────────
  // Immutable updates using functional setState for safety.

  /** Update a single field (weight/reps/rir) in a set */
  const handleUpdateSet = (exerciseId, setId, field, value) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) return set;
            return { ...set, [field]: { value, state: 'filled' } };
          }),
        };
      }),
    }));
  };

  /** Update a field in the next workout (marks as user-edited) */
  const handleUpdateNextSet = (exerciseId, setId, field, value) => {
    setNextWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) return set;
            return { ...set, [field]: { value, edited: true } };
          }),
        };
      }),
    }));
  };

  /** Remove a set from an exercise */
  const handleDeleteSet = (exerciseId, setId) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.filter((set) => set.id !== setId),
        };
      }),
    }));
  };

  /** Append a new empty set to an exercise */
  const handleAddSet = (exerciseId) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: `set-${Date.now()}`,
              weight: { value: null, state: 'empty' },
              reps: { value: null, state: 'empty' },
              rir: { value: null, state: 'empty' },
            },
          ],
        };
      }),
    }));
  };

  /** Update the note text for an exercise */
  const handleUpdateNote = (exerciseId, note) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return { ...exercise, note };
      }),
    }));
  };

  /** Insert a new exercise after the given exercise (placeholder for future implementation) */
  const handleAddExercise = (afterExerciseId) => {
    // TODO: Open exercise picker screen
    console.log('Add exercise after:', afterExerciseId);
  };

  // ── Derived state ─────────────────────────────────────────

  /** Count of fully completed sets (weight + reps filled) */
  const completedSets = workout.exercises.reduce((total, exercise) =>
    total + exercise.sets.filter(
      (set) => set.weight.state === 'filled' && set.reps.state === 'filled'
    ).length, 0
  );

  /** Total sets across all exercises */
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length, 0
  );

  // ── Loading state ─────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.textSecondary} />
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Keyboard-aware scrollable content area */}
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={120}
      >
        {/* Workout header: title, progress badge, last session date */}
        <View style={styles.header}>
          <Text variant="caption" style={styles.headerLabel}>WORKOUT</Text>
          <Text variant="screenTitle">{workout.name || 'Pectoraux'}</Text>
          <View style={styles.headerMeta}>
            <View style={styles.progressBadge}>
              <Text variant="caption" style={styles.progressText}>
                {completedSets}/{totalSets} sets done
              </Text>
            </View>
            <Text variant="caption" style={styles.lastDate}>· 4 days ago</Text>
          </View>
        </View>

        {/* Exercise cards — one per exercise in the workout */}
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            previousExercise={findExercise(previousWorkout, exercise.id)}
            nextExercise={findExercise(nextWorkout, exercise.id)}
            onUpdateSet={handleUpdateSet}
            onUpdateNextSet={handleUpdateNextSet}
            onDeleteSet={handleDeleteSet}
            onAddSet={handleAddSet}
            onAddExercise={handleAddExercise}
            onUpdateNote={handleUpdateNote}
            editMode={editMode}
          />
        ))}
      </KeyboardAwareScrollView>

      {/* Bottom navigation bar with timer and edit controls */}
      <BottomBar
        timerState={timerState}
        timeRemaining={timeRemaining}
        editMode={editMode}
        onPlayPause={playPause}
        onReset={reset}
        onTimerPress={() => setShowTimerPicker(true)}
        onEditToggle={() => setEditMode((prev) => !prev)}
        onLLMPress={() => {}}
        bottomInset={insets.bottom}
      />

      {/* Timer duration picker overlay */}
      <TimerPicker
        visible={showTimerPicker}
        currentDuration={duration}
        onConfirm={(seconds) => {
          updateDuration(seconds);
          setShowTimerPicker(false);
        }}
        onClose={() => setShowTimerPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /** Full-screen container */
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  /** Centered loading spinner */
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Workout header block */
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  /** "WORKOUT" label above the title */
  headerLabel: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  /** Progress badge + last date row */
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  /** Green progress counter badge */
  progressBadge: {
    backgroundColor: COLORS.successLight,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  progressText: {
    color: COLORS.success,
    fontFamily: FONT_FAMILY.medium,
  },
  /** "· 4 days ago" text */
  lastDate: {
    color: COLORS.textSecondary,
  },
  /** Scroll container */
  scrollView: {
    flex: 1,
  },
  /** Inner scroll padding — bottom padding clears the BottomBar */
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});