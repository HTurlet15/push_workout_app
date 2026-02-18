import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING } from '../theme/theme';

/**
 * Column header row for the Previous view set table.
 *
 * Identical layout to SetHeader (1:3:2:2 flex proportions)
 * but uses the Previous view background color for visual differentiation.
 */
export default function PreviousSetHeader() {
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
    backgroundColor: COLORS.viewPreviousBg,
  },
  setCell: { flex: 1, textAlign: 'center' },
  weightCell: { flex: 3, textAlign: 'center' },
  repsCell: { flex: 2, textAlign: 'center' },
  rirCell: { flex: 2, textAlign: 'center' },
});