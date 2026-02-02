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

// Import design system
import colors from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <PagerView 
          style={styles.pagerView} 
          initialPage={0}
        >
          {workouts.map((workout) => (
            <View key={workout.id} collapsable={false} style={styles.page}>
              <WorkoutScreen workout={workout} />
            </View>
          ))}
        </PagerView>
        
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