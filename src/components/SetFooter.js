import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SET_TABLE } from '../theme/theme';

/**
 * Visual footer bar closing the set table within an ExerciseCard.
 * Mirrors SetHeader's background color with bottom-only rounded corners
 * to create a cohesive card container around set rows.
 */
export default function SetFooter() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    height: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
    height: SET_TABLE.headerHeight,
    borderTopWidth : 1,
    borderColor : COLORS.darkGray,
  },
});