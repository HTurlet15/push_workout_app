import { View, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

/**
 * Footer bar at the bottom of each exercise table.
 *
 * Displays secondary exercise controls:
 * - Left: rest timer duration badge (e.g. "⏱ 90s")
 * - Right: kg/lbs unit toggle pill
 *
 * Falls back to a minimal visual bar when no controls are provided
 * (backwards compatible with views that don't pass props).
 *
 * @param {number} restSeconds       - Rest timer duration in seconds.
 * @param {string} unit              - Current weight unit ('kg' or 'lbs').
 * @param {Function} onToggleUnit    - Callback: (newUnit) when pill is tapped.
 */
export default function SetFooter({
  restSeconds,
  unit = 'kg',
  onToggleUnit,
}) {
  const hasControls = restSeconds != null || onToggleUnit;

  // Minimal footer bar when no controls are provided
  if (!hasControls) {
    return <View style={styles.minimalBar} />;
  }

  return (
    <View style={styles.container}>
      {/* Rest timer badge — left side */}
      {restSeconds != null && (
        <View style={styles.restBadge}>
          <Text style={styles.restIcon}>⏱</Text>
          <Text style={styles.restText}>{restSeconds}s</Text>
        </View>
      )}

      {/* Spacer pushes toggle to the right */}
      <View style={styles.spacer} />

      {/* kg/lbs pill toggle — right side */}
      {onToggleUnit && (
        <View style={styles.togglePill}>
          <Pressable
            style={[styles.toggleBtn, unit === 'kg' && styles.toggleBtnActive]}
            onPress={() => unit !== 'kg' && onToggleUnit('kg')}
          >
            <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>
              kg
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, unit === 'lbs' && styles.toggleBtnActive]}
            onPress={() => unit !== 'lbs' && onToggleUnit('lbs')}
          >
            <Text style={[styles.toggleText, unit === 'lbs' && styles.toggleTextActive]}>
              lbs
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Minimal bar when no controls — thin visual closer */
  minimalBar: {
    height: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  /** Footer container with controls */
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + SPACING.xs,
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  /** Flex spacer between rest badge and toggle */
  spacer: {
    flex: 1,
  },

  // ── Rest timer badge ────────────────────────────────────

  restBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  restIcon: {
    fontSize: FONT_SIZE.sm + 1,
  },
  restText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },

  // ── kg/lbs pill toggle ──────────────────────────────────

  /** Outer pill container */
  togglePill: {
    flexDirection: 'row',
    backgroundColor: COLORS.mediumGray,
    borderRadius: RADIUS.xs,
    padding: 1.5,
  },
  /** Individual toggle button */
  toggleBtn: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs - 1,
  },
  /** Active toggle — white background with subtle shadow */
  toggleBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  /** Toggle label text */
  toggleText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  /** Active toggle label — dark text */
  toggleTextActive: {
    color: COLORS.textPrimary,
  },
});