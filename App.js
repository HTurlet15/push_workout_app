import './src/i18n/i18n';
import { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataProvider } from './src/context/DataContext';
import SplashScreen from './src/components/common/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainScreen from './src/screens/MainScreen';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/theme/theme';

const ONBOARDING_KEY = '@push_onboarding_done';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(null);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  const [fontsLoaded] = useFonts({
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Italic': DMSans_400Regular_Italic,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-SemiBold': DMSans_600SemiBold,
    'DMSans-Bold': DMSans_700Bold,
  });

  useEffect(() => {
    const check = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setOnboardingDone(value === 'true');
      } catch {
        setOnboardingDone(false);
      }
      setOnboardingChecked(true);
    };
    check();
  }, []);

  const handleOnboardingFinish = async (lang) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(ONBOARDING_KEY, 'true'),
        lang ? AsyncStorage.setItem('@push_language', lang) : Promise.resolve(),
      ]);
    } catch {}
    setOnboardingDone(true);
  };

  if (!fontsLoaded || !onboardingChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.viewCurrent} />
      </View>
    );
  }

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (!onboardingDone) {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <DataProvider>
        <MainScreen />
      </DataProvider>
    </SafeAreaProvider>
  );
}