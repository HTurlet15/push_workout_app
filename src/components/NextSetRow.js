import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Set row for the Next view.
 * Current values are displayed as read-only reference labels (gray, small)
 * with an arrow pointing to the editable next value badge.
 * Weight columns are wider than Reps to match NextSetHeader proportions.
 *
 * @param {Object} props
 * @param {number} props.index - Set position (0-based), displayed as 1-based.
 * @param {Object} props.currentSet - Current workout set data (field-level state).
 * @param {Object} props.nextSet - Next planned set data (raw values).
 * @param {Function} [props.onUpdateNextSet] - Callback: (field, value) for next set edits.
 */
export default function NextSetRow({ index, currentSet, nextSet, onUpdateNextSet }) {
  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.setCell}>
        {index + 1}
      </Text>

      <View style={styles.weightGroup}>
        <Text variant="caption" style={[styles.referenceText, styles.weightCurrentLabel]}>
          {currentSet.weight.value} →
        </Text>
        <View style={styles.weightNextLabel}>
          <SetInput
            value={nextSet.weight}
            unit="kg"
            state="previous"
            onChangeValue={(val) => onUpdateNextSet?.('weight', val)}
          />
        </View>
      </View>

      <View style={styles.repsGroup}>
        <Text variant="caption" style={[styles.referenceText,styles.repCurrentLabel]}>
          {currentSet.reps.value} →
        </Text>
        <View style={styles.repNextLabel}>
          <SetInput
            value={nextSet.reps}
            state="previous"
            onChangeValue={(val) => onUpdateNextSet?.('reps', val)}
          />
        </View>
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
        gap: SPACING.sm,
    },
    setCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '600',
    },
    weightGroup: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    repsGroup: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    weightCurrentLabel: {
        flex: 1,
        textAlign: 'center',
    },
    weightNextLabel: {
        flex: 2,
        textAlign: 'center',
    },
    repCurrentLabel : {
        flex: 1,
        textAlign: 'center',
    },
    repNextLabel : {
        flex: 1,
        textAlign: 'center',
    },

    referenceText: {
        color: COLORS.mediumGray,
    },
});