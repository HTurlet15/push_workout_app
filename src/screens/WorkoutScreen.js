import { View, Animated, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useCallback, useEffect } from 'react';
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
 * Exercise add/delete animations use Animated API:
 * - New exercises tracked via newExerciseIds for pop-in
 * - Deleted exercises animated out before actual removal
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [editMode, setEditMode] = useState(false);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [newExerciseId, setNewExerciseId] = useState(null);
  const [justCompletedSetId, setJustCompletedSetId] = useState(null);

  /** Set of exercise IDs that were just added — triggers pop-in */
  const [newExerciseIds, setNewExerciseIds] = useState(new Set());

  /** Exercise IDs currently animating out */
  const [deletingExerciseIds, setDeletingExerciseIds] = useState(new Set());

  /** Animated values for exercises being deleted */
  const exerciseDeleteAnims = useRef({});

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

      // Trigger checkmark animation
      setJustCompletedSetId(setId);
      setTimeout(() => setJustCompletedSetId(null), 2000);

      // Update last activity timestamp
      setWorkout((prev) => ({
        ...prev,
        completedAt: new Date().toISOString(),
      }));
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

  /**
   * Add a set with a specific ID (generated by ExerciseCard for animation tracking).
   * Falls back to generating an ID if none provided.
   */
  const handleAddSet = (exerciseId, newId) => {
    const id = newId || `set-${Date.now()}`;
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id,
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

  /**
   * Add exercise with pop-in animation.
   */
  const handleAddExercise = (afterExerciseId) => {
    const id = `exercise-${Date.now()}`;

    // Track as new for pop-in
    setNewExerciseIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setNewExerciseIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 500);

    const ts = Date.now();
    const currentSets = [
      { id: `set-${ts}-1`, weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
      { id: `set-${ts}-2`, weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
      { id: `set-${ts}-3`, weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
    ];
    const nextSets = [
      { id: `set-${ts}-n1`, weight: null, reps: null },
      { id: `set-${ts}-n2`, weight: null, reps: null },
      { id: `set-${ts}-n3`, weight: null, reps: null },
    ];

    setWorkout((prev) => {
      const exerciseIndex = prev.exercises.findIndex((e) => e.id === afterExerciseId);
      const newExercise = {
        id,
        name: 'New Exercise',
        note: undefined,
        restTimerSeconds: 90,
        sets: currentSets,
      };
      const newExercises = [...prev.exercises];
      newExercises.splice(exerciseIndex + 1, 0, newExercise);
      return { ...prev, exercises: newExercises };
    });

    // Also create the exercise in nextWorkout so the Next view is available
    setNextWorkout((prev) => {
      const exerciseIndex = prev.exercises.findIndex((e) => e.id === afterExerciseId);
      const newNextExercise = {
        id,
        name: 'New Exercise',
        sets: nextSets,
      };
      const newExercises = [...prev.exercises];
      newExercises.splice(exerciseIndex + 1, 0, newNextExercise);
      return { ...prev, exercises: newExercises };
    });

    setNewExerciseId(id);
  };

  /**
   * Delete exercise with depop animation.
   */
  const handleDeleteExercise = (exerciseId) => {
    exerciseDeleteAnims.current[exerciseId] = new Animated.Value(1);
    setDeletingExerciseIds((prev) => new Set(prev).add(exerciseId));

    Animated.timing(exerciseDeleteAnims.current[exerciseId], {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDeletingExerciseIds((prev) => {
        const next = new Set(prev);
        next.delete(exerciseId);
        return next;
      });
      delete exerciseDeleteAnims.current[exerciseId];
      setWorkout((prev) => ({
        ...prev,
        exercises: prev.exercises.filter((e) => e.id !== exerciseId),
      }));
    });
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

  /** Human-readable time since last completed workout */
  const lastSessionLabel = (() => {
    if (!previousWorkout?.completedAt) return null;
    const diff = Date.now() - new Date(previousWorkout.completedAt).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return 'just now';
  })();

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

  // ── Render exercise with optional animations ──────────────

  const renderExercise = (exercise) => {
    const deleteAnim = exerciseDeleteAnims.current[exercise.id];
    const isNew = newExerciseIds.has(exercise.id);

    // Wrapper for pop-in or depop
    const wrapWithAnim = (children) => {
      if (deleteAnim) {
        const deleteScale = deleteAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        });
        return (
          <Animated.View style={{ opacity: deleteAnim, transform: [{ scale: deleteScale }] }}>
            {children}
          </Animated.View>
        );
      }
      if (isNew) {
        return <AnimatedExerciseWrapper>{children}</AnimatedExerciseWrapper>;
      }
      return children;
    };

    return (
      <View
        key={exercise.id}
        onLayout={(e) => handleExerciseLayout(exercise.id, e)}
      >
        {wrapWithAnim(
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
        )}
      </View>
    );
  };

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
            {lastSessionLabel && (
              <Text variant="caption" style={styles.lastDate}>· {lastSessionLabel}</Text>
            )}
          </View>
        </View>

        {workout.exercises.map((exercise) => renderExercise(exercise))}
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

/**
 * Wrapper that animates a newly added exercise card with pop-in.
 * Mounts with scale 0.9 + opacity 0, springs to 1.
 */
function AnimatedExerciseWrapper({ children }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ scale }] }}>
      {children}
    </Animated.View>
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