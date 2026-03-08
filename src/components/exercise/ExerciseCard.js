import { View, Animated, Pressable, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import Text from '../common/Text';
import ViewSelector from './ViewSelector';
import SetHeader from './SetHeader';
import NextSetHeader from './NextSetHeader';
import PreviousSetHeader from './PreviousSetHeader';
import SetFooter from './SetFooter';
import SetRow from './SetRow';
import PreviousSetRow from './PreviousSetRow';
import NextSetRow from './NextSetRow';
import ExerciseNote from './ExerciseNote';
import useSlideTransition from '../../hooks/useSlideTransition';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_FAMILY, SIZE, SHADOW } from '../../theme/theme';

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
 * Animations (all using native Animated API, no LayoutAnimation):
 * - Fade on kg/lbs toggle: only weight text values fade
 * - Pop on add set: new SetRow has isNew=true, animates scale+opacity on mount
 * - Depop on delete set: row animates out before actual deletion
 * - Checkmark flash on set completion: SetRow handles via justCompleted
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
  onUpdateRepRange,
  justCompletedSetId,
  editMode = false,
  isFirst = false,
}) {
  const { width } = useWindowDimensions();
  const { displayedView, slideAnim, transitionTo } = useSlideTransition('current');

  const [editingName, setEditingName] = useState(false);
  const nameInputRef = useRef(null);
  const [unit, setUnit] = useState('kg');

  /** Animated opacity for weight values only */
  const weightFadeAnim = useRef(new Animated.Value(1)).current;

  /** Set of set IDs that were just added — triggers pop-in animation */
  const [newSetIds, setNewSetIds] = useState(new Set());

  /** Set of set IDs currently animating out — delays actual deletion */
  const [deletingSetIds, setDeletingSetIds] = useState(new Set());

  /** Animated values for rows being deleted, keyed by set ID */
  const deleteAnims = useRef({});

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

  /**
   * Affiche la valeur de poids selon l'unité courante.
   * Accepte un objet { kg, lbs } (format actuel) ou un nombre brut en kg (ancien format).
   */
  const displayWeight = useCallback((value) => {
    if (value == null) return null;
    if (typeof value === 'object') return unit === 'lbs' ? value.lbs : value.kg;
    // Compat backward : nombre brut kg (anciennes données)
    if (unit === 'lbs') return Math.round(value * KG_TO_LBS * 10) / 10;
    return Math.round(value * 10) / 10;
  }, [unit]);

  /**
   * Convertit la saisie utilisateur en paire { kg, lbs } pré-calculée.
   * Stocké tel quel — aucune conversion supplémentaire à l'affichage.
   */
  const toKg = useCallback((inputValue) => {
    if (unit === 'lbs') return { kg: Math.round(inputValue / KG_TO_LBS * 10) / 10, lbs: inputValue };
    return { kg: inputValue, lbs: Math.round(inputValue * KG_TO_LBS * 10) / 10 };
  }, [unit]);

  /** Animated unit toggle with requestAnimationFrame for reliable fade-in */
  const pendingUnit = useRef(null);

  const handleToggleUnit = useCallback((newUnit) => {
    pendingUnit.current = newUnit;

    Animated.timing(weightFadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setUnit(pendingUnit.current);
      requestAnimationFrame(() => {
        Animated.timing(weightFadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [weightFadeAnim]);

  // ── Add set with pop ──────────────────────────────────────

  const handleAddSet = useCallback(() => {
    // Generate the ID here so we can track it as "new"
    const newId = `set-${Date.now()}`;
    setNewSetIds((prev) => new Set(prev).add(newId));
    onAddSet?.(exercise.id, newId);

    // Clear "new" flag after animation completes
    setTimeout(() => {
      setNewSetIds((prev) => {
        const next = new Set(prev);
        next.delete(newId);
        return next;
      });
    }, 400);
  }, [exercise.id, onAddSet]);

  // ── Delete set with depop ─────────────────────────────────

  const handleDeleteSet = useCallback((setId) => {
    // Create anim value for this row
    deleteAnims.current[setId] = new Animated.Value(1);
    setDeletingSetIds((prev) => new Set(prev).add(setId));

    // Animate out: shrink + fade
    Animated.timing(deleteAnims.current[setId], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Actually delete after animation
      setDeletingSetIds((prev) => {
        const next = new Set(prev);
        next.delete(setId);
        return next;
      });
      delete deleteAnims.current[setId];
      onDeleteSet?.(exercise.id, setId);
    });
  }, [exercise.id, onDeleteSet]);

  // ── Delete exercise with depop ────────────────────────────

  const handleDeleteExercise = useCallback(() => {
    onDeleteExercise?.(exercise.id);
  }, [exercise.id, onDeleteExercise]);

  // ── Add exercise ──────────────────────────────────────────

  const handleAddExercise = useCallback(() => {
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

  const renderFooter = () => {
    return (
      <SetFooter
        restSeconds={restTimerSeconds}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRestPress={() => onRestPress?.(exercise.id)}
        onUpdateRest={(seconds) => onUpdateRest?.(exercise.id, seconds)}
        repRange={exercise.repRange}
        onUpdateRepRange={(range) => onUpdateRepRange?.(exercise.id, range)}
        editMode={editMode}
      />
    );
  };

  // ── Render a set row with optional delete animation ───────

  const renderSetRow = (set, index) => {
    const deleteAnim = deleteAnims.current[set.id];

    // If this row is being deleted, wrap in animated container
    if (deleteAnim) {
      const deleteScale = deleteAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.85, 1],
      });

      return (
        <Animated.View
          key={set.id}
          style={{
            opacity: deleteAnim,
            transform: [{ scale: deleteScale }],
          }}
        >
          <SetRow
            index={index}
            set={set}
            unit={unit}
            displayWeight={displayWeight}
            toKg={toKg}
            weightFadeAnim={weightFadeAnim}
            justCompleted={justCompletedSetId === set.id}
            editMode={editMode}
            onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
            onDelete={() => {}}
          />
        </Animated.View>
      );
    }

    return (
      <SetRow
        key={set.id}
        index={index}
        set={set}
        unit={unit}
        displayWeight={displayWeight}
        toKg={toKg}
        weightFadeAnim={weightFadeAnim}
        justCompleted={justCompletedSetId === set.id}
        isNew={newSetIds.has(set.id)}
        editMode={editMode}
        onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
        onDelete={() => handleDeleteSet(set.id)}
      />
    );
  };

  // ── Current View ──────────────────────────────────────────

  const renderCurrentView = () => (
    <>
      <SetHeader />

      <ExerciseNote
        note={exercise.note}
        editMode={editMode}
        onUpdateNote={(text) => onUpdateNote?.(exercise.id, text)}
      />

      {exercise.sets.map((set, index) => renderSetRow(set, index))}

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
              onUpdateNextSet={(field, value) => {
                const converted = field === 'weight' && value != null ? toKg(value) : value;
                onUpdateNextSet?.(exercise.id, nextSet.id, field, converted);
              }}
            />
          );
        })}

        {renderFooter()}
      </>
    );
  };

  // ── Render ────────────────────────────────────────────────

  const cardContent = (
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
            <Feather name="x" size={SIZE.iconXxs} color={COLORS.error} />
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

  return cardContent;
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
    borderBottomWidth: SIZE.borderAccent,
    borderBottomColor: COLORS.mediumGray,
    paddingBottom: SPACING.xxs,
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
    minWidth: SIZE.viewSelectorWidth,
  },

  deleteExerciseBtn: {
    width: SIZE.deleteBtnOuter,
    height: SIZE.deleteBtnOuter,
    borderRadius: (SIZE.deleteBtnOuter) / 2,
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
    borderWidth: SIZE.borderAccent,
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
    paddingVertical: SPACING.smm,
    borderRadius: RADIUS.md,
    borderWidth: SIZE.borderAccent,
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