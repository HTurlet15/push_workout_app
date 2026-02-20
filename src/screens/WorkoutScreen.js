import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
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
 * - Manages edit mode state for add/delete sets, exercises, and notes
 * - Provides rest timer with configurable duration
 * - Scrolls to newly added exercises using onLayout measurement
 *
 * Rest timer flow:
 * - Each exercise has its own restTimerSeconds in its data
 * - Tapping the rest badge in an exercise footer sets the global timer
 *   to that exercise's rest duration via updateDuration
 * - The global timer in BottomBar counts down independently
 *
 * All workout mutations are defined here and passed down via callbacks.
 * Data flows down, events flow up.
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);

  /** ID of the most recently created exercise — used to trigger scroll-to */
  const [newExerciseId, setNewExerciseId] = useState(null);

  /** Ref to KeyboardAwareScrollView for programmatic scrolling */
  const scrollRef = useRef(null);

  /** Stores { y, height } layout of each exercise card, keyed by exercise ID */
  const exerciseLayouts = useRef({});

  /** Rest timer hook — manages countdown lifecycle */
  const {
    timerState, timeRemaining, duration,
    playPause, reset, updateDuration,
  } = useRestTimer(90);

  // ── Persisted workout data ────────────────────────────────

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

  /** Update the name of an exercise */
  const handleUpdateName = (exerciseId, name) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return { ...exercise, name };
      }),
    }));
  };

  /**
   * Insert a new exercise after the given exercise with 3 empty sets.
   * Includes default restTimerSeconds. Sets newExerciseId for scroll-to.
   */
  const handleAddExercise = (afterExerciseId) => {
    const id = `exercise-${Date.now()}`;
    setWorkout((prev) => {
      const exerciseIndex = prev.exercises.findIndex((e) => e.id === afterExerciseId);
      const newExercise = {
        id,
        name: 'New Exercise',
        note: undefined,
        restTimerSeconds: 90,
        sets: [
          { id: `set-${Date.now()}-1`, weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
          { id: `set-${Date.now()}-2`, weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
          { id: `set-${Date.now()}-3`, weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
        ],
      };
      const newExercises = [...prev.exercises];
      newExercises.splice(exerciseIndex + 1, 0, newExercise);
      return { ...prev, exercises: newExercises };
    });
    setNewExerciseId(id);
  };

  /** Remove an entire exercise from the workout */
  const handleDeleteExercise = (exerciseId) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.id !== exerciseId),
    }));
  };

  /**
   * Called when each exercise card wrapper measures its layout.
   * If the card is the newly created exercise, scroll to position it
   * ~100px below the top of the screen, then clear the trigger.
   */
  const handleExerciseLayout = (exerciseId, event) => {
    const layout = event.nativeEvent.layout;
    exerciseLayouts.current[exerciseId] = layout;

    if (exerciseId === newExerciseId) {
      const targetY = layout.y - 100;
      setTimeout(() => {
        scrollRef.current?.scrollToPosition?.(0, Math.max(targetY, 0), true);
        setNewExerciseId(null);
      }, 150);
    }
  };

  /**
   * Tap rest badge in exercise footer → set global timer to that exercise's rest.
   * Looks up the exercise's own restTimerSeconds from workout data.
   */
  const handleRestPress = (exerciseId) => {
    const exercise = workout.exercises.find((e) => e.id === exerciseId);
    if (exercise?.restTimerSeconds) {
      updateDuration(exercise.restTimerSeconds);
    }
  };

  // ── Derived state ─────────────────────────────────────────

  const completedSets = workout.exercises.reduce((total, exercise) =>
    total + exercise.sets.filter(
      (set) => set.weight.state === 'filled' && set.reps.state === 'filled'
    ).length, 0
  );

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
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={120}
      >
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

        {workout.exercises.map((exercise) => (
          <View
            key={exercise.id}
            onLayout={(e) => handleExerciseLayout(exercise.id, e)}
          >
            <ExerciseCard
              exercise={exercise}
              previousExercise={findExercise(previousWorkout, exercise.id)}
              nextExercise={findExercise(nextWorkout, exercise.id)}
              onUpdateSet={handleUpdateSet}
              onUpdateNextSet={handleUpdateNextSet}
              onDeleteSet={handleDeleteSet}
              onAddSet={handleAddSet}
              onUpdateNote={handleUpdateNote}
              onUpdateName={handleUpdateName}
              onAddExercise={handleAddExercise}
              onDeleteExercise={handleDeleteExercise}
              onRestPress={handleRestPress}
              editMode={editMode}
            />
          </View>
        ))}
      </KeyboardAwareScrollView>

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
  screen: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  headerLabel: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
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
  lastDate: {
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});