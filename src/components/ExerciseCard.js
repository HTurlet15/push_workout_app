import { View, Animated, Pressable, TextInput, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
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
import useSlideTransition from '../hooks/useSlideTransition';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

const VIEW_BORDER_COLORS = {
  previous: COLORS.viewPrevious,
  current: COLORS.viewCurrent,
  next: COLORS.viewNext,
};

export default function ExerciseCard({ exercise, previousExercise, nextExercise, onUpdateSet, onUpdateNextSet, onDeleteSet, onAddSet, onUpdateNote, editMode = false }) {
  const { width } = useWindowDimensions();
  const { displayedView, slideAnim, transitionTo } = useSlideTransition('current');
  const [editingNote, setEditingNote] = useState(false);
  const translateX = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-width * 0.3, 0, width * 0.3],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 1, 0],
  });

  const renderCurrentView = () => (
    <>
      <SetHeader />

      {/* Note display in normal mode */}
      {!editMode && exercise.note && (
        <View style={styles.noteStrip}>
          <Text variant="caption" style={styles.noteText}>{exercise.note}</Text>
        </View>
      )}

      {/* Note editor in edit mode */}
      {editMode && (
        editingNote || exercise.note ? (
          <View style={styles.noteEditStrip}>
            <TextInput
              style={styles.noteInput}
              value={exercise.note || ''}
              onChangeText={(text) => onUpdateNote?.(exercise.id, text)}
              placeholder="Write a note..."
              placeholderTextColor={COLORS.mediumGray}
              returnKeyType="done"
              onSubmitEditing={() => setEditingNote(false)}
              onBlur={() => setEditingNote(false)}
            />
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.addNoteBtn, pressed && styles.addNoteBtnPressed]}
            onPress={() => setEditingNote(true)}
          >
            <Feather name="edit-2" size={12} color="#BDA200" />
            <Text variant="caption" style={styles.addNoteText}>add note...</Text>
          </Pressable>
        )
      )}

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

      {editMode && (
        <Pressable
          style={({ pressed }) => [styles.addSetBtn, pressed && styles.addSetBtnPressed]}
          onPress={() => onAddSet?.(exercise.id)}
        >
          <Feather name="plus" size={12} color={COLORS.textSecondary} />
          <Text variant="caption" style={styles.addSetText}>Add set</Text>
        </Pressable>
      )}

      <SetFooter />
    </>
  );

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

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text variant="title" style={styles.exerciseName}>
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 3,
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
  fontWeight: '600',
},noteStrip: {
  backgroundColor: '#FFFDE7',
  borderLeftWidth: 3,
  borderLeftColor: '#FDD835',
  paddingVertical: SPACING.sm,
  paddingHorizontal: SPACING.sm + SPACING.xs,
},
noteText: {
  color: '#8D6E00',
  fontStyle: 'italic',
},
noteEditStrip: {
  backgroundColor: '#FFFDE7',
  borderLeftWidth: 3,
  borderLeftColor: '#FDD835',
  paddingVertical: SPACING.xs,
  paddingHorizontal: SPACING.sm,
},
noteInput: {
  fontSize: 12,
  color: '#8D6E00',
  fontStyle: 'italic',
  paddingVertical: SPACING.xs,
  minHeight: 32,
},
addNoteBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: SPACING.xs,
  backgroundColor: '#FFFDE7',
  borderLeftWidth: 3,
  borderLeftColor: '#FDD835',
  paddingVertical: SPACING.sm,
  paddingHorizontal: SPACING.sm + SPACING.xs,
},
addNoteBtnPressed: {
  backgroundColor: '#FFF9C4',
},
addNoteText: {
  color: '#BDA200',
  fontStyle: 'italic',
},
});