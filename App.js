import { View, StyleSheet } from 'react-native';
import Text from './src/components/Text';
import SetRow from './src/components/SetRow';
import { COLORS, SPACING } from './src/theme/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text variant="headline" style={{ marginBottom: SPACING.lg }}>
        Bench Press
      </Text>

      <SetRow index={0} weight={120.5} reps={5} rir={2} completed={true} />
      <SetRow index={1} weight={120.5} reps={3} rir={1} completed={false} />
      <SetRow index={2} weight={120.5} reps={1} rir={0} completed={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
});