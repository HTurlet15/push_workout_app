import { View, Animated, Pressable, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import ViewSelector from './ViewSelector';
import SetHeader from './SetHeader';
import NextSetHeader from './NextSetHeader';
import PreviousSetHeader from './PreviousSetHeader';
import SetFooter from './SetFooter';
import SetRow from './SetRow';
import PreviousSetRow from './PreviousSetRow';
import NextSetRow from './NextSetRow';
import ExerciseNote from './ExerciseNote';
import useSlideTransition from '../hooks/useSlideTransition';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../theme/theme';

/**
 * View-to-border-color mapping.
 * Each view gets a distinct left border accent for quick visual identification.
 */
const VIEW_BORDER_COLORS = {
  previous: COLORS.viewPrevious,
  current: COLORS.viewCurrent,
  next: COLORS.viewNext,
};

/**
 * Container card for a single exercise within the workout.
 *
 * Manages three view modes (Previous / Current / Next) with animated
 * horizontal slide transitions. Each view renders its own header,
 * data rows, and shared components (note strip, footer).
 *
 * In edit mode, additional controls appear:
 * - Exercise name becomes editable (gray pill background)
 * - Red delete buttons on each set row
 * - Dashed "Add set" button below the last row
 * - "Add note..." placeholder when no note exists
 * - Dashed blue "Add exercise" button below the card
 *
 * @param {Object} exercise            - Current workout exercise data.
 * @param {Object} previousExercise    - Previous session data (may be undefined).
 * @param {Object} nextExercise        - Next planned data (may be undefined).
 * @param {Function} onUpdateSet       - Callback: (exerciseId, setId, field, value).
 * @param {Function} onUpdateNextSet   - Callback for next view edits.
 * @param {Function} onDeleteSet       - Callback: (exerciseId, setId).
 * @param {Function} onAddSet          - Callback: (exerciseId).
 * @param {Function} onUpdateNote      - Callback: (exerciseId, noteText).
 * @param {Function} onUpdateName      - Callback: (exerciseId, newName).
 * @param {Function} onAddExercise     - Callback: (afterExerciseId).
 * @param {boolean} editMode           - Whether edit controls are visible.
 * @param {boolean} autoFocusName      - Whether to auto-focus the name input (newly created exercise).
 */
export default function ExerciseCard({
  exercise,
  previousExercise,
  nextExercise,
  onUpdateSet,
  onUpdateNextSet,
  onDeleteSet,
  onAddSet,
  onUpdateNote,
  onUpdateName,
  onAddExercise,
  editMode = false,
  autoFocusName = false,
}) {
  const { width } = useWindowDimensions();
  const { displayedView, slideAnim, transitionTo } = useSlideTransition('current');

  /** Controls whether the name TextInput is visible */
  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef(null);

  /** Auto-focus name input for newly created exercises */
  useEffect(() => {
    if (autoFocusName && editMode) {
      setEditingName(true);
    }
  }, [autoFocusName, editMode]);

  /** Whether the exercise has a placeholder name (just created) */
  const isPlaceholderName = !exercise.name || exercise.name === 'New Exercise';

  /**
   * Slide animation interpolations.
   * Content slides horizontally (30% of screen width) and fades during transitions.
   */
  const translateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width * 0.3, 0, width * 0.3],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  });

  // ── Exercise Name ─────────────────────────────────────────

  const renderExerciseName = () => {
    // Editing state: inline TextInput in gray pill
    if (editingName) {
      return (
        <View style={styles.namePill}>
          <TextInput
            ref={nameInputRef}
            style={styles.nameInput}
            value={isPlaceholderName ? '' : exercise.name}
            onChangeText={(text) => onUpdateName?.(exercise.id, text)}
            placeholder="Tap to name..."
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="done"
            autoFocus
            onSubmitEditing={() => setEditingName(false)}
            onBlur={() => setEditingName(false)}
          />
        </View>
      );
    }

    // Edit mode: tappable pill background — signals "this is editable"
    if (editMode) {
      return (
        <Pressable
          style={({ pressed }) => [styles.namePill, pressed && styles.namePillPressed]}
          onPress={() => setEditingName(true)}
        >
          <Text
            variant="exercise"
            style={[
              styles.exerciseName,
              isPlaceholderName && styles.exerciseNamePlaceholder,
            ]}
          >
            {isPlaceholderName ? 'Tap to name...' : exercise.name}
          </Text>
        </Pressable>
      );
    }

    // Normal mode: static text, no interaction
    return (
      <Text variant="exercise" style={styles.exerciseName}>
        {exercise.name}
      </Text>
    );
  };

  // ── Current View ──────────────────────────────────────────

  const renderCurrentView = () => (
    <>
      <SetHeader />

      {/* Note strip: editable in all views, "add note" only in edit mode */}
      <ExerciseNote
        note={exercise.note}
        editMode={editMode}
        onUpdateNote={(text) => onUpdateNote?.(exercise.id, text)}
      />

      {/* Set rows with inline badge editing */}
      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          index={index}
          set={set}
          editMode={editMode}
          onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
          onDelete={() => onDeleteSet?.(exercise.id, set.id)}
        />
      ))}

      {/* Dashed "Add set" button — only visible in edit mode */}
      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.addSetBtn, pressed && styles.addSetBtnPressed]}
          onPress={() => onAddSet?.(exercise.id)}
        >
          <Feather name="plus" size={FONT_SIZE.caption} color={COLORS.textSecondary} />
          <Text variant="caption" style={styles.addSetText}>Add set</Text>
        </Pressable>
      )}

      <SetFooter />
    </>
  );

  // ── Previous View ─────────────────────────────────────────

  const renderPreviousView = () => {
    if (!previousExercise) {
      return (
        <Text variant="caption" style={styles.emptyMessage}>
          No previous data available
        </Text>
      );
    }

    return (
      <>
        <PreviousSetHeader />

        {/* Note is shared across views — same data, always tappable */}
        <ExerciseNote
          note={exercise.note}
          editMode={editMode}
          onUpdateNote={(text) => onUpdateNote?.(exercise.id, text)}
        />

        {/* Read-only historical rows */}
        {previousExercise.sets.map((set, index) => (
          <PreviousSetRow
            key={set.id}
            index={index}
            weight={set.weight}
            reps={set.reps}
            rir={set.rir}
          />
        ))}

        <SetFooter />
      </>
    );
  };

  // ── Next View ─────────────────────────────────────────────

  const renderNextView = () => {
    if (!nextExercise) {
      return (
        <Text variant="caption" style={styles.emptyMessage}>
          No planned data available
        </Text>
      );
    }

    return (
      <>
        <NextSetHeader />

        <ExerciseNote
          note={exercise.note}
          editMode={editMode}
          onUpdateNote={(text) => onUpdateNote?.(exercise.id, text)}
        />

        {/* Delta rows: compare current values with next planned values */}
        {exercise.sets.map((set, index) => {
          const nextSet = nextExercise.sets[index];
          if (!nextSet) return null;

          return (
            <NextSetRow
              key={set.id}
              index={index}
              currentSet={set}
              nextSet={nextSet}
              onUpdateNextSet={(field, value) => onUpdateNextSet?.(exercise.id, nextSet.id, field, value)}
            />
          );
        })}

        <SetFooter />
      </>
    );
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <View style={styles.card}>
      {/* Title row: exercise name (static or editable) + view selector */}
      <View style={styles.titleRow}>
        {renderExerciseName()}
        <ViewSelector activeView={displayedView} onChangeView={transitionTo} />
      </View>

      {/* Table card with colored left border and slide animation */}
      <View style={[
        styles.tableCard,
        { borderLeftColor: VIEW_BORDER_COLORS[displayedView] },
      ]}>
        <Animated.View style={{ transform: [{ translateX }], opacity }}>
          {displayedView === 'current' && renderCurrentView()}
          {displayedView === 'previous' && renderPreviousView()}
          {displayedView === 'next' && renderNextView()}
        </Animated.View>
      </View>

      {/* Dashed blue "Add exercise" button — inserts a new exercise below this one */}
      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.addExerciseBtn, pressed && styles.addExerciseBtnPressed]}
          onPress={() => onAddExercise?.(exercise.id)}
        >
          <Feather name="plus" size={FONT_SIZE.md} color={COLORS.viewCurrent} />
          <Text variant="caption" style={styles.addExerciseText}>Add exercise</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  /** Outer card wrapper with vertical margin between exercises */
  card: {
    marginVertical: SPACING.md,
  },
  /** Table container with left accent border and card shadow */
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    borderLeftWidth: SIZE.tableBorderLeft,
    borderLeftColor: COLORS.viewCurrent,
    overflow: 'hidden',
  },
  /** Exercise name + view selector row */
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },

  // ── Exercise name styles ──────────────────────────────────

  /** Static exercise name (normal mode) */
  exerciseName: {
    color: COLORS.textPrimary,
  },
  /** Placeholder text for unnamed exercises — muted, medium weight */
  exerciseNamePlaceholder: {
    color: COLORS.textMuted,
    fontFamily: FONT_FAMILY.medium,
  },
  /** Gray pill background in edit mode — signals "tappable field" */
  namePill: {
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.mediumGray,
    paddingBottom: 2,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm + SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  /** Pill pressed feedback */
  namePillPressed: {
    backgroundColor: COLORS.selectedInput,
  },
  /** Inline TextInput for name editing — matches exercise Text variant styling */
  nameInput: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.semibold,
    color: COLORS.textPrimary,
    padding: 0,
    margin: 0,
    minWidth: 120,
  },

  // ── Shared styles ─────────────────────────────────────────

  /** Empty state message for missing previous/next data */
  emptyMessage: {
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  /** Dashed gray "Add set" button in edit mode */
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.mediumGray,
    marginVertical: SPACING.sm,
  },
  addSetBtnPressed: {
    backgroundColor: COLORS.timerResetBg,
  },
  addSetText: {
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.semibold,
  },
  /** Dashed blue "Add exercise" button below each card in edit mode */
  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.viewCurrent,
    marginTop: SPACING.sm,
  },
  addExerciseBtnPressed: {
    backgroundColor: COLORS.addExercisePressed,
  },
  addExerciseText: {
    color: COLORS.viewCurrent,
    fontFamily: FONT_FAMILY.semibold,
  },
});