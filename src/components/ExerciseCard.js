import { View, Animated, Pressable, TextInput, StyleSheet, useWindowDimensions, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useState, useRef, useCallback, useEffect } from 'react';
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

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Conversion factor — all data is stored in kg */
const KG_TO_LBS = 2.20462;

const VIEW_BORDER_COLORS = {
  previous: COLORS.viewPrevious,
  current: COLORS.viewCurrent,
  next: COLORS.viewNext,
};

/**
 * Container card for a single exercise within the workout.
 *
 * Animations:
 * - Fade on kg/lbs toggle: only weight text values fade (not entire rows)
 * - Pop on add set/exercise: LayoutAnimation spring scaleXY
 * - Depop on delete set/exercise: LayoutAnimation easeOut opacity
 * - Checkmark flash on set completion: SetRow receives justCompleted prop
 * - Slide on view change: existing horizontal slide transition
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
  onUpdateRest,
  justCompletedSetId,
  editMode = false,
}) {
  const { width } = useWindowDimensions();
  const { displayedView, slideAnim, transitionTo } = useSlideTransition('current');

  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef(null);
  const [unit, setUnit] = useState('kg');

  /** Animated opacity for weight values only — passed to child rows */
  const weightFadeAnim = useRef(new Animated.Value(1)).current;

  const isPlaceholderName = !exercise.name || exercise.name === 'New Exercise';
  const restTimerSeconds = exercise.restTimerSeconds ?? 90;

  const translateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width * 0.3, 0, width * 0.3],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  });

  // ── Unit helpers ──────────────────────────────────────────

  const displayWeight = useCallback((kgValue) => {
    if (kgValue == null) return null;
    if (unit === 'lbs') return Math.round(kgValue * KG_TO_LBS * 10) / 10;
    return kgValue;
  }, [unit]);

  const toKg = useCallback((inputValue) => {
    if (unit === 'lbs') return Math.round((inputValue / KG_TO_LBS) * 10) / 10;
    return inputValue;
  }, [unit]);

  /**
   * Animated unit toggle: fade out weight values → switch unit → fade in.
   * Uses a ref to prevent the state update from interrupting the fade-in.
   */
  const pendingUnit = useRef(null);

  const handleToggleUnit = useCallback((newUnit) => {
    pendingUnit.current = newUnit;

    // Fade out
    Animated.timing(weightFadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      // Switch unit at the midpoint
      setUnit(pendingUnit.current);

      // Small delay to let re-render complete, then fade in
      requestAnimationFrame(() => {
        Animated.timing(weightFadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [weightFadeAnim]);

  // ── Add/Delete with LayoutAnimation ───────────────────────

  const handleAddSet = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(250, 'easeInEaseOut', 'scaleXY')
    );
    onAddSet?.(exercise.id);
  }, [exercise.id, onAddSet]);

  const handleDeleteSet = useCallback((setId) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );
    onDeleteSet?.(exercise.id, setId);
  }, [exercise.id, onDeleteSet]);

  const handleDeleteExercise = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(250, 'easeInEaseOut', 'opacity')
    );
    onDeleteExercise?.(exercise.id);
  }, [exercise.id, onDeleteExercise]);

  const handleAddExercise = useCallback(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(300, 'easeInEaseOut', 'scaleXY')
    );
    onAddExercise?.(exercise.id);
  }, [exercise.id, onAddExercise]);

  // ── Exercise Name ─────────────────────────────────────────

  const renderExerciseName = () => {
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

    return (
      <Text variant="exercise" style={styles.exerciseName}>
        {exercise.name}
      </Text>
    );
  };

  // ── Footer ────────────────────────────────────────────────

  const renderFooter = () => (
    <SetFooter
      restSeconds={restTimerSeconds}
      unit={unit}
      onToggleUnit={handleToggleUnit}
      onRestPress={() => onRestPress?.(exercise.id)}
      onUpdateRest={(seconds) => onUpdateRest?.(exercise.id, seconds)}
      editMode={editMode}
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
          weightFadeAnim={weightFadeAnim}
          justCompleted={justCompletedSetId === set.id}
          editMode={editMode}
          onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
          onDelete={() => handleDeleteSet(set.id)}
        />
      ))}

      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.addSetBtn, pressed && styles.addSetBtnPressed]}
          onPress={handleAddSet}
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
            weightFadeAnim={weightFadeAnim}
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
              weightFadeAnim={weightFadeAnim}
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
      <View style={styles.titleRow}>
        {editMode && (
          <Pressable
            style={({ pressed }) => [
              styles.deleteExerciseBtn,
              pressed && styles.deleteExerciseBtnPressed,
            ]}
            onPress={handleDeleteExercise}
          >
            <Feather name="x" size={SIZE.iconSm - 4} color={COLORS.error} />
          </Pressable>
        )}

        {renderExerciseName()}

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

      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.addExerciseBtn, pressed && styles.addExerciseBtnPressed]}
          onPress={handleAddExercise}
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
    borderBottomColor: COLORS.textPrimary,
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