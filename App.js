import { useState } from 'react';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CopilotProvider } from 'react-native-copilot';
import { ActivityIndicator, View } from 'react-native';
import SplashScreen from './src/components/common/SplashScreen';
import TutorialTooltip from './src/components/common/TutorialTooltip';
import MainScreen from './src/screens/MainScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

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

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <CopilotProvider
      tooltipComponent={TutorialTooltip}
      stepNumberComponent={() => null}
      animated
      overlay="svg"
      backdropColor="rgba(0, 0, 0, 0.65)"
      verticalOffset={0}
      margin={8}
    >
      <SafeAreaProvider>
        <MainScreen />
      </SafeAreaProvider>
    </CopilotProvider>
  );
}