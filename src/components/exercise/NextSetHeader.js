import { View, StyleSheet } from 'react-native';
import Text from '../common/Text';
import { COLORS, SPACING, SIZE } from '../../theme/theme';

/**
 * Column header row for the Next view set table.
 *
 * Uses a 5-cell layout matching NextSetRow structure:
 * Set (flex:1) | Weight badge (flex:1) | Weight delta (fixed 32px) |
 * Reps badge (flex:1) | Reps delta (fixed 32px)
 *
 * The "Weight" and "Reps" labels sit above the badge columns only,
 * with empty delta spacers ensuring alignment with row content below.
 * No RIR column - future performance can't be pre-rated.
 */
export default function NextSetHeader() {
  return (
    <View style={styles.container}>
      <Text variant="tableHeader" style={styles.setCell}>Set</Text>

      <View style={styles.weightCell}>
        <View style={styles.badgeGroup}>
          <Text variant="tableHeader" style={styles.badgeLabel}>Weight</Text>
          <View style={styles.deltaCell} />
        </View>
      </View>

      <View style={styles.repsCell}>
        <View style={styles.badgeGroup}>
          <Text variant="tableHeader" style={styles.badgeLabel}>Reps</Text>
          <View style={styles.deltaCell} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.viewNextBg,
  },
  setCell: { flex: 1, textAlign: 'center' },
  weightCell: { flex: 3 },
  repsCell: { flex: 2 },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.sm,
  },
  badgeLabel: { flex: 1, textAlign: 'center' },
  deltaCell: { width: SIZE.deltaBox },
});