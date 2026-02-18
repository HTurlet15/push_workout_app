import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, FONT_FAMILY, SET_TABLE } from '../theme/theme';

/**
 * Column header row displayed above SetRow entries.
 * Column widths mirror SetRow proportions (1:3:2:2) for alignment.
 */
export default function SetHeader() {
  return (
    <View style={styles.container}>
      <Text variant="subtitle" style={[styles.cell, styles.setCell]}>
        Set
      </Text>

      <Text variant="subtitle" style={[styles.cell, styles.weightCell]}>
        Weight
      </Text>

      <Text variant="subtitle" style={[styles.cell, styles.repsCell]}>
        Reps
      </Text>

      <Text variant="subtitle" style={[styles.cell, styles.rirCell]}>
        RIR
      </Text>
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
  cell: {
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontFamily : FONT_FAMILY.semibold,
  },
  setCell: {
    flex: 1,
  },
  weightCell: {
    flex: 3,
  },
  repsCell: {
    flex: 2,
  },
  rirCell: {
    flex: 2,
  },
});