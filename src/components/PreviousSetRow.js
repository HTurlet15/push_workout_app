import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

/**
 * Read-only set row displaying historical data from a previous workout.
 *
 * All values are shown in secondary (gray) text with no interaction.
 * Null values display as "-" for clean empty state handling.
 *
 * Flex proportions (1:3:2:2) match SetRow and SetHeader for alignment.
 *
 * @param {number} index         - Zero-based set position, displayed as 1-based.
 * @param {number|null} weight   - Weight lifted in kilograms.
 * @param {number|null} reps     - Number of repetitions performed.
 * @param {number|null} rir      - Reps In Reserve. Displays "-" when null.
 */
export default function PreviousSetRow({ index, weight, reps, rir }) {
  return (
    <View style={styles.container}>
      <Text variant="caption" style={styles.setCell}>
        {index + 1}
      </Text>

      <Text variant="body" style={styles.valueCell}>
        {weight !== null && weight !== undefined ? `${weight} kg` : '-'}
      </Text>

      <Text variant="body" style={styles.repsCell}>
        {reps !== null && reps !== undefined ? reps : '-'}
      </Text>

      <Text variant="body" style={styles.rirCell}>
        {rir !== null && rir !== undefined ? rir : '-'}
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
  /** Set number: muted, semibold to match other views */
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
  },
  /** Value cells: secondary color for historical context */
  valueCell: {
    flex: 3,
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