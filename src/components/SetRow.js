import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, SIZE } from '../theme/theme';

/**
 * Editable set row for the Current view.
 *
 * Animations:
 * - weightFadeAnim: Animated.Value from parent — fades only the weight cell
 *   on kg/lbs toggle. Reps, RIR, and set number stay fully visible.
 * - Checkmark pop on completion: set number briefly replaced by animated ✓.
 *   Uses a completion counter prop instead of derived state to reliably
 *   detect the exact moment a set transitions to completed.
 *
 * @param {number} index              - Zero-based set position.
 * @param {Object} set                - Set data with field-level state.
 * @param {string} unit               - Weight display unit ('kg' or 'lbs').
 * @param {Function} displayWeight    - Converts kg value for display.
 * @param {Function} toKg             - Converts display value back to kg.
 * @param {Animated.Value} weightFadeAnim - Opacity anim for weight cell only.
 * @param {Function} onUpdateSet      - Callback: (field, value).
 * @param {boolean} editMode          - Whether delete button is visible.
 * @param {Function} onDelete         - Callback when delete is pressed.
 * @param {boolean} justCompleted     - True on the render where set just became complete.
 */
export default function SetRow({ index, set, onUpdateSet, editMode = false, onDelete, unit, displayWeight, toKg, weightFadeAnim, justCompleted = false }) {
  const isCompleted = set.weight.state === 'filled' && set.reps.state === 'filled';

  const [showCheck, setShowCheck] = useState(false);

  /** Checkmark animation values */
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;

  /** Track if we already animated for this completion event */
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (justCompleted && !hasAnimated.current) {
      hasAnimated.current = true;
      setShowCheck(true);

      // Pop in: scale 0 → 1.3 → 1 with opacity
      checkScale.setValue(0);
      checkOpacity.setValue(0);

      Animated.parallel([
        Animated.sequence([
          Animated.spring(checkScale, {
            toValue: 1.3,
            friction: 4,
            tension: 200,
            useNativeDriver: true,
          }),
          Animated.spring(checkScale, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold for 800ms, then fade out back to number
        setTimeout(() => {
          Animated.timing(checkOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setShowCheck(false);
            checkScale.setValue(0);
            hasAnimated.current = false;
          });
        }, 800);
      });
    }

    // Reset the flag when justCompleted goes back to false
    if (!justCompleted) {
      hasAnimated.current = false;
    }
  }, [justCompleted, checkScale, checkOpacity]);

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      {/* Delete button — only visible in edit mode */}
      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
          onPress={onDelete}
        >
          <Feather name="x" size={SIZE.iconSm - 6} color={COLORS.error} />
        </Pressable>
      )}

      {/* Set number / animated checkmark */}
      <View style={styles.setCellWrapper}>
        <Text
          variant="caption"
          style={[
            styles.setCell,
            isCompleted && styles.completedSetNum,
            showCheck && styles.setCellHidden,
          ]}
        >
          {index + 1}
        </Text>

        {showCheck && (
          <Animated.View
            style={[
              styles.checkOverlay,
              {
                transform: [{ scale: checkScale }],
                opacity: checkOpacity,
              },
            ]}
          >
            <Feather name="check" size={FONT_SIZE.caption + 2} color={COLORS.success} />
          </Animated.View>
        )}
      </View>

      {/* Weight badge — Animated.View for fade on unit toggle */}
      <Animated.View style={[styles.weightCell, { opacity: weightFadeAnim || 1 }]}>
        <SetInput
          value={displayWeight(set.weight.value)}
          unit={unit}
          state={set.weight.state}
          onChangeValue={(val) => onUpdateSet?.('weight', toKg(val))}
          completed={isCompleted}
        />
      </Animated.View>

      {/* Reps badge — no fade */}
      <View style={styles.repsCell}>
        <SetInput
          value={set.reps.value}
          state={set.reps.state}
          onChangeValue={(val) => onUpdateSet?.('reps', val)}
          completed={isCompleted}
        />
      </View>

      {/* RIR badge — no fade */}
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
  completedContainer: {
    backgroundColor: COLORS.successLight,
  },
  setCellWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  setCell: {
    textAlign: 'center',
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.caption,
    color: COLORS.textMuted,
  },
  setCellHidden: {
    opacity: 0,
  },
  completedSetNum: {
    color: COLORS.success,
  },
  checkOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightCell: { flex: 3 },
  repsCell: { flex: 2 },
  rirCell: { flex: 2 },
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