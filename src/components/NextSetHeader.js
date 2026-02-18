import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, FONT_FAMILY } from '../theme/theme';

/**
 * Column header for the Next view.
 * 5 cells matching NextSetRow layout:
 * Set | Weight badge | Weight delta | Reps badge | Reps delta
 * Titles sit above the badge columns, delta columns stay empty.
 */
export default function NextSetHeader() {
  return (
    <View style={styles.container}>
        <Text variant="subtitle" style={[styles.cell, styles.setCell]}>
            Set
        </Text>

        <View style={styles.weightCell}>
            <View style={styles.badgeGroup}>
                    <Text variant="subtitle" style={[styles.cell]}>
                        Weight
                    </Text>
                    <View style={styles.deltaCell} />
            </View>
        </View>

        <View style={styles.repsCell}>      
            <View style={styles.badgeGroup}>
                    <Text variant="subtitle" style={[styles.cell]}>
                        Reps
                    </Text>
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
  cell: {
    flex : 1,
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.semibold,
  },
  setCell: {
    flex: 1,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight : SPACING.sm,
  },
  badgeWrapper: {
    flex: 1,
  },
  weightCell: {
    flex: 3,
  },
  repsCell: {
    flex: 2,
  },
  deltaCell: {
    width: 32,
  },
});