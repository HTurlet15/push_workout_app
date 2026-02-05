import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Renders a single set row within an exercise card.
 * Displays set number, weight, reps, and optionally RIR (Reps In Reserve).
 * Visual state changes based on completion status.
 *
 * @param {Object} props
 * @param {number} props.index - Set position (0-based), displayed as 1-based.
 * @param {number} props.weight - Weight lifted in kilograms.
 * @param {number} props.reps - Number of repetitions performed.
 * @param {number|null} [props.rir] - Reps In Reserve. Hidden when null.
 * @param {boolean} props.completed - Whether the set has been logged.
 */
export default function SetRow({ index, weight, reps, rir, completed }) {
  return (
    <View style={[styles.container, completed && styles.completedContainer]}>
      <Text
        variant="body"
        style={[styles.cell, styles.indexCell, completed && styles.completedText]}
      >
        {index + 1}
      </Text>

      <Text variant="body" style={[styles.cell, styles.valueCell]}>
        {weight} kg
      </Text>

      <Text variant="body" style={[styles.cell, styles.valueCell]}>
        {reps}
      </Text>

      {rir !== null && rir !== undefined && (
        <Text variant="body" style={[styles.cell, styles.valueCell]}>
          {rir}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  completedContainer: {
    backgroundColor: COLORS.surface,
  },
  cell: {
    textAlign: 'center',
  },
  indexCell: {
    width: 32,
    fontWeight: '600',
  },
  completedText: {
    color: COLORS.success,
  },
  valueCell: {
    flex: 1,
  },
});