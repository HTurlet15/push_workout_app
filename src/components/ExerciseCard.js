import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetHeader from './SetHeader';
import SetFooter from './SetFooter';
import SetRow from './SetRow';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Displays a single exercise with its associated sets.
 * Acts as a visual card grouping all set data for one movement.
 *
 * @param {Object} props
 * @param {Object} props.exercise - Exercise data object.
 * @param {string} props.exercise.name - Exercise display name.
 * @param {Array} props.exercise.sets - Array of set objects.
 * @param {Function} [props.onUpdateSet] - Callback: (exerciseId, setId, field, value).
 */
export default function ExerciseCard({ exercise, onUpdateSet }) {
  return (
    <View style={styles.card}>
      <Text variant="title" style={styles.exerciseName}>
        {exercise.name}
      </Text>

      <SetHeader />

      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          index={index}
          set={set}
          onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
        />
      ))}

      <SetFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.xl,
  },
  exerciseName: {
    marginBottom: SPACING.md,
    color: COLORS.exerciseName,
  },
});