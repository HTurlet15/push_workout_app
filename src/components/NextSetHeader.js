import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, FONT_FAMILY } from '../theme/theme';

/**
 * Column header for the Next view.
 * Same layout as SetHeader but with warm orange background.
 * Only 3 columns: Set, Weight, Reps (no RIR in Next view).
 */
export default function NextSetHeader() {
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
  cell: {
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.semibold,
  },
  setCell: {
    flex: 0.5,
  },
  weightCell: {
    flex: 2.5,
  },
  repsCell: {
    flex: 1.5,
  },
});