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

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>SÉANCE PECTORAUX</Text>
          <Text style={styles.subtitle}>Dernière: 28 janvier</Text>
        </View>
        
        {/* Exercise Card */}
        <View style={styles.card}>
          <Text style={styles.exerciseName}>Développé Couché</Text>
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