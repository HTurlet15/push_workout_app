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
      <View style={styles.center}>
        {/* Side dots aligned with pill center */}
        <View style={styles.labelRow}>
          {showLeftDot && <View style={styles.sideDot} />}
          <View style={styles.labelPill}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
          {showRightDot && <View style={styles.sideDot} />}
        </View>

        {/* Session dots below */}
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.mediumGray,
  },
  sessionDotActive: {
    backgroundColor: COLORS.textSecondary,
  },
  sideDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.mediumGray,
  },
});