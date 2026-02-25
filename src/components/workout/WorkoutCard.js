import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

/**
 * Individual workout card with:
 * - Tap body → navigate to workout
 * - Tap chevron → expand/collapse exercise preview
 * - Edit mode → show delete button, hide chevron
 * - Animated number badge (gray ↔ black on expand)
 * - Rep range display per exercise
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

  const maxExerciseHeight = exercises.length * SIZE.exerciseRowHeight + SPACING.md;

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

  return (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        {editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
            onPress={onDelete}
          >
            <Feather name="minus-circle" size={SIZE.iconMd} color={COLORS.error} />
          </Pressable>
        )}

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

        {!editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.chevronHitArea,
              pressed && styles.chevronPressed,
            ]}
            onPress={onToggleExpand}
          >
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <Feather name="chevron-down" size={SIZE.iconChevron} color={COLORS.textMuted} />
            </Animated.View>
          </Pressable>
        )}
      </View>

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
  deleteBtn: {
    width: SIZE.touchTarget,
    height: SIZE.cardRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    backgroundColor: COLORS.errorLight,
  },
  cardNavArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.smd,
  },
  cardNavAreaPressed: {
    backgroundColor: COLORS.lightGray,
  },
  chevronHitArea: {
    width: SIZE.touchTargetLg,
    height: '100%',
    minHeight: SIZE.cardRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronPressed: {
    backgroundColor: COLORS.lightGray,
  },
  cardNumber: {
    width: SIZE.numberBadge,
    height: SIZE.numberBadge,
    borderRadius: RADIUS.smd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumberText: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  cardMeta: {
    flexDirection: 'row',
  },
  cardMetaText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  exercisesContainer: {
    overflow: 'hidden',
  },
  exercisesInner: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.smd,
    paddingLeft: SPACING.md + SIZE.numberBadge + SPACING.smd,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.smd,
    gap: SPACING.sm,
    borderTopWidth: SIZE.border,
    borderTopColor: COLORS.lightGray,
  },
  exerciseDot: {
    width: SIZE.dotSm,
    height: SIZE.dotSm,
    borderRadius: SIZE.dotSm / 2,
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