/**
 * Push — Minimalist Workout Tracker
 * 
 * @description Main application entry point with horizontal workout carousel.
 * Users can swipe between workout sessions (Push, Pull, Legs, Arms/Shoulders).
 * 
 * @version 1.0.0
 */

import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

// Import data
import { workouts } from './src/data/workouts';

// Import components
import WorkoutScreen from './src/components/WorkoutScreen';
import ExerciseRow from './src/components/ExerciseRow';

// Import design system
import colors from './src/theme/colors';
import spacing from './src/theme/spacing';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Test ExerciseRow */}
        <View style={{ padding: spacing.lg }}>
          <ExerciseRow 
            exercise={{
              id: 101,
              name: 'Bench Press',
              sets: [12, 10, 8],
            }}
            onUpdateSet={(index, value) => {
              console.log(`Update set ${index} to ${value}`);
            }}
            onAddSet={(value) => {
              console.log(`Add new set with value ${value}`);
            }}
          />
        </View>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  pagerView: {
    flex: 1,
  },
  
  page: {
    flex: 1,
  },
});