import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';

/**
 * Tab indicator with a center label pill, session dots, and optional side dots.
 *
 * Used at two levels:
 * - Level 1: Programs · [Workouts] · Graphs  (label = active section)
 * - Level 2: · [Workout] · with séance dots below (label = "Workout")
 *
 * @param {string} label            - Text inside the center pill (e.g. "Workout").
 * @param {number} totalDots        - Number of session dots below the pill.
 * @param {number} activeIndex      - Which session dot is active (0-based).
 * @param {boolean} showLeftDot     - Show placeholder dot on the left.
 * @param {boolean} showRightDot    - Show placeholder dot on the right.
 */
export default function TabIndicator({
  label,
  totalDots = 0,
  activeIndex = 0,
  showLeftDot = true,
  showRightDot = true,
}) {
  return (
    <View style={styles.container}>
      {showLeftDot && <View style={styles.sideDot} />}

      <View style={styles.center}>
        <View style={styles.labelPill}>
          <Text style={styles.labelText}>{label}</Text>
        </View>

        {totalDots > 1 && (
          <View style={styles.sessionDots}>
            {Array.from({ length: totalDots }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.sessionDot,
                  i === activeIndex && styles.sessionDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {showRightDot && <View style={styles.sideDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  center: {
    alignItems: 'center',
    gap: 6,
  },
  labelPill: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 4,
    paddingHorizontal: SPACING.md + 4,
    borderRadius: 20,
  },
  labelText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semibold,
    letterSpacing: 0.5,
  },
  sessionDots: {
    flexDirection: 'row',
    gap: 5,
  },
  sessionDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.mediumGray,
  },
  sessionDotActive: {
    backgroundColor: COLORS.textSecondary,
  },
  sideDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.mediumGray,
  },
});