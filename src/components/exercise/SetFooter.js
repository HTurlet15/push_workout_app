import { View, Pressable, TextInput, Animated, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../../theme/theme';

/** Width of each toggle button — used for slide calculation */
const TOGGLE_BTN_WIDTH = 32;
const TOGGLE_PADDING = 1.5;

/**
 * Footer bar at the bottom of each exercise table.
 *
 * Displays secondary exercise controls:
 * - Left: rest timer duration badge (e.g. "⏱ 90s")
 * - Right: kg/lbs unit toggle pill with animated sliding indicator
 *
 * Rest badge behavior changes with edit mode:
 * - Normal mode: tap → sets global timer to this value
 * - Edit mode: underline cue appears, tap → inline TextInput to change value
 *
 * @param {number} restSeconds       - Rest timer duration in seconds.
 * @param {string} unit              - Current weight unit ('kg' or 'lbs').
 * @param {Function} onToggleUnit    - Callback: (newUnit) when pill is tapped.
 * @param {Function} onRestPress     - Callback: tap rest badge in normal mode.
 * @param {Function} onUpdateRest    - Callback: (newSeconds) to save edited rest time.
 * @param {boolean} editMode         - Whether edit controls are visible.
 */
export default function SetFooter({
  restSeconds,
  unit = 'kg',
  onToggleUnit,
  onRestPress,
  onUpdateRest,
  editMode = false,
}) {
  const [editingRest, setEditingRest] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  /** Animated value for pill slider position: 0 = kg, 1 = lbs */
  const slideAnim = useRef(new Animated.Value(unit === 'lbs' ? 1 : 0)).current;

  /** Animate pill slider when unit changes */
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: unit === 'lbs' ? 1 : 0,
      friction: 8,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [unit, slideAnim]);

  const hasControls = restSeconds != null || onToggleUnit;

  if (!hasControls) {
    return <View style={styles.minimalBar} />;
  }

  /** Enter rest edit mode with current value pre-filled */
  const handleStartEdit = () => {
    setDraft(String(restSeconds));
    setEditingRest(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  /** Confirm edit: parse and save, then exit */
  const handleSubmitRest = () => {
    setEditingRest(false);
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed) && parsed > 0 && onUpdateRest) {
      onUpdateRest(parsed);
    }
  };

  /** Only allow digits in rest time input */
  const handleChangeText = (text) => {
    if (/^\d*$/.test(text)) {
      setDraft(text);
    }
  };

  // ── Rest badge rendering ──────────────────────────────────

  const renderRestBadge = () => {
    if (restSeconds == null) return null;

    if (editingRest) {
      return (
        <View style={styles.restEditRow}>
          <Text style={styles.restIcon}>⏱</Text>
          <View style={[styles.restEditable, styles.restEditableActive]}>
            <TextInput
              ref={inputRef}
              style={styles.restInput}
              value={draft}
              onChangeText={handleChangeText}
              onSubmitEditing={handleSubmitRest}
              onBlur={handleSubmitRest}
              keyboardType="number-pad"
              returnKeyType="done"
              selectTextOnFocus
            />
          </View>
          <Text style={styles.restUnit}>s</Text>
        </View>
      );
    }

    if (editMode) {
      return (
        <Pressable
          style={({ pressed }) => [styles.restEditRow, pressed && styles.restBadgePressed]}
          onPress={handleStartEdit}
        >
          <Text style={styles.restIcon}>⏱</Text>
          <View style={styles.restEditable}>
            <Text style={styles.restText}>{restSeconds}</Text>
          </View>
          <Text style={styles.restUnit}>s</Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        style={({ pressed }) => [styles.restBadge, pressed && styles.restBadgePressed]}
        onPress={onRestPress}
      >
        <Text style={styles.restIcon}>⏱</Text>
        <Text style={styles.restText}>{restSeconds}s</Text>
      </Pressable>
    );
  };

  // ── Pill slider translateX ────────────────────────────────

  const pillTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOGGLE_BTN_WIDTH],
  });

  return (
    <View style={styles.container}>
      {renderRestBadge()}

      <View style={styles.spacer} />

      {/* kg/lbs pill toggle with animated sliding indicator */}
      {onToggleUnit && (
        <View style={styles.togglePill}>
          {/* Animated white indicator that slides between positions */}
          <Animated.View
            style={[
              styles.toggleIndicator,
              { transform: [{ translateX: pillTranslateX }] },
            ]}
          />

          {/* kg button — text only, indicator slides behind */}
          <Pressable
            style={styles.toggleBtn}
            onPress={() => unit !== 'kg' && onToggleUnit('kg')}
          >
            <Text style={[styles.toggleText, unit === 'kg' && styles.toggleTextActive]}>
              kg
            </Text>
          </Pressable>

          {/* lbs button */}
          <Pressable
            style={styles.toggleBtn}
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
  minimalBar: {
    height: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm + SPACING.xs,
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: RADIUS.sm,
    borderBottomRightRadius: RADIUS.sm,
  },
  spacer: {
    flex: 1,
  },

  // ── Rest timer badge ────────────────────────────────────

  restBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  restBadgePressed: {
    opacity: 0.5,
  },
  restIcon: {
    fontSize: FONT_SIZE.sm + 1,
  },
  restText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  restUnit: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginLeft: 1,
  },

  // ── Rest editable ───────────────────────────────────────

  restEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  restEditable: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.mediumGray,
    paddingBottom: 1,
    minWidth: 24,
    alignItems: 'center',
  },
  restEditableActive: {
    borderBottomColor: COLORS.textPrimary,
  },
  restInput: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    padding: 0,
    margin: 0,
    minWidth: 24,
    textAlign: 'center',
  },

  // ── Animated pill toggle ────────────────────────────────

  /** Outer pill container — positions the animated indicator */
  togglePill: {
    flexDirection: 'row',
    backgroundColor: COLORS.mediumGray,
    borderRadius: RADIUS.xs,
    padding: TOGGLE_PADDING,
    position: 'relative',
  },
  /** Animated white sliding indicator behind active button */
  toggleIndicator: {
    position: 'absolute',
    top: TOGGLE_PADDING,
    left: TOGGLE_PADDING,
    width: TOGGLE_BTN_WIDTH,
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xs - 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  /** Toggle button — transparent, text only (indicator slides behind) */
  toggleBtn: {
    width: TOGGLE_BTN_WIDTH,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  toggleText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  toggleTextActive: {
    color: COLORS.textPrimary,
  },
});