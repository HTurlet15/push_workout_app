import { View, StyleSheet } from 'react-native';
import Text from '../common/Text';
import { COLORS, SPACING } from '../../theme/theme';

/**
 * Column header row for the Current view set table.
 *
 * Displays column labels (Set, Weight, Reps, RIR) with flex proportions
 * matching SetRow layout (1:3:2:2) to ensure vertical alignment.
 * Background color uses the Current view theme.
 */
export default function SetHeader() {
  return (
    <View style={styles.container}>
      <Text variant="tableHeader" style={styles.setCell}>Set</Text>
      <Text variant="tableHeader" style={styles.weightCell}>Weight</Text>
      <Text variant="tableHeader" style={styles.repsCell}>Reps</Text>
      <Text variant="tableHeader" style={styles.rirCell}>RIR</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.viewCurrentBg,
  },
  setCell: { flex: 1, textAlign: 'center' },
  weightCell: { flex: 3, textAlign: 'center' },
  repsCell: { flex: 2, textAlign: 'center' },
  rirCell: { flex: 2, textAlign: 'center' },
});