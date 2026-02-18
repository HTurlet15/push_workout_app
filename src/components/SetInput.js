import { Pressable, TextInput, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, FONT_SIZE, FONT_FAMILY, SPACING, RADIUS } from '../theme/theme';

/**
 * Tappable badge displaying a single set value (weight, reps, or RIR).
 * Toggles between display mode and inline edit mode on press.
 *
 * Visual states (determined by parent):
 * - filled:        Value entered during current session → black text
 * - previous:      Value carried from last session → gray text
 * - planned:       Value from planned program → gray text + calendar icon
 * - plannedFilled: Planned value confirmed unchanged → black text + calendar icon
 * - empty:         No value → displays "—"
 *
 * Optional overrides (used by NextSetRow):
 * - badgeColor: Custom background color for the badge
 * - textColor:  Custom text color for the value
 *
 * @param {string|number} value       - The value to display.
 * @param {string} unit               - Optional unit suffix (e.g. "kg").
 * @param {string} state              - Visual state controlling text color.
 * @param {Function} onChangeValue    - Callback with parsed numeric value on confirm.
 * @param {boolean} completed         - Whether the parent row is completed (green badge).
 * @param {string} badgeColor         - Override badge background color.
 * @param {string} textColor          - Override text color.
 */
export default function SetInput({ value, unit, state = 'empty', onChangeValue, completed = false, badgeColor, textColor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  /** Auto-focus the native input when entering edit mode */
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const isActive = state === 'filled' || state === 'plannedFilled';
  const showCalendar = state === 'planned' || state === 'plannedFilled';

  /** Format display string: value with unit, or dash for empty */
  const getDisplayValue = () => {
    if (state === 'empty') return '—';
    return unit ? `${value} ${unit}` : `${value}`;
  };

  /** Enter edit mode, pre-filling draft with current value */
  const handlePress = () => {
    setDraft(value !== null && value !== undefined ? String(value) : '');
    setIsEditing(true);
  };

  /** Confirm edit: parse to number, notify parent, exit edit mode */
  const handleSubmit = () => {
    setIsEditing(false);
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && onChangeValue) {
      onChangeValue(parsed);
    }
  };

  // ── Edit mode: inline TextInput ──
  if (isEditing) {
    return (
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={handleSubmit}
        onBlur={handleSubmit}
        keyboardType="numeric"
        returnKeyType="done"
      />
    );
  }

  // ── Display mode: tappable badge ──
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        completed && styles.completedBadge,
        badgeColor && { backgroundColor: badgeColor },
        pressed && styles.containerPressed,
      ]}
      onPress={handlePress}
    >
      {showCalendar && (
        <Feather
          name="calendar"
          size={FONT_SIZE.body}
          color={isActive ? COLORS.textPrimary : COLORS.textSecondary}
          style={styles.icon}
        />
      )}

      <Text
        variant="body"
        style={[
          styles.text,
          isActive ? styles.filledText : styles.inactiveText,
          textColor && { color: textColor },
        ]}
      >
        {getDisplayValue()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /** Default badge appearance */
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.badgeBackground,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPressed: {
    backgroundColor: COLORS.badgePressed,
  },
  /** Inline edit input with blue border */
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.blue,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.body,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  /** Green badge for completed sets */
  completedBadge: {
    backgroundColor: COLORS.successBadge,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  text: {
    textAlign: 'center',
  },
  /** Active (filled) values: primary color */
  filledText: {
    color: COLORS.textPrimary,
    fontFamily: FONT_FAMILY.medium,
  },
  /** Inactive (previous/planned) values: secondary color */
  inactiveText: {
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.medium,
  },
});