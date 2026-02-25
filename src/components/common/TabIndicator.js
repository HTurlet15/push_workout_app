import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';

/**
 * Tab indicator with a center-aligned pill, session dots, and optional back button.
 *
 * The pill + dots are always perfectly centered using absolute positioning.
 * The back button (optional) sits on the left edge.
 *
 * @param {string} label            - Text inside the center pill.
 * @param {number} totalDots        - Number of session dots below the pill.
 * @param {number} activeIndex      - Which session dot is active (0-based).
 * @param {boolean} showLeftDot     - Show placeholder dot to the left of the pill.
 * @param {boolean} showRightDot    - Show placeholder dot to the right of the pill.
 * @param {string} backLabel        - If set, shows a "↑ backLabel" button on the left.
 * @param {Function} onBack         - Callback when back button is pressed.
 */
export default function TabIndicator({
  label,
  totalDots = 0,
  activeIndex = 0,
  showLeftDot = true,
  showRightDot = true,
  backLabel,
  onBack,
}) {
  return (
    <View style={styles.container}>
      {/* Back button — left-aligned */}
      {backLabel && onBack ? (
        <Pressable
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={onBack}
        >
          <Feather name="chevron-up" size={14} color={COLORS.textSecondary} />
          <Text style={styles.backBtnText}>{backLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      {/* Center — pill + dots (absolutely centered) */}
      <View style={styles.centerAbsolute}>
        <View style={styles.centerContent}>
          <View style={styles.labelRow}>
            {showLeftDot && <View style={styles.sideDot} />}
            <View style={styles.labelPill}>
              <Text style={styles.labelText}>{label}</Text>
            </View>
            {showRightDot && <View style={styles.sideDot} />}
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

      {/* Right placeholder to balance layout */}
      <View style={styles.backPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    minHeight: 48,
  },

  // ── Back button ───────────────────────────────────────────

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: SPACING.md,
    height: 44,
    zIndex: 10,
  },
  backBtnPressed: {
    opacity: 0.5,
  },
  backBtnText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  backPlaceholder: {
    width: SPACING.md,
  },

  // ── Center (absolute to guarantee centering) ──────────────

  centerAbsolute: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  centerContent: {
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

  // ── Session dots ──────────────────────────────────────────

  sessionDots: {
    flexDirection: 'row',
    gap: 5,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.mediumGray,
  },
  sessionDotActive: {
    backgroundColor: COLORS.textSecondary,
  },

  // ── Side dots ─────────────────────────────────────────────

  sideDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.mediumGray,
  },
});