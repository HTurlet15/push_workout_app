/**
 * App.js - Version 0.1.0 (Minimal)
 */

import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

import { workouts } from './src/data/workouts';
import WorkoutScreen from './src/components/WorkoutScreen';
import colors from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        <PagerView style={styles.pagerView} initialPage={0}>
          {workouts.map((workout) => (
            <View key={workout.id} style={styles.page}>
              <WorkoutScreen workout={workout} />
            </View>
          ))}
        </PagerView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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