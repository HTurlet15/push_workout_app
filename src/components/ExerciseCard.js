import { View, Animated, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
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
 * - Red delete buttons on each set row
 * - Dashed "Add set" button below the last row
 * - "Add note..." placeholder when no note exists
 *
 * @param {Object} exercise            - Current workout exercise data.
 * @param {Object} previousExercise    - Previous session data (may be undefined).
 * @param {Object} nextExercise        - Next planned data (may be undefined).
 * @param {Function} onUpdateSet       - Callback: (exerciseId, setId, field, value).
 * @param {Function} onUpdateNextSet   - Callback for next view edits.
 * @param {Function} onDeleteSet       - Callback: (exerciseId, setId).
 * @param {Function} onAddSet          - Callback: (exerciseId).
 * @param {Function} onUpdateNote      - Callback: (exerciseId, noteText).
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
  onAddExercise,
  editMode = false,
}) {
  const { width } = useWindowDimensions();
  const { displayedView, slideAnim, transitionTo } = useSlideTransition('current');

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

      {/* Dashed "Add set" button - only visible in edit mode */}
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

        {/* Note is shared across views - same data, always tappable */}
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
      <View style={styles.titleRow}>
        <Text variant="exercise" style={styles.exerciseName}>
          {exercise.name}
        </Text>
        <ViewSelector activeView={displayedView} onChangeView={transitionTo} />
      </View>

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
  exerciseName: {
    color: COLORS.textPrimary,
  },
  /** Empty state message for missing previous/next data */
  emptyMessage: {
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  /** Dashed "Add set" button in edit mode */
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
    backgroundColor: '#EBF3FF',
  },
  addExerciseText: {
    color: COLORS.viewCurrent,
    fontFamily: FONT_FAMILY.semibold,
  },
});