import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useState, useRef, useCallback, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather } from '@expo/vector-icons';
import Text from '../components/common/Text';
import ExerciseCard from '../components/exercise/ExerciseCard';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE } from '../theme/theme';

/**
 * Single workout session screen.
 *
 * Pure presentation + mutation logic for one workout.
 * All data and timer controls come from the parent (WorkoutPager).
 */
export default function WorkoutScreen({
  workout,
  setWorkout,
  previousWorkout,
  nextWorkout,
  setNextWorkout,
  editMode,
  startWithDuration,
  updateDuration,
  onScroll,
}) {
  const [newExerciseId, setNewExerciseId] = useState(null);
  const [justCompletedSetId, setJustCompletedSetId] = useState(null);
  const [newExerciseIds, setNewExerciseIds] = useState(new Set());
  const [deletingExerciseIds, setDeletingExerciseIds] = useState(new Set());
  const exerciseDeleteAnims = useRef({});

  const scrollRef = useRef(null);
  const exerciseLayouts = useRef({});

  // ── Helpers ───────────────────────────────────────────────

  const findExercise = (sourceWorkout, exerciseId) =>
    sourceWorkout?.exercises?.find((e) => e.id === exerciseId);

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

  // ── Mutation handlers ─────────────────────────────────────

  const handleUpdateSet = (exerciseId, setId, field, value) => {
    // Null value = user cleared the field → revert to previous or empty
    if (value === null) {
      const prevExercise = findExercise(previousWorkout, exerciseId);
      const prevSet = prevExercise?.sets?.find((s) => s.id === setId);
      const prevValue = prevSet?.[field];

      setWorkout((prev) => ({
        ...prev,
        exercises: prev.exercises.map((ex) => {
          if (ex.id !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map((set) => {
              if (set.id !== setId) return set;
              return {
                ...set,
                [field]: prevValue != null
                  ? { value: prevValue, state: 'previous' }
                  : { value: null, state: 'empty' },
              };
            }),
          };
        }),
      }));
      return;
    }

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
      if (exercise?.restTimerSeconds) {
        startWithDuration(exercise.restTimerSeconds);
      }
      setJustCompletedSetId(setId);
      setTimeout(() => setJustCompletedSetId(null), 2000);
      setWorkout((prev) => ({
        ...prev,
        completedAt: new Date().toISOString(),
      }));
    }
  };

  const handleUpdateNextSet = (exerciseId, setId, field, value) => {
    // Null value = user cleared the field → revert to unedited state
    if (value === null) {
      setNextWorkout((prev) => ({
        ...prev,
        exercises: prev.exercises.map((exercise) => {
          if (exercise.id !== exerciseId) return exercise;
          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id !== setId) return set;
              return { ...set, [field]: null };
            }),
          };
        }),
      }));
      return;
    }

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

  const handleUpdateRepRange = (exerciseId, repRange) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        return { ...exercise, repRange };
      }),
    }));
  };

  const handleAddExercise = (afterExerciseId) => {
    const id = `exercise-${Date.now()}`;

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
        repRange: null,
        sets: currentSets,
      };
      const newExercises = [...prev.exercises];
      newExercises.splice(exerciseIndex + 1, 0, newExercise);
      return { ...prev, exercises: newExercises };
    });

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

  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length, 0
  );

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

  // ── Render exercise ───────────────────────────────────────

  const renderExercise = (exercise, exerciseIndex) => {
    const deleteAnim = exerciseDeleteAnims.current[exercise.id];
    const isNew = newExerciseIds.has(exercise.id);

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
            onUpdateRepRange={handleUpdateRepRange}
            justCompletedSetId={justCompletedSetId}
            editMode={editMode}
            isFirst={exerciseIndex === 0}
          />
        )}
      </View>
    );
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <KeyboardAwareScrollView
      ref={scrollRef}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={120}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.header}>
        <Text variant="screenTitle">{workout.name}</Text>
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

      {workout.exercises.map((exercise, index) => renderExercise(exercise, index))}

      {/* Add exercise button — visible when empty OR in edit mode */}
      {(workout.exercises.length === 0 || editMode) && (
        <Pressable
          style={({ pressed }) => [
            styles.addExerciseBtn,
            pressed && styles.addExerciseBtnPressed,
          ]}
          onPress={() => handleAddExercise(
            workout.exercises.length > 0
              ? workout.exercises[workout.exercises.length - 1].id
              : undefined
          )}
        >
          <Feather name="plus" size={SIZE.iconChevron} color={COLORS.textSecondary} />
          <Text style={styles.addExerciseBtnText}>Add Exercise</Text>
        </Pressable>
      )}
    </KeyboardAwareScrollView>
  );
}

/**
 * Wrapper that animates a newly added exercise card with pop-in.
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
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

  // ── Add exercise button ───────────────────────────────────

  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderWidth: SIZE.borderAccent,
    borderColor: COLORS.mediumGray,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  addExerciseBtnPressed: {
    backgroundColor: COLORS.lightGray,
  },
  addExerciseBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
});