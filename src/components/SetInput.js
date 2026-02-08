import { TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../theme/theme';

/**
 * Tappable badge displaying a single set value (weight, reps, or RIR).
 * Toggles between display mode and edit mode on press.
 *
 * States:
 * - filled:        Value entered during current session (black text)
 * - previous:      Value carried over from last session (gray text)
 * - planned:       Value from a planned program (gray text + gray calendar)
 * - plannedFilled: Planned value confirmed unchanged (black text + black calendar)
 * - empty:         No value available (displays dash)
 *
 * The parent component is responsible for determining the correct state,
 * including whether a planned value was modified (filled vs plannedFilled).
 *
 * @param {Object} props
 * @param {string|number} [props.value] - The value to display.
 * @param {string} [props.unit] - Optional unit suffix (e.g. "kg").
 * @param {'filled'|'previous'|'planned'|'plannedFilled'|'empty'} [props.state='empty'] - Visual state.
 * @param {Function} [props.onChangeValue] - Callback with the new numeric value on edit confirm.
 */
export default function SetInput({ value, unit, state = 'empty', onChangeValue }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  /** Auto-focus the input when entering edit mode */
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const isActive = state === 'filled' || state === 'plannedFilled';
  const showCalendar = state === 'planned' || state === 'plannedFilled';

  /** Format display string based on current state */
  const getDisplayValue = () => {
    if (state === 'empty') return '—';
    return unit ? `${value} ${unit}` : `${value}`;
  };

  /** Enter edit mode with current value pre-filled */
  const handlePress = () => {
    setDraft(value !== null && value !== undefined ? String(value) : '');
    setIsEditing(true);
  };

  /** Confirm edit: parse value, notify parent, exit edit mode */
  const handleSubmit = () => {
    setIsEditing(false);

    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && onChangeValue) {
      onChangeValue(parsed);
    }
  };

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
      />
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.6}
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
        style={[styles.text, isActive ? styles.filledText : styles.inactiveText]}
      >
        {getDisplayValue()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.exerciseName,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  icon: {
    marginRight: SPACING.xs,
  },
  text: {
    textAlign: 'center',
  },
  filledText: {
    color: COLORS.textPrimary,
  },
  inactiveText: {
    color: COLORS.textSecondary,
  },
});