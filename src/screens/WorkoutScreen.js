import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/Text';
import ExerciseCard from '../components/ExerciseCard';
import MOCK_WORKOUT from '../data/mockWorkout';
import MOCK_PREVIOUS_WORKOUT from '../data/mockPreviousWorkout';
import MOCK_NEXT_WORKOUT from '../data/mockNextWorkout';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Main workout session screen.
 * Owns the workout state and next workout state.
 * Passes data and update callbacks down to child components.
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [workout, setWorkout] = useState(MOCK_WORKOUT);
  const [nextWorkout, setNextWorkout] = useState(MOCK_NEXT_WORKOUT);

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
            previousExercise={findExercise(MOCK_PREVIOUS_WORKOUT, exercise.id)}
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