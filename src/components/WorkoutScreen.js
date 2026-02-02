/**
 * WorkoutScreen Component
 * 
 * @module components/WorkoutScreen
 * @description Displays a single workout session with interactive exercises.
 * Manages local state for exercise sets.
 * 
 * @version 2.1.0
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

// Import design system
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

// Import utilities
import { formatWorkoutDate } from '../utils/dateUtils';

// Import components
import ExerciseRow from './ExerciseRow';

function WorkoutScreen({ workout }) {
  const [exercises, setExercises] = useState(workout.exercises);
  
  const handleUpdateSet = (exerciseIndex, setIndex, newValue) => {
    setExercises(prevExercises => {
      const updatedExercises = prevExercises.map((exercise, idx) => {
        if (idx === exerciseIndex) {
          return {
            ...exercise,
            sets: exercise.sets.map((reps, sIdx) => 
              sIdx === setIndex ? newValue : reps
            )
          };
        }
        return exercise;
      });
      
      return updatedExercises;
    });
  };
  
  const handleAddSet = (exerciseIndex, value) => {
    setExercises(prevExercises => {
      const updatedExercises = prevExercises.map((exercise, idx) => {
        if (idx === exerciseIndex) {
          return {
            ...exercise,
            sets: [...exercise.sets, value]
          };
        }
        return exercise;
      });
      
      return updatedExercises;
    });
  };
  
  const handleRemoveSet = (exerciseIndex) => {
    setExercises(prevExercises => {
      const updatedExercises = prevExercises.map((exercise, idx) => {
        if (idx === exerciseIndex) {
          return {
            ...exercise,
            sets: exercise.sets.slice(0, -1)
          };
        }
        return exercise;
      });
      
      return updatedExercises;
    });
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.subtitle}>
          Last: {formatWorkoutDate(workout.lastCompleted)}
        </Text>
      </View>
      
      <View style={styles.exercisesList}>
        {exercises.map((exercise, index) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={(setIndex, newValue) => 
              handleUpdateSet(index, setIndex, newValue)
            }
            onAddSet={(value) => 
              handleAddSet(index, value)
            }
            onRemoveSet={() => 
              handleRemoveSet(index)
            }
          />
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
});

export default WorkoutScreen;