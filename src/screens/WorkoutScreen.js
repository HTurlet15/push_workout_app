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
 * Rest timer auto-start flow:
 * - Completing a set (weight + reps filled) auto-starts the timer
 * - justCompletedSetId tracks which set just completed for checkmark animation
 * - The ID is cleared after 2 seconds to reset the animation trigger
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [newExerciseId, setNewExerciseId] = useState(null);

  /**
   * ID of the set that was just completed — triggers checkmark animation.
   * Cleared after 2s so the animation can re-trigger if needed.
   */
  const [justCompletedSetId, setJustCompletedSetId] = useState(null);

  const scrollRef = useRef(null);
  const exerciseLayouts = useRef({});

  const {
    timerState, timeRemaining, duration,
    playPause, reset, updateDuration, startWithDuration,
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

  useSessionRotation({
    workout, setWorkout,
    previousWorkout, setPreviousWorkout,
    nextWorkout, setNextWorkout,
    isLoading,
  });

  // ── Helpers ───────────────────────────────────────────────

  const findExercise = (sourceWorkout, exerciseId) =>
    sourceWorkout.exercises.find((e) => e.id === exerciseId);

  /**
   * Check if updating a field would complete a set.
   * Returns true only if this update transitions the set from incomplete → complete.
   */
  const wouldCompleteSet = (exerciseId, setId, field) => {
    const exercise = workout.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return false;

    const set = exercise.sets.find((s) => s.id === setId);
    if (!set) return false;

    const weightFilled = field === 'weight' ? true : set.weight.state === 'filled';
    const repsFilled = field === 'reps' ? true : set.reps.state === 'filled';
    const wasAlreadyComplete = set.weight.state === 'filled' && set.reps.state === 'filled';

    return weightFilled && repsFilled && !wasAlreadyComplete;
  };

  // ── Workout mutation handlers ─────────────────────────────

  /**
   * Update a single field in a set.
   * If this completes the set: auto-start timer + trigger checkmark animation.
   */
  const handleUpdateSet = (exerciseId, setId, field, value) => {
    const willComplete = wouldCompleteSet(exerciseId, setId, field);
    const exercise = workout.exercises.find((e) => e.id === exerciseId);

    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((set) => {
            if (set.id !== setId) return set;
            return { ...set, [field]: { value, state: 'filled' } };
          }),
        };
      }),
    }));

    if (willComplete) {
      // Auto-start rest timer
      if (exercise?.restTimerSeconds) {
        startWithDuration(exercise.restTimerSeconds);
      }

      // Trigger checkmark animation, clear after 2s
      setJustCompletedSetId(setId);
      setTimeout(() => setJustCompletedSetId(null), 2000);
    }
  };

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

  const handleUpdateNote = (exerciseId, note) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return { ...exercise, note };
      }),
    }));
  };

  const handleUpdateName = (exerciseId, name) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return { ...exercise, name };
      }),
    }));
  };

  const handleUpdateRest = (exerciseId, seconds) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return { ...exercise, restTimerSeconds: seconds };
      }),
    }));
  };

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

  const handleDeleteExercise = (exerciseId) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.id !== exerciseId),
    }));
  };

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
              onUpdateRest={handleUpdateRest}
              justCompletedSetId={justCompletedSetId}
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