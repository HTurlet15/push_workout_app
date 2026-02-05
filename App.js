import { View, StyleSheet } from 'react-native';
import Text from './src/components/Text';
import { COLORS, SPACING } from './src/theme/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text variant="hero">PECTORAUX</Text>
      <Text variant="caption" style={{ marginTop: SPACING.sm }}>
        Last: 4 days ago
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});