import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import Text from './Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY } from '../theme/theme';

/**
 * Footer bar at the bottom of each exercise table.
 *
 * Displays secondary exercise controls:
 * - Left: rest timer duration badge (e.g. "⏱ 90s")
 * - Right: kg/lbs unit toggle pill
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

  const hasControls = restSeconds != null || onToggleUnit;

  // Minimal footer bar when no controls are provided
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

    // Edit mode + actively editing: inline TextInput with black underline
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

    // Edit mode: underline cue — signals "tappable to edit"
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

    // Normal mode: tap to set global timer
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

  return (
    <View style={styles.container}>
      {renderRestBadge()}

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
  /** Minimal bar when no controls */
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
  spacer: {
    flex: 1,
  },

  // ── Rest timer badge ────────────────────────────────────

  /** Normal mode rest badge */
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
  /** "s" suffix next to the editable input */
  restUnit: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    marginLeft: 1,
  },

  // ── Rest editable (edit mode) ───────────────────────────

  /** Row layout for icon + underlined value + "s" */
  restEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  /** Underline cue in edit mode — gray, signals "tappable" */
  restEditable: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.mediumGray,
    paddingBottom: 1,
    minWidth: 24,
    alignItems: 'center',
  },
  /** Active editing — black underline */
  restEditableActive: {
    borderBottomColor: COLORS.textPrimary,
  },
  /** Inline TextInput for rest time editing */
  restInput: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    padding: 0,
    margin: 0,
    minWidth: 24,
    textAlign: 'center',
  },

  // ── kg/lbs pill toggle ──────────────────────────────────

  togglePill: {
    flexDirection: 'row',
    backgroundColor: COLORS.mediumGray,
    borderRadius: RADIUS.xs,
    padding: 1.5,
  },
  toggleBtn: {
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.xs - 1,
  },
  toggleBtnActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
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