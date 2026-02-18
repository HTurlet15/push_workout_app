import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import ViewSelector from './ViewSelector';
import SetHeader from './SetHeader';
import NextSetHeader from './NextSetHeader';
import SetFooter from './SetFooter';
import SetRow from './SetRow';
import PreviousSetRow from './PreviousSetRow';
import NextSetRow from './NextSetRow';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

const VIEW_BORDER_COLORS = {
  previous: COLORS.viewPrevious,
  current: COLORS.viewCurrent,
  next: COLORS.viewNext,
};

export default function ExerciseCard({ exercise, previousExercise, nextExercise, onUpdateSet, onUpdateNextSet }) {
  const [activeView, setActiveView] = useState('current');

  const renderCurrentView = () => (
    <>
      <SetHeader />

      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          index={index}
          set={set}
          onUpdateSet={(field, value) => onUpdateSet?.(exercise.id, set.id, field, value)}
        />
      ))}

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
        <SetHeader />

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
        <ViewSelector activeView={activeView} onChangeView={setActiveView} />
      </View>

      <View style={[
        styles.tableCard,
        { borderLeftColor: VIEW_BORDER_COLORS[activeView] },
      ]}>
        {activeView === 'current' && renderCurrentView()}
        {activeView === 'previous' && renderPreviousView()}
        {activeView === 'next' && renderNextView()}
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
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  exerciseName: {
    color: COLORS.mediumBlue,
  },
  emptyMessage: {
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
});