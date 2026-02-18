import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import WorkoutScreen from './src/screens/WorkoutScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Italic': DMSans_400Regular_Italic,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
    'DMSans-Bold': DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <WorkoutScreen />
    </SafeAreaProvider>
  );
}