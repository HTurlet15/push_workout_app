import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../components/Text';
import ExerciseCard from '../components/ExerciseCard';
import MOCK_WORKOUT from '../data/mockWorkout';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Main workout session screen.
 * Displays the muscle group header and a scrollable list of exercises.
 * Currently powered by mock data — will connect to state management later.
 */
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text variant="hero">{MOCK_WORKOUT.muscleGroup.toUpperCase()}</Text>
        <Text variant="caption" style={{ marginTop: SPACING.xs }}>
          Last: 4 days ago
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_WORKOUT.exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
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