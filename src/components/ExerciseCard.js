import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import ViewSelector from './ViewSelector';
import SetHeader from './SetHeader';
import SetFooter from './SetFooter';
import SetRow from './SetRow';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Displays a single exercise with its associated sets.
 * Manages its own view state (previous/current/next) independently.
 *
 * @param {Object} props
 * @param {Object} props.exercise - Exercise data object.
 * @param {string} props.exercise.name - Exercise display name.
 * @param {Array} props.exercise.sets - Array of set objects.
 * @param {Function} [props.onUpdateSet] - Callback: (exerciseId, setId, field, value).
 */
export default function ExerciseCard({ exercise, onUpdateSet }) {
  const [activeView, setActiveView] = useState('current');

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text variant="title" style={styles.exerciseName}>
          {exercise.name}
        </Text>
        <ViewSelector activeView={activeView} onChangeView={setActiveView} />
      </View>

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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  exerciseName: {
    color: COLORS.mediumBlue,
  },
});