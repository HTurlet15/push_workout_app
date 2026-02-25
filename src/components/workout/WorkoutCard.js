import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SHADOW } from '../../theme/theme';

/**
 * Individual workout card with:
 * - Tap body → navigate to workout
 * - Tap chevron → expand/collapse exercise preview
 * - Edit mode → show delete button, hide chevron
 * - Animated number badge (gray ↔ black on expand)
 * - Rep range display per exercise
 *
 * @param {number} index            - Position in the list (1-based display).
 * @param {string} name             - Workout name.
 * @param {Array} exercises         - Exercise array from current workout.
 * @param {Object} timeBadge        - { label, tier } from parent.
 * @param {boolean} isExpanded      - Whether exercise list is visible.
 * @param {boolean} editMode        - Whether edit controls are shown.
 * @param {Function} onToggleExpand - Toggle expand callback.
 * @param {Function} onPress        - Navigate to workout callback.
 * @param {Function} onDelete       - Delete this workout callback.
 */
export default function WorkoutCard({
  index,
  name,
  exercises,
  timeBadge,
  isExpanded,
  editMode,
  onToggleExpand,
  onPress,
  onDelete,
}) {
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const chevronAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const numberColorAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(chevronAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(numberColorAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded]);

  // ── Helpers ───────────────────────────────────────────────

  const getRepRange = (exercise) => {
    const reps = exercise.sets
      .map((s) => s.reps?.value ?? s.reps)
      .filter((r) => r != null);
    if (reps.length === 0) return '';
    const min = Math.min(...reps);
    const max = Math.max(...reps);
    if (min === max) return `${min} reps`;
    return `${min}-${max} reps`;
  };

  // ── Interpolations ────────────────────────────────────────

  const maxExerciseHeight = exercises.length * 40 + 16;

  const animatedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxExerciseHeight],
  });

  const chevronRotation = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const numberBg = numberColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.lightGray, COLORS.textPrimary],
  });

  const numberColor = numberColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.textSecondary, COLORS.white],
  });

  const timeColor =
    timeBadge.tier === 'recent' ? COLORS.success :
    timeBadge.tier === 'overdue' ? COLORS.error :
    COLORS.textSecondary;

  // ── Render ────────────────────────────────────────────────

  return (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        {/* Delete button — edit mode only */}
        {editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
            onPress={onDelete}
          >
            <Feather name="minus-circle" size={20} color={COLORS.error} />
          </Pressable>
        )}

        {/* Tap to navigate */}
        <Pressable
          style={({ pressed }) => [
            styles.cardNavArea,
            pressed && !editMode && styles.cardNavAreaPressed,
          ]}
          onPress={editMode ? undefined : onPress}
          disabled={editMode}
        >
          <Animated.View style={[styles.cardNumber, { backgroundColor: numberBg }]}>
            <Animated.Text style={[styles.cardNumberText, { color: numberColor }]}>
              {index + 1}
            </Animated.Text>
          </Animated.View>

          <View style={styles.cardBody}>
            <Text style={styles.cardName}>{name}</Text>
            <View style={styles.cardMeta}>
              <Text style={[styles.cardMetaText, { color: timeColor }]}>
                {timeBadge.label}
              </Text>
              <Text style={styles.cardMetaText}>
                {' · '}{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Chevron — hidden in edit mode */}
        {!editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.chevronHitArea,
              pressed && styles.chevronPressed,
            ]}
            onPress={onToggleExpand}
          >
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <Feather name="chevron-down" size={18} color={COLORS.textMuted} />
            </Animated.View>
          </Pressable>
        )}
      </View>

      {/* Expandable exercise list — hidden in edit mode */}
      {!editMode && (
        <Animated.View style={[styles.exercisesContainer, { height: animatedHeight }]}>
          <View style={styles.exercisesInner}>
            {exercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseRow}>
                <View style={styles.exerciseDot} />
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {exercise.sets.length} sets · {getRepRange(exercise)}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Delete button ─────────────────────────────────────────

  deleteBtn: {
    width: 44,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    backgroundColor: COLORS.errorLight,
  },

  // ── Nav area ──────────────────────────────────────────────

  cardNavArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm + 2,
  },
  cardNavAreaPressed: {
    backgroundColor: COLORS.lightGray,
  },

  // ── Chevron ───────────────────────────────────────────────

  chevronHitArea: {
    width: 48,
    height: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronPressed: {
    backgroundColor: COLORS.lightGray,
  },

  // ── Number badge ──────────────────────────────────────────

  cardNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumberText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
  },

  // ── Body ──────────────────────────────────────────────────

  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: FONT_SIZE.md + 1,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  cardMeta: {
    flexDirection: 'row',
  },
  cardMetaText: {
    fontSize: FONT_SIZE.xs + 1,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },

  // ── Exercise list ─────────────────────────────────────────

  exercisesContainer: {
    overflow: 'hidden',
  },
  exercisesInner: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm + 2,
    paddingLeft: SPACING.md + 36 + SPACING.sm + 2,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  exerciseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  exerciseName: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  exerciseDetail: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textMuted,
  },
});
