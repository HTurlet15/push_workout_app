import { View, Animated, StyleSheet } from 'react-native';
import Text from '../common/Text';
import SetInput from './SetInput';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, SIZE } from '../../theme/theme';

/**
 * Set row for the Next view with delta indicators.
 *
 * Weight badge is wrapped in Animated.View with weightFadeAnim for
 * smooth fade on kg/lbs toggle. Reps badge and deltas are unaffected.
 *
 * @param {number} index                    - Zero-based set position.
 * @param {Object} currentSet               - Current session set data (for delta).
 * @param {Object} nextSet                  - Next planned set data.
 * @param {string} unit                     - Weight unit for display.
 * @param {Function} displayWeight          - Converts kg value for display.
 * @param {Animated.Value} weightFadeAnim   - Opacity anim for weight cell only.
 * @param {Function} onUpdateNextSet        - Callback: (field, value).
 */
export default function NextSetRow({ index, currentSet, nextSet, unit = 'kg', displayWeight, weightFadeAnim, onUpdateNextSet }) {
  const resolveNextField = (field) => {
    if (field === null || field === undefined) {
      return { value: null, edited: false, state: 'empty' };
    }
    if (typeof field === 'object') {
      return { value: field.value, edited: !!field.edited, state: field.edited ? 'filled' : 'previous' };
    }
    return { value: field, edited: false, state: 'previous' };
  };

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

  const weightDelta = getDelta(nextWeight.value, currentSet.weight.value);
  const repsDelta = getDelta(nextReps.value, currentSet.reps.value);

  const displayWeightValue = displayWeight ? displayWeight(nextWeight.value) : nextWeight.value;

  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.setCell}>
        {index + 1}
      </Text>

      {/* Weight: badge + delta — badge fades on unit toggle */}
      <View style={styles.weightCell}>
        <View style={styles.badgeGroup}>
          <Animated.View style={[styles.badgeWrapper, weightFadeAnim && { opacity: weightFadeAnim }]}>
            <SetInput
              value={displayWeightValue}
              unit={unit}
              state={nextWeight.state}
              onChangeValue={(val) => onUpdateNextSet?.('weight', val)}
              badgeColor={nextWeight.edited ? COLORS.nextBadgeEdited: COLORS.nextBadge}
              textColor={nextWeight.edited ? COLORS.nextEdited : COLORS.nextBadgeText}
            />
          </Animated.View>
          <View style={styles.deltaBox}>
            <Text variant="small" style={[styles.deltaText, weightDelta.style]}>
              {weightDelta.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Reps: badge + delta — no fade */}
      <View style={styles.repsCell}>
        <View style={styles.badgeGroup}>
          <View style={styles.badgeWrapper}>
            <SetInput
              value={nextReps.value}
              state={nextReps.state}
              onChangeValue={(val) => onUpdateNextSet?.('reps', val)}
              badgeColor={nextReps.edited ? COLORS.nextBadgeEdited: COLORS.nextBadge}
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
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
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
    paddingRight: SPACING.sm,
  },
  badgeWrapper: { flex: 1 },
  deltaBox: {
    width: SIZE.deltaBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deltaText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.bold,
  },
  deltaUp: { color: COLORS.deltaUp },
  deltaDown: { color: COLORS.deltaDown },
  deltaSame: { color: COLORS.deltaSame },
  deltaEmpty: { color: 'transparent' },
});