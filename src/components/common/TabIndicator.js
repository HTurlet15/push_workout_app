import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, RADIUS, SIZE } from '../../theme/theme';

/**
 * Tab indicator with a center-aligned pill, navigation dots, and optional back button.
 *
 * The pill is always perfectly centered using absolute positioning.
 * Dots indicate position in the horizontal tab navigation:
 * - tabPosition 0 (first tab):  PILL • •   (dots right of pill)
 * - tabPosition 1 (middle tab): • PILL •   (dots both sides)
 * - tabPosition 2+ (deeper):    • PILL •   (same, with session dots below)
 *
 * @param {string} label            - Text inside the center pill.
 * @param {number} tabPosition      - 0-based position in tab hierarchy (0=Programs, 1=Workouts, 2=Workout detail).
 * @param {number} totalDots        - Number of session dots below the pill (for pager views).
 * @param {number} activeIndex      - Which session dot is active (0-based).
 * @param {string} backLabel        - If set, shows a "↑ backLabel" button on the left.
 * @param {Function} onBack         - Callback when back button is pressed.
 */
export default function TabIndicator({
  label,
  tabPosition = 1,
  totalDots = 0,
  activeIndex = 0,
  backLabel,
  onBack,
}) {
  // Dots: position 0 = none left, 2 right. Position 1+ = 1 left, 1 right.
  const leftDots = tabPosition === 0 ? 0 : 1;
  const rightDots = tabPosition === 0 ? 2 : 1;

  return (
    <View style={styles.container}>
      {backLabel && onBack ? (
        <Pressable
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={onBack}
        >
          <Feather name="chevron-up" size={SIZE.iconXs} color={COLORS.textSecondary} />
          <Text style={styles.backBtnText}>{backLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      <View style={styles.centerAbsolute}>
        <View style={styles.centerContent}>
          <View style={styles.labelRow}>
            {Array.from({ length: leftDots }, (_, i) => (
              <View key={`l-${i}`} style={styles.sideDot} />
            ))}
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
            {Array.from({ length: rightDots }, (_, i) => (
              <View key={`r-${i}`} style={styles.sideDot} />
            ))}
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
      </View>

      <View style={styles.backPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    minHeight: SIZE.touchTargetLg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    paddingHorizontal: SPACING.md,
    height: SIZE.touchTarget,
    zIndex: 10,
  },
  backBtnPressed: {
    opacity: 0.5,
  },
  backBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  backPlaceholder: {
    width: SPACING.md,
  },
  centerAbsolute: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  centerContent: {
    alignItems: 'center',
    gap: SPACING.xsm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  labelPill: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.mdl,
    borderRadius: RADIUS.pill,
  },
  labelText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.semibold,
    letterSpacing: 0.5,
  },
  sessionDots: {
    flexDirection: 'row',
    gap: SPACING.xsm,
  },
  sessionDot: {
    width: SIZE.dotMd,
    height: SIZE.dotMd,
    borderRadius: SIZE.dotMd / 2,
    backgroundColor: COLORS.mediumGray,
  },
  sessionDotActive: {
    backgroundColor: COLORS.textSecondary,
  },
  sideDot: {
    width: SIZE.dotLg,
    height: SIZE.dotLg,
    borderRadius: SIZE.dotLg / 2,
    backgroundColor: COLORS.mediumGray,
  },
});