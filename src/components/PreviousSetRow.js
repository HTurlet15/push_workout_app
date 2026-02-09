import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Read-only set row displaying historical data from a previous workout.
 * All values are displayed in secondary color with no interaction.
 *
 * @param {Object} props
 * @param {number} props.index - Set position (0-based), displayed as 1-based.
 * @param {number} props.weight - Weight lifted in kilograms.
 * @param {number} props.reps - Number of repetitions performed.
 * @param {number|null} [props.rir] - Reps In Reserve. Displays "—" when null.
 */
export default function PreviousSetRow({ index, weight, reps, rir }) {
  return (
    <View style={styles.container}>
      <Text variant="body" style={[styles.cell, styles.setCell]}>
        {index + 1}
      </Text>

      <Text variant="body" style={[styles.cell, styles.weightCell]}>
        {weight} kg
      </Text>

      <Text variant="body" style={[styles.cell, styles.repsCell]}>
        {reps}
      </Text>

      <Text variant="body" style={[styles.cell, styles.rirCell]}>
        {rir !== null && rir !== undefined ? rir : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  cell: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingVertical: SPACING.sm,
  },
  setCell: {
    flex: 1,
    fontWeight: '600',
  },
  weightCell: {
    flex: 4,
  },
  repsCell: {
    flex: 2,
  },
  rirCell: {
    flex: 2,
  },
});