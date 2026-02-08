import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/Text';
import ExerciseCard from '../components/ExerciseCard';
import MOCK_WORKOUT from '../data/mockWorkout';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Main workout session screen.
 * Owns the workout state and passes update callbacks down to child components.
 * Currently initialized with mock data — will connect to persistent storage later.
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [workout, setWorkout] = useState(MOCK_WORKOUT);

  /**
   * Updates a single field within a specific set.
   * Creates a new state object (immutable update) to trigger re-render.
   * Automatically transitions state to 'filled' on edit.
   * State comparison with planned data will be handled here once available.
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
            onUpdateSet={handleUpdateSet}
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
});