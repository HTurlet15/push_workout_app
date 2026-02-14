import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Renders a single set row within an exercise card.
 * Each value (weight, reps, RIR) is a tappable SetInput badge
 * with its own independent visual state.
 * Row turns green when both weight and reps are filled.
 *
 * @param {Object} props
 * @param {number} props.index - Set position (0-based), displayed as 1-based.
 * @param {Object} props.set - Full set object with field-level state.
 * @param {Function} [props.onUpdateSet] - Callback: (field, value) when a set value changes.
 */
export default function SetRow({ index, set, onUpdateSet }) {
  const isCompleted =
    set.weight.state === 'filled' && set.reps.state === 'filled';

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <Text variant="body" style={styles.setCell}>
        {index + 1}
      </Text>

      <View style={styles.weightCell}>
        <SetInput
          value={set.weight.value}
          unit="kg"
          state={set.weight.state}
          onChangeValue={(val) => onUpdateSet?.('weight', val)}
        />
      </View>

      <View style={styles.repsCell}>
        <SetInput
          value={set.reps.value}
          state={set.reps.state}
          onChangeValue={(val) => onUpdateSet?.('reps', val)}
        />
      </View>

      <View style={styles.rirCell}>
        <SetInput
          value={set.rir.value}
          state={set.rir.state}
          onChangeValue={(val) => onUpdateSet?.('rir', val)}
        />
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
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
    gap: SPACING.xs,
  },
  completedContainer: {
    backgroundColor: COLORS.successLight,
  },
  setCell: {
    flex: 1,
    textAlign: 'center',
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