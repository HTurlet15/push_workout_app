import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../theme/theme';

/**
 * Set row for the Next view with delta indicators.
 * Each field shows the planned next value in an orange badge,
 * with a fixed-width delta indicator on the right (↑, ↓, or =).
 *
 * Delta compares next value to current value.
 * Edited values (user-modified) are displayed in dark orange.
 *
 * @param {Object} props
 * @param {number} props.index - Set position (0-based), displayed as 1-based.
 * @param {Object} props.currentSet - Current workout set data (field-level state).
 * @param {Object} props.nextSet - Next planned set data.
 * @param {Function} [props.onUpdateNextSet] - Callback: (field, value) for next set edits.
 */
export default function NextSetRow({ index, currentSet, nextSet, onUpdateNextSet }) {
  /**
   * Resolves a next field into value, edited flag, and display state.
   */
  const resolveNextField = (field) => {
    if (field === null || field === undefined) {
      return { value: null, edited: false, state: 'empty' };
    }

    if (typeof field === 'object') {
      return { value: field.value, edited: !!field.edited, state: field.edited ? 'filled' : 'previous' };
    }

    return { value: field, edited: false, state: 'previous' };
  };

  /**
   * Computes the delta between next and current values.
   * Returns { label, style } for the indicator.
   */
  const getDelta = (nextValue, currentValue) => {
    if (nextValue === null || nextValue === undefined || currentValue === null || currentValue === undefined) {
      return { label: '', style: styles.deltaEmpty };
    }

    const diff = nextValue - currentValue;

    if (diff > 0) {
      return { label: `↑${Number.isInteger(diff) ? diff : diff.toFixed(1)}`, style: styles.deltaUp };
    }

    if (diff < 0) {
      return { label: `↓${Number.isInteger(Math.abs(diff)) ? Math.abs(diff) : Math.abs(diff).toFixed(1)}`, style: styles.deltaDown };
    }

    return { label: '=', style: styles.deltaSame };
  };

  const nextWeight = resolveNextField(nextSet.weight);
  const nextReps = resolveNextField(nextSet.reps);

  const weightDelta = getDelta(nextWeight.value, currentSet.weight.value);
  const repsDelta = getDelta(nextReps.value, currentSet.reps.value);

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.setCell}>
        {index + 1}
      </Text>

      <View style={styles.weightCell}>
        <View style={styles.badgeGroup}>
          <View style={styles.badgeWrapper}>
            <SetInput
              value={nextWeight.value}
              unit="kg"
              state={nextWeight.state}
              onChangeValue={(val) => onUpdateNextSet?.('weight', val)}
              badgeColor={COLORS.nextBadge}
              textColor={nextWeight.edited ? COLORS.nextEdited : COLORS.nextBadgeText}
            />
          </View>
          <View style={[styles.deltaBox, weightDelta.style]}>
            <Text variant="caption" style={[styles.deltaText, weightDelta.style]}>
              {weightDelta.label}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.repsCell}>
        <View style={styles.badgeGroup}>
          <View style={styles.badgeWrapper}>
            <SetInput
              value={nextReps.value}
              state={nextReps.state}
              onChangeValue={(val) => onUpdateNextSet?.('reps', val)}
              badgeColor={COLORS.nextBadge}
              textColor={nextReps.edited ? COLORS.nextEdited : COLORS.nextBadgeText}
            />
          </View>
          <View style={[styles.deltaBox, repsDelta.style]}>
            <Text variant="caption" style={[styles.deltaText, repsDelta.style]}>
              {repsDelta.label}
            </Text>
          </View>
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
  },
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: FONT_SIZE.subtitle,
    color: COLORS.mediumGray,
  },
  weightCell: {
    flex: 3,
  },
  repsCell: {
    flex: 2,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrapper: {
    flex: 1,
  },
  deltaBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  deltaText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: '700',
  },
  deltaUp: {
    color: COLORS.deltaUp,
  },
  deltaDown: {
    color: COLORS.deltaDown,
  },
  deltaSame: {
    color: COLORS.deltaSame,
  },
  deltaEmpty: {
    color: 'transparent',
  },
});