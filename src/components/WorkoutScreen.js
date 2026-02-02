/**
 * WorkoutScreen Component - Version 0.1.0 (Minimal)
 */

import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ExerciseRow from './ExerciseRow';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

function WorkoutScreen({ workout }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.date}>{workout.date}</Text>
      </View>
      
      <View style={styles.separator} />
      
      {/* Exercises */}
      <View style={styles.exercises}>
        {workout.exercises.map((exercise) => (
          <ExerciseRow key={exercise.id} exercise={exercise} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  
  title: {
    ...typography.display,
    color: colors.gray900,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  
  date: {
    ...typography.body,
    color: colors.gray900,
    fontStyle: 'italic',
  },
  
  separator: {
    height: 1,
    backgroundColor: colors.gray900,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  
  exercises: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
});

export default WorkoutScreen;