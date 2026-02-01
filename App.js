/**
 * Push — Minimalist Workout Tracker
 * 
 * @description Main application entry point.
 * Showcases the design system with a sample workout screen.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import design system
import colors from './src/theme/colors';
import spacing from './src/theme/spacing';
import typography from './src/theme/typography';

import { formatWorkoutDate, getRelativeTime } from './src/utils/dateUtils';

console.log('Test formatWorkoutDate:', formatWorkoutDate('2025-01-28')); // Jan 28
console.log('Test null:', formatWorkoutDate(null)); // Never
console.log('Test relative:', getRelativeTime('2025-01-30')); // 2 days ago

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>PUSH WORKOUT</Text>
          <Text style={styles.subtitle}>Last: Jan 28</Text>
        </View>
        
        {/* Exercise Card */}
        <View style={styles.card}>
          <Text style={styles.exerciseName}>Bench Press</Text>
          <Text style={styles.exerciseDetail}>4 × 12 reps</Text>
        </View>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/**
 * Stylesheet using design system tokens
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
  },
  
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  
  title: {
    ...typography.h1,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    ...typography.caption,
    color: colors.gray600,
  },
  
  card: {
    backgroundColor: colors.gray100,
    padding: spacing.md,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  
  exerciseName: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.micro,
  },
  
  exerciseDetail: {
    ...typography.caption,
    color: colors.gray700,
  },
});