import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkoutScreen from './src/screens/WorkoutScreen';

/**
 * Application root.
 * SafeAreaProvider enables safe area detection across all child screens.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <WorkoutScreen />
    </SafeAreaProvider>
  );
}