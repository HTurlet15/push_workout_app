import { View, Animated, Pressable, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef } from 'react';
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

/** Conversion factor — all data is stored in kg */
const KG_TO_LBS = 2.20462;

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
 * Features:
 * - Local kg/lbs toggle — conversion is purely visual, data stored in kg
 * - Per-exercise rest timer displayed in footer, tap to set global timer
 * - Edit mode controls (delete, rename, add/delete sets, notes)
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
 * @param {Function} onDeleteExercise  - Callback: (exerciseId).
 * @param {Function} onRestPress       - Callback: (exerciseId) tap rest badge to set global timer.
 * @param {boolean} editMode           - Whether edit controls are visible.
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
  onDeleteExercise,
  onRestPress,
  editMode = false,
}) {
  const { width } = useWindowDimensions();
  const { displayedView, slideAnim, transitionTo } = useSlideTransition('current');

  /** Controls whether the name TextInput is visible */
  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef(null);

  /** Weight unit toggle — local to this exercise card */
  const [unit, setUnit] = useState('kg');

  /** Whether the exercise has a placeholder name (just created) */
  const isPlaceholderName = !exercise.name || exercise.name === 'New Exercise';

  /** Rest timer seconds from the exercise data, default 90 */
  const restTimerSeconds = exercise.restTimerSeconds ?? 90;

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

  // ── Unit helpers ──────────────────────────────────────────

  /** Convert a kg value for display based on current unit */
  const displayWeight = (kgValue) => {
    if (kgValue == null) return null;
    if (unit === 'lbs') return Math.round(kgValue * KG_TO_LBS * 10) / 10;
    return kgValue;
  };

  /** Convert a user-entered value back to kg for storage */
  const toKg = (inputValue) => {
    if (unit === 'lbs') return Math.round((inputValue / KG_TO_LBS) * 10) / 10;
    return inputValue;
  };

  // ── Exercise Name ─────────────────────────────────────────

  const renderExerciseName = () => {
    // Editing state: inline TextInput with underline
    if (editingName) {
      return (
        <View style={[styles.nameEditable, styles.nameEditableActive]}>
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

    // Edit mode: tappable with underline cue
    if (editMode) {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.nameEditable,
            pressed && styles.nameEditablePressed,
          ]}
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

    // Normal mode: static text
    return (
      <Text variant="exercise" style={styles.exerciseName}>
        {exercise.name}
      </Text>
    );
  };

  // ── Shared footer for all views ───────────────────────────

  /** Footer reads rest time from exercise data, tap sets global timer */
  const renderFooter = () => (
    <SetFooter
      restSeconds={restTimerSeconds}
      unit={unit}
      onToggleUnit={setUnit}
      onRestPress={() => onRestPress?.(exercise.id)}
    />
  );

  // ── Current View ──────────────────────────────────────────

  const renderCurrentView = () => (
    <>
      <SetHeader />

      <ExerciseNote
        note={exercise.note}
        editMode={editMode}
        onUpdateNote={(text) => onUpdateNote?.(exercise.id, text)}
      />

      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          index={index}
          set={set}
          unit={unit}
          displayWeight={displayWeight}
          toKg={toKg}
          editMode={editMode}
          onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
          onDelete={() => onDeleteSet?.(exercise.id, set.id)}
        />
      ))}

      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.addSetBtn, pressed && styles.addSetBtnPressed]}
          onPress={() => onAddSet?.(exercise.id)}
        >
          <Feather name="plus" size={FONT_SIZE.caption} color={COLORS.textSecondary} />
          <Text variant="caption" style={styles.addSetText}>Add set</Text>
        </Pressable>
      )}

      {renderFooter()}
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

        <ExerciseNote
          note={exercise.note}
          editMode={editMode}
          onUpdateNote={(text) => onUpdateNote?.(exercise.id, text)}
        />

        {previousExercise.sets.map((set, index) => (
          <PreviousSetRow
            key={set.id}
            index={index}
            weight={displayWeight(set.weight)}
            reps={set.reps}
            rir={set.rir}
            unit={unit}
          />
        ))}

        {renderFooter()}
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

        {exercise.sets.map((set, index) => {
          const nextSet = nextExercise.sets[index];
          if (!nextSet) return null;

          return (
            <NextSetRow
              key={set.id}
              index={index}
              currentSet={set}
              nextSet={nextSet}
              unit={unit}
              displayWeight={displayWeight}
              onUpdateNextSet={(field, value) => onUpdateNextSet?.(exercise.id, nextSet.id, field, value)}
            />
          );
        })}

        {renderFooter()}
      </>
    );
  };

  // ── Render ────────────────────────────────────────────────

  return (
    <View style={styles.card}>
      {/* Title row: delete button + exercise name + view selector */}
      <View style={styles.titleRow}>
        {editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteExerciseBtn,
              pressed && styles.deleteExerciseBtnPressed,
            ]}
            onPress={() => onDeleteExercise?.(exercise.id)}
          >
            <Feather name="x" size={SIZE.iconSm - 4} color={COLORS.error} />
          </Pressable>
        )}

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

      {/* Dashed blue "Add exercise" button */}
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
  card: {
    marginVertical: SPACING.md,
  },
  tableCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    borderLeftWidth: SIZE.tableBorderLeft,
    borderLeftColor: COLORS.viewCurrent,
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },

  // ── Exercise name ─────────────────────────────────────────

  exerciseName: {
    color: COLORS.textPrimary,
    flex: 1,
  },
  exerciseNamePlaceholder: {
    color: COLORS.textMuted,
    fontFamily: FONT_FAMILY.medium,
    fontStyle: 'italic',
  },
  nameEditable: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.mediumGray,
    paddingBottom: 2,
  },
  nameEditableActive: {
    borderBottomColor: COLORS.viewCurrent,
  },
  nameEditablePressed: {
    borderBottomColor: COLORS.textSecondary,
  },
  nameInput: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONT_FAMILY.semibold,
    color: COLORS.textPrimary,
    padding: 0,
    margin: 0,
    minWidth: 120,
  },

  // ── Delete exercise ───────────────────────────────────────

  deleteExerciseBtn: {
    width: SIZE.deleteBtn + 4,
    height: SIZE.deleteBtn + 4,
    borderRadius: (SIZE.deleteBtn + 4) / 2,
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  deleteExerciseBtnPressed: {
    backgroundColor: COLORS.errorPressed,
  },

  // ── Shared ────────────────────────────────────────────────

  emptyMessage: {
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
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