import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../theme/theme';

/**
 * Tappable badge displaying a single set value (weight, reps, or RIR).
 * Visual appearance changes based on the data state.
 *
 * States:
 * - filled:   Value entered during current session (black text)
 * - previous: Value carried over from last session (gray text)
 * - planned:  Value from a planned program (gray text + calendar icon)
 * - empty:    No value available (displays dash)
 *
 * @param {Object} props
 * @param {string|number} [props.value] - The value to display.
 * @param {string} [props.unit] - Optional unit suffix (e.g. "kg").
 * @param {'filled'|'previous'|'planned'|'empty'} [props.state='empty'] - Visual state.
 * @param {Function} [props.onPress] - Callback when the badge is tapped.
 */
export default function SetInput({ value, unit, state = 'empty', onPress }) {
  const isActive = state === 'filled';

  /** Format display string based on current state */
  const getDisplayValue = () => {
    if (state === 'empty') return '—';
    return unit ? `${value} ${unit}` : `${value}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.6}
    >
      {state === 'planned' && (
        <Feather
          name="calendar"
          size={FONT_SIZE.body}
          color={COLORS.textSecondary}
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