import { View, StyleSheet } from 'react-native';
import Text from './Text';
import SetInput from './SetInput';
import { COLORS, SPACING, RADIUS } from '../theme/theme';

export default function SetRow({ index, set, onUpdateSet }) {
  const isCompleted =
    set.weight.state === 'filled' && set.reps.state === 'filled';

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <Text variant="body" style={[styles.setCell, isCompleted && styles.completedSetNum]}>
        {index + 1}
      </Text>

      <View style={styles.weightCell}>
        <SetInput
          value={set.weight.value}
          unit="kg"
          state={set.weight.state}
          onChangeValue={(val) => onUpdateSet?.('weight', val)}
          completed={isCompleted}
        />
      </View>

      <View style={styles.repsCell}>
        <SetInput
          value={set.reps.value}
          state={set.reps.state}
          onChangeValue={(val) => onUpdateSet?.('reps', val)}
          completed={isCompleted}
        />
      </View>

      <View style={styles.rirCell}>
        <SetInput
          value={set.rir.value}
          state={set.rir.state}
          onChangeValue={(val) => onUpdateSet?.('rir', val)}
          completed={isCompleted}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  completedContainer: {
    backgroundColor: COLORS.successLight,
  },
  setCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  completedSetNum: {
    color: COLORS.timerDone,
  },
  weightCell: {
    flex: 3,
  },
  repsCell: {
    flex: 2,
  },
  rirCell: {
    flex: 2,
  },
});