import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, SIZE } from '../theme/theme';

/**
 * Set row for the Next view with delta indicators.
 *
 * Each field shows the planned next value in a neutral badge,
 * with a fixed-width delta indicator on the right (↑, ↓, or =).
 * Delta compares the next planned value against the current session value.
 *
 * Supports kg/lbs conversion via displayWeight and unit props from parent.
 * Delta calculation uses raw kg values for accuracy, display uses converted.
 *
 * Color coding:
 * - Inherited (auto-filled) values: muted text (nextBadgeText)
 * - User-edited values: bold primary text (nextEdited)
 * - Delta up: green | Delta down: red | Same: gray
 *
 * No RIR column — future perceived effort can't be pre-planned.
 *
 * @param {number} index              - Zero-based set position, displayed as 1-based.
 * @param {Object} currentSet         - Current session set data (for delta comparison).
 * @param {Object} nextSet            - Next planned set data (raw number or {value, edited}).
 * @param {string} unit               - Weight unit for display ('kg' or 'lbs').
 * @param {Function} displayWeight    - Converts kg value for display in current unit.
 * @param {Function} onUpdateNextSet  - Callback: (field, value) for next set edits.
 */
export default function NextSetRow({ index, currentSet, nextSet, unit = 'kg', displayWeight, onUpdateNextSet }) {
  /**
   * Resolves a next field into a normalized object.
   * Raw numbers are inherited (gray), objects with edited flag are user-modified.
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
   * Computes the delta between next and current values (in raw kg).
   * Returns a label string and corresponding color style.
   */
  const getDelta = (nextValue, currentValue) => {
    if (nextValue == null || currentValue == null) {
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

  /** Deltas computed on raw kg values for accuracy */
  const weightDelta = getDelta(nextWeight.value, currentSet.weight.value);
  const repsDelta = getDelta(nextReps.value, currentSet.reps.value);

  /** Convert weight for display if displayWeight function is provided */
  const displayWeightValue = displayWeight ? displayWeight(nextWeight.value) : nextWeight.value;

  return (
    <View style={styles.container}>
      {/* Set number */}
      <Text variant="caption" style={styles.setCell}>
        {index + 1}
      </Text>

      {/* Weight: badge + delta indicator */}
      <View style={styles.weightCell}>
        <View style={styles.badgeGroup}>
          <View style={styles.badgeWrapper}>
            <SetInput
              value={displayWeightValue}
              unit={unit}
              state={nextWeight.state}
              onChangeValue={(val) => onUpdateNextSet?.('weight', val)}
              badgeColor={COLORS.nextBadge}
              textColor={nextWeight.edited ? COLORS.nextEdited : COLORS.nextBadgeText}
            />
          </View>
          <View style={styles.deltaBox}>
            <Text variant="small" style={[styles.deltaText, weightDelta.style]}>
              {weightDelta.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Reps: badge + delta indicator */}
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
          <View style={styles.deltaBox}>
            <Text variant="small" style={[styles.deltaText, repsDelta.style]}>
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
  /** Set number: muted, medium weight */
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
  },
  /** Flex proportions match header (3:2 for weight:reps) */
  weightCell: {
    flex: 3,
  },
  repsCell: {
    flex: 2,
  },
  /** Badge + delta laid out horizontally */
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.sm,
  },
  badgeWrapper: { flex: 1 },
  /** Fixed-width column for delta indicators — ensures alignment */
  deltaBox: {
    width: SIZE.deltaBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deltaText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
  },
  /** Delta color states */
  deltaUp: { color: COLORS.deltaUp },
  deltaDown: { color: COLORS.deltaDown },
  deltaSame: { color: COLORS.deltaSame },
  deltaEmpty: { color: 'transparent' },
});