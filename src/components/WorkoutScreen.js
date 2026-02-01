/**
 * WorkoutScreen Component
 * 
 * @module components/WorkoutScreen
 * @description Displays a single workout session with exercises.
 * This component represents one "page" in the workout carousel.
 * 
 * Props:
 *   - workout: Object with { id, name, lastCompleted, exercises }
 * 
 * Usage:
 *   <WorkoutScreen workout={workouts[0]} />
 * 
 * @version 1.0.0
 */

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

// Import design system
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

// Import utilities
import { formatWorkoutDate } from '../utils/dateUtils';

/**
 * WorkoutScreen Component
 */
function WorkoutScreen({ workout }) {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.subtitle}>
          Last: {formatWorkoutDate(workout.lastCompleted)}
        </Text>
      </View>
      
      {/* Exercises List */}
      <View style={styles.exercisesList}>
        {workout.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseSets}>
              {exercise.sets.join(' × ')} reps
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
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
  
  exercisesList: {
    gap: spacing.md,
  },
  
  exerciseCard: {
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
  
  exerciseSets: {
    ...typography.caption,
    color: colors.gray700,
  },
});

export default WorkoutScreen;