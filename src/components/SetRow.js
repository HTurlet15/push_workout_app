import { View, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, SIZE } from '../theme/theme';

/**
 * Editable set row for the Current view.
 *
 * Displays one set's weight, reps, and RIR as tappable badges (SetInput).
 * Completion state is derived from weight + reps both being filled,
 * which triggers green background highlighting.
 *
 * In edit mode, a red delete button appears to the left of each row.
 *
 * @param {number} index        - Zero-based set position, displayed as 1-based.
 * @param {Object} set          - Set data with field-level state ({value, state} per field).
 * @param {Function} onUpdateSet - Callback: (field, value) when a badge value changes.
 * @param {boolean} editMode    - Whether edit controls (delete button) are visible.
 * @param {Function} onDelete   - Callback when delete button is pressed.
 */
export default function SetRow({ index, set, onUpdateSet, editMode = false, onDelete }) {
  // A set is complete when both weight and reps have been filled by the user 
  const isCompleted =
    set.weight.state === 'filled' && set.reps.state === 'filled';

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      {/* Delete button - only visible in edit mode */}
      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
          onPress={onDelete}
        >
          <Feather name="x" size={SIZE.iconSm - 6} color={COLORS.error} />
        </Pressable>
      )}

      {/* Set number */}
      <Text variant="caption" style={[styles.setCell, isCompleted && styles.completedSetNum]}>
        {index + 1}
      </Text>

      {/* Weight badge */}
      <View style={styles.weightCell}>
        <SetInput
          value={set.weight.value}
          unit="kg"
          state={set.weight.state}
          onChangeValue={(val) => onUpdateSet?.('weight', val)}
          completed={isCompleted}
        />
      </View>

      {/* Reps badge */}
      <View style={styles.repsCell}>
        <SetInput
          value={set.reps.value}
          state={set.reps.state}
          onChangeValue={(val) => onUpdateSet?.('reps', val)}
          completed={isCompleted}
        />
      </View>

      {/* RIR badge */}
      <View style={styles.rirCell}>
        <SetInput
          value={set.rir.value}
          state={set.rir.state}
          onChangeValue={(val) => onUpdateSet?.('rir', val)}
          completed={isCompleted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  // Green highlight when set is completed 
  completedContainer: {
    backgroundColor: COLORS.successLight,
  },
  // Set number: muted by default, green when completed 
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
  },
  completedSetNum: {
    color: COLORS.success,
  },
  weightCell: { flex: 3 },
  repsCell: { flex: 2 },
  rirCell: { flex: 2 },
  // Circular red delete button 
  deleteBtn: {
    width: SIZE.deleteBtn,
    height: SIZE.deleteBtn,
    borderRadius: SIZE.deleteBtn / 2,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    backgroundColor: COLORS.errorPressed,
  },
});