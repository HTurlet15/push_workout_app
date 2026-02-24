import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from '../common/Text';
import SetInput from './SetInput';
import { COLORS, SPACING, FONT_SIZE, FONT_FAMILY, SIZE } from '../../theme/theme';

/**
 * Editable set row for the Current view.
 *
 * Animations:
 * - Pop-in on mount: when isNew=true, row scales from 0.85→1 and fades in
 * - weightFadeAnim: fades only the weight cell on kg/lbs toggle
 * - Checkmark pop on completion via justCompleted prop
 *
 * @param {number} index              - Zero-based set position.
 * @param {Object} set                - Set data with field-level state.
 * @param {string} unit               - Weight display unit.
 * @param {Function} displayWeight    - Converts kg value for display.
 * @param {Function} toKg             - Converts display value back to kg.
 * @param {Animated.Value} weightFadeAnim - Opacity anim for weight cell.
 * @param {Function} onUpdateSet      - Callback: (field, value).
 * @param {boolean} editMode          - Whether delete button is visible.
 * @param {Function} onDelete         - Callback when delete is pressed.
 * @param {boolean} justCompleted     - True when set just became complete.
 * @param {boolean} isNew             - True for newly added sets (triggers pop-in).
 */
export default function SetRow({ index, set, onUpdateSet, editMode = false, onDelete, unit, displayWeight, toKg, weightFadeAnim, justCompleted = false, isNew = false }) {
  const isCompleted = set.weight.state === 'filled' && set.reps.state === 'filled';

  const [showCheck, setShowCheck] = useState(false);
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);

  // ── Pop-in animation for new sets ─────────────────────────

  const mountAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;

  useEffect(() => {
    if (isNew) {
      Animated.spring(mountAnim, {
        toValue: 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }).start();
    }
  }, []); // Only on mount

  const mountScale = mountAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  // ── Checkmark animation ───────────────────────────────────

  useEffect(() => {
    if (justCompleted && !hasAnimated.current) {
      hasAnimated.current = true;
      setShowCheck(true);

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

    if (!justCompleted) {
      hasAnimated.current = false;
    }
  }, [justCompleted, checkScale, checkOpacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
        {
          opacity: mountAnim,
          transform: [{ scale: mountScale }],
        },
      ]}
    >
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

      {/* Weight badge — fades on unit toggle */}
      <Animated.View style={[styles.weightCell, { opacity: weightFadeAnim || 1 }]}>
        <SetInput
          value={displayWeight(set.weight.value)}
          unit={unit}
          state={set.weight.state}
          onChangeValue={(val) => onUpdateSet?.('weight', toKg(val))}
          completed={isCompleted}
        />
      </Animated.View>

      <View style={styles.repsCell}>
        <SetInput
          value={set.reps.value}
          state={set.reps.state}
          onChangeValue={(val) => onUpdateSet?.('reps', val)}
          completed={isCompleted}
        />
      </View>

      <View style={styles.rirCell}>
        <SetInput
          value={set.rir.value}
          state={set.rir.state}
          onChangeValue={(val) => onUpdateSet?.('rir', val)}
          completed={isCompleted}
        />
      </View>
    </Animated.View>
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