import { View, Animated, StyleSheet } from 'react-native';
import Text from '../common/Text';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';

/**
 * Read-only set row displaying historical data from a previous workout.
 *
 * Weight cell is wrapped in Animated.View with weightFadeAnim for
 * smooth fade on kg/lbs toggle. Reps and RIR are unaffected.
 *
 * @param {number} index                    - Zero-based set position.
 * @param {number|null} weight              - Weight value (already converted by parent).
 * @param {number|null} reps                - Number of repetitions performed.
 * @param {number|null} rir                 - Reps In Reserve.
 * @param {string} unit                     - Weight unit for display suffix.
 * @param {Animated.Value} weightFadeAnim   - Opacity anim for weight cell only.
 */
export default function PreviousSetRow({ index, weight, reps, rir, unit = 'kg', weightFadeAnim }) {
  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.setCell}>
        {index + 1}
      </Text>

      {/* Weight cell — fades on unit toggle */}
      <Animated.View style={[styles.valueCell, weightFadeAnim && { opacity: weightFadeAnim }]}>
        <Text variant="body" style={styles.valueText}>
          {weight !== null && weight !== undefined ? `${weight} ${unit}` : '—'}
        </Text>
      </Animated.View>

      <Text variant="body" style={styles.repsCell}>
        {reps !== null && reps !== undefined ? reps : '—'}
      </Text>

      <Text variant="body" style={styles.rirCell}>
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
    gap: SPACING.xs,
  },
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
  },
  valueCell: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingVertical: SPACING.sm,
  },
  repsCell: {
    flex: 2,
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingVertical: SPACING.sm,
  },
  rirCell: {
    flex: 2,
    textAlign: 'center',
    color: COLORS.textSecondary,
    paddingVertical: SPACING.sm,
  },
});