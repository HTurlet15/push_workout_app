import { View, Pressable, TextInput, Animated, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { CopilotStep, walkthroughable } from 'react-native-copilot';
import Text from '../common/Text';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

const WalkthroughView = walkthroughable(View);

/**
 * Individual program card with:
 * - Radio button → select this program
 * - Tap body → also selects
 * - Chevron → expand/collapse workout preview
 * - Edit mode → delete button, no radio/chevron
 * - Active program has inset border
 * - Optional note strip (yellow)
 *
 * @param {Object} program       - Program data { id, name, note, frequency, workouts }.
 * @param {boolean} isSelected   - Whether this is the active program.
 * @param {boolean} isExpanded   - Whether workout list is visible.
 * @param {boolean} editMode     - Whether edit controls are shown.
 * @param {Function} onSelect    - Select this program.
 * @param {Function} onToggleExpand - Toggle workout preview.
 * @param {Function} onDelete    - Delete this program.
 * @param {Function} onUpdateNote - Update the program note text.
 * @param {Function} onUpdateFrequency - Update the program frequency text.
 * @param {Function} onUpdateName - Update the program name.
 * @param {boolean} isFirst - Whether this is the first card (for tutorial targeting).
 */
export default function ProgramCard({
  program,
  isSelected,
  isExpanded,
  editMode,
  onSelect,
  onToggleExpand,
  onDelete,
  onUpdateNote,
  onUpdateFrequency,
  onUpdateName,
  isFirst = false,
}) {
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const chevronAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

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
    ]).start();
  }, [isExpanded]);

  // Note adds ~40px, each workout row ~40px, plus padding
  const noteHeight = program.note ? SIZE.exerciseRowHeight : 0;
  const workouts = program.sessions || [];
  const maxContentHeight = workouts.length * SIZE.exerciseRowHeight + noteHeight + SPACING.md;

  const animatedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxContentHeight],
  });

  const chevronRotation = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const cardContent = (
    <View style={[styles.card, isSelected && styles.cardActive]}>
      <View style={styles.cardMain}>
        {/* Edit mode: delete button */}
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

        {/* Normal mode: radio button */}
        {!editMode && (
          isFirst ? (
            <CopilotStep text="" name="program-radio" order={3}>
              <WalkthroughView style={styles.radioZone}>
                <Pressable style={styles.radioZone} onPress={onSelect}>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              </WalkthroughView>
            </CopilotStep>
          ) : (
            <Pressable style={styles.radioZone} onPress={onSelect}>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          )
        )}

        {/* Body */}
        {editMode ? (
          <View style={styles.cardBody}>
            <TextInput
              style={styles.cardNameInput}
              value={program.name}
              onChangeText={(text) => onUpdateName?.(text)}
              placeholder="Program name"
              placeholderTextColor={COLORS.textMuted}
              returnKeyType="done"
            />
            <View style={styles.cardMeta}>
              <Text style={styles.cardMetaText}>
                {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
              </Text>
              <View style={styles.frequencyEditable}>
                <Text style={styles.cardMetaText}> · </Text>
                <TextInput
                  style={styles.frequencyInput}
                  value={program.frequency || ''}
                  onChangeText={(text) => onUpdateFrequency?.(text || null)}
                  placeholder="e.g. 4d/week"
                  placeholderTextColor={COLORS.textMuted}
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.cardBody,
              pressed && styles.cardBodyPressed,
            ]}
            onPress={onSelect}
          >
            <Text style={styles.cardName}>{program.name}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.cardMetaText}>
                {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
              </Text>
              {program.frequency ? (
                <Text style={styles.cardMetaText}> · {program.frequency}</Text>
              ) : null}
            </View>
          </Pressable>
        )}

        {/* Chevron — hidden in edit mode */}
        {!editMode && (
          isFirst ? (
            <CopilotStep text="" name="program-chevron" order={2}>
              <WalkthroughView>
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
              </WalkthroughView>
            </CopilotStep>
          ) : (
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
          )
        )}
      </View>

      {/* Editable note — edit mode only */}
      {editMode && (
        <View style={styles.noteStripEditable}>
          <View style={styles.noteBorder} />
          <TextInput
            style={styles.noteInput}
            value={program.note || ''}
            onChangeText={(text) => onUpdateNote?.(text || null)}
            placeholder="add note..."
            placeholderTextColor={COLORS.notePlaceholder}
            multiline
          />
        </View>
      )}

      {/* Expandable content */}
      {!editMode && (
        <Animated.View style={[styles.expandContainer, { height: animatedHeight }]}>
          {program.note && (
            <View style={styles.noteStrip}>
              <View style={styles.noteBorder} />
              <Text style={styles.noteText}>{program.note}</Text>
            </View>
          )}
          {workouts.map((session) => (
            <View key={session.current.id} style={styles.workoutRow}>
              <View style={styles.workoutDot} />
              <Text style={styles.workoutName}>{session.current.name}</Text>
              <Text style={styles.workoutDetail}>
                {session.current.exercises.length} exercise{session.current.exercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );

  if (isFirst) {
    return (
      <CopilotStep text="" name="program-card" order={1}>
        <WalkthroughView>
          {cardContent}
        </WalkthroughView>
      </CopilotStep>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    marginBottom: SPACING.smd,
    overflow: 'hidden',
    borderWidth: SIZE.borderAccent,
    borderColor: 'transparent',
  },
  cardActive: {
    borderColor: COLORS.textPrimary,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ── Radio ─────────────────────────────────────────────────

  radioZone: {
    width: SIZE.touchTarget,
    height: SIZE.cardRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: SIZE.iconLg,
    height: SIZE.iconLg,
    borderRadius: SIZE.iconLg / 2,
    borderWidth: SIZE.borderAccent,
    borderColor: COLORS.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLORS.textPrimary,
    backgroundColor: COLORS.textPrimary,
  },
  radioInner: {
    width: SIZE.dotLg,
    height: SIZE.dotLg,
    borderRadius: SIZE.dotLg / 2,
    backgroundColor: COLORS.white,
  },

  // ── Delete ────────────────────────────────────────────────

  deleteBtn: {
    width: SIZE.touchTarget,
    height: SIZE.cardRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    backgroundColor: COLORS.errorLight,
  },

  // ── Body ──────────────────────────────────────────────────

  cardBody: {
    flex: 1,
    paddingVertical: SPACING.md,
  },
  cardBodyPressed: {
    backgroundColor: COLORS.lightGray,
  },
  cardName: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
  },
  cardNameInput: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xxs,
    borderBottomWidth: SIZE.borderAccent,
    borderBottomColor: COLORS.mediumGray,
    paddingVertical: 0,
    margin: 0,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardMetaText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  frequencyEditable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyInput: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
    borderBottomWidth: SIZE.borderAccent,
    borderBottomColor: COLORS.mediumGray,
    paddingVertical: 0,
    paddingHorizontal: SPACING.xs,
    margin: 0,
    minWidth: 70,
  },

  // ── Chevron ───────────────────────────────────────────────

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

  // ── Expandable content ────────────────────────────────────

  expandContainer: {
    overflow: 'hidden',
  },

  // ── Note strip ────────────────────────────────────────────

  noteStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingLeft: SIZE.touchTarget,
    backgroundColor: COLORS.noteBackground,
    gap: SPACING.xsm,
  },
  noteBorder: {
    width: SIZE.noteBorderLeft,
    alignSelf: 'stretch',
    backgroundColor: COLORS.noteBorder,
    borderRadius: SIZE.borderAccent,
  },
  noteText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.italic,
    color: COLORS.noteText,
  },
  noteStripEditable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingLeft: SIZE.touchTarget,
    backgroundColor: COLORS.noteBackground,
    gap: SPACING.xsm,
  },
  noteInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontFamily: FONT_FAMILY.italic,
    color: COLORS.noteText,
    padding: 0,
    margin: 0,
  },

  // ── Workout rows ──────────────────────────────────────────

  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.smd,
    paddingHorizontal: SPACING.md,
    paddingLeft: SIZE.touchTarget,
    borderTopWidth: SIZE.border,
    borderTopColor: COLORS.lightGray,
    gap: SPACING.sm,
  },
  workoutDot: {
    width: SIZE.dotSm,
    height: SIZE.dotSm,
    borderRadius: SIZE.dotSm / 2,
    backgroundColor: COLORS.textMuted,
  },
  workoutName: {
    flex: 1,
    fontSize: FONT_SIZE.caption,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textSecondary,
  },
  workoutDetail: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.textMuted,
  },
});