import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

/**
 * Visual footer bar closing the set table within an ExerciseCard.
 *
 * Provides bottom padding with rounded corners to complete the
 * card container around set rows. Uses neutral gray background
 * consistent across all three views.
 */
export default function SetFooter() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    height: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
  },
});