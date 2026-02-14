import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/Text';
import ExerciseCard from '../components/ExerciseCard';
import usePersistedState from '../hooks/usePersistedState';
import MOCK_WORKOUT from '../data/mockWorkout';
import MOCK_PREVIOUS_WORKOUT from '../data/mockPreviousWorkout';
import MOCK_NEXT_WORKOUT from '../data/mockNextWorkout';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Main workout session screen.
 * Owns the persisted workout state and passes update callbacks down.
 * Data survives app restarts via AsyncStorage.
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();

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

  /**
   * Finds the matching exercise from a workout by exercise ID.
   *
   * @param {Object} sourceWorkout - Workout to search in.
   * @param {string} exerciseId - Exercise identifier to look up.
   * @returns {Object|undefined} Matching exercise or undefined.
   */
  const findExercise = (sourceWorkout, exerciseId) => {
    return sourceWorkout.exercises.find(
      (exercise) => exercise.id === exerciseId
    );
  };

  /**
   * Updates a single field within a specific set in the current workout.
   *
   * @param {string} exerciseId - Target exercise identifier.
   * @param {string} setId - Target set identifier.
   * @param {string} field - Field name to update ('weight', 'reps', or 'rir').
   * @param {number} value - New value for the field.
   */
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

  /**
   * Updates a single field within a specific set in the next planned workout.
   *
   * @param {string} exerciseId - Target exercise identifier.
   * @param {string} setId - Target set identifier.
   * @param {string} field - Field name to update ('weight' or 'reps').
   * @param {number} value - New value for the field.
   */
  const handleUpdateNextSet = (exerciseId, setId, field, value) => {
    setNextWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set) => {
            if (set.id !== setId) return set;

            return { ...set, [field]: value };
          }),
        };
      }),
    }));
  };

  /** Show loading spinner while data is being read from storage */
  if (isLoading) {
    return (
      <View style={[styles.screen, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="hero">{workout.muscleGroup.toUpperCase()}</Text>
        <Text variant="caption" style={{ marginTop: SPACING.xs }}>
          Last: 4 days ago
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});