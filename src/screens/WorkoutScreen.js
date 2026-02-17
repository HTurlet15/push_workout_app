import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/Text';
import ExerciseCard from '../components/ExerciseCard';
import usePersistedState from '../hooks/usePersistedState';
import useSessionRotation from '../hooks/useSessionRotation';
import MOCK_WORKOUT from '../data/mockWorkout';
import MOCK_PREVIOUS_WORKOUT from '../data/mockPreviousWorkout';
import MOCK_NEXT_WORKOUT from '../data/mockNextWorkout';
import { COLORS, SPACING } from '../theme/theme';
import BottomBar from '../components/BottomBar';
import useRestTimer from '../hooks/useRestTimer';
import TimerPicker from '../components/TimerPicker';
import { useState } from 'react';
import {RADIUS} from '../theme/theme'

/**
 * Main workout session screen.
 * Owns the persisted workout state and handles session rotation.
 */
export default function WorkoutScreen() {
    const insets = useSafeAreaInsets();

    const {
    timerState,
    timeRemaining,
    duration,
    playPause,
    reset,
    updateDuration,
  } = useRestTimer(90);

  const [showTimerPicker, setShowTimerPicker] = useState(false);

    const [workout, setWorkout, workoutLoading] = usePersistedState(
      'push_current_workout',
      MOCK_WORKOUT
    );

    const [previousWorkout, setPreviousWorkout, previousLoading] = usePersistedState(
      'push_previous_workout',
      MOCK_PREVIOUS_WORKOUT
    );

    const [nextWorkout, setNextWorkout, nextLoading] = usePersistedState(
      'push_next_workout',
      MOCK_NEXT_WORKOUT
    );

    const isLoading = workoutLoading || previousLoading || nextLoading;

    /** Check and perform session rotation if 12h have elapsed */
    useSessionRotation({
      workout,
      setWorkout,
      previousWorkout,
      setPreviousWorkout,
      nextWorkout,
      setNextWorkout,
      isLoading,
    });

    const findExercise = (sourceWorkout, exerciseId) => {
      return sourceWorkout.exercises.find(
        (exercise) => exercise.id === exerciseId
      );
    };

    const handleUpdateSet = (exerciseId, setId, field, value) => {
      setWorkout((prev) => ({
        ...prev,
        exercises: prev.exercises.map((exercise) => {
          if (exercise.id !== exerciseId) return exercise;

          return {
            ...exercise,
            sets: exercise.sets.map((set) => {
              if (set.id !== setId) return set;

              return {
                ...set,
                [field]: { value, state: 'filled' },
              };
            }),
          };
        }),
      }));
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

    const completedSets = workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(
        (set) => set.weight.state === 'filled' && set.reps.state === 'filled'
      ).length;
    }, 0);

    const totalSets = workout.exercises.reduce(
      (total, exercise) => total + exercise.sets.length, 0
    );

    if (isLoading) {
      return (
        <View style={[styles.screen, styles.loadingContainer, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      );
    }

    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="caption" style={styles.headerLabel}>WORKOUT</Text>
            <Text variant="hero" style={styles.headerTitle}>Pectoraux</Text>
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
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              previousExercise={findExercise(previousWorkout, exercise.id)}
              nextExercise={findExercise(nextWorkout, exercise.id)}
              onUpdateSet={handleUpdateSet}
              onUpdateNextSet={handleUpdateNextSet}
            />
          ))}
        </ScrollView>

        <BottomBar
          timerState={timerState}
          timeRemaining={timeRemaining}
          onPlayPause={playPause}
          onReset={reset}
          onTimerPress={() => setShowTimerPicker(true)}
          onAddSet={() => {}}
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
  headerTitle: {
    color: COLORS.textPrimary,
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
    color: COLORS.timerDone,
    fontWeight: '500',
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