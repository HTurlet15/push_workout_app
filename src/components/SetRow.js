import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Renders a single set row within an exercise card.
 * Each value (weight, reps, RIR) is a tappable SetInput badge.
 * Background turns green when the set is marked as completed.
 *
 * Column widths are proportional (1:3:2:2) to account for varying
 * content lengths and ensure visually even spacing between columns.
 *
 * @param {Object} props
 * @param {number} props.index - Set position (0-based), displayed as 1-based.
 * @param {number} props.weight - Weight lifted in kilograms.
 * @param {number} props.reps - Number of repetitions performed.
 * @param {number|null} [props.rir] - Reps In Reserve. Displays "—" when null.
 * @param {boolean} props.completed - Whether the set has been logged.
 * @param {'filled'|'previous'|'planned'|'empty'} [props.state='empty'] - Visual state for all inputs.
 */
export default function SetRow({ index, weight, reps, rir, completed, state = 'empty' }) {
  return (
    <View style={[styles.container, completed && styles.completedContainer]}>
      <Text variant="body" style={styles.setCell}>
        {index + 1}
      </Text>

      <View style={styles.weightCell}>
        <SetInput value={weight} unit="kg" state={state} />
      </View>

      <View style={styles.repsCell}>
        <SetInput value={reps} state={state} />
      </View>

      <View style={styles.rirCell}>
        <SetInput value={rir} state={rir !== null && rir !== undefined ? state : 'empty'} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  completedContainer: {
    backgroundColor: COLORS.successLight,
  },
  setCell: {
    flex: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  weightCell: {
    flex: 3,
  },
  repsCell: {
    flex: 2,
  },
  rirCell: {
    flex: 2,
  },
});