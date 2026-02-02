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

function WorkoutScreen({ workout, isEditing }) {
  const [exercises, setExercises] = useState(workout.exercises);
  
  const handleUpdateSet = (exerciseIndex, setIndex, newSetData) => {
  setExercises(prevExercises => {
    const updatedExercises = prevExercises.map((exercise, idx) => {
      if (idx === exerciseIndex) {
        return {
          ...exercise,
          sets: exercise.sets.map((set, sIdx) => 
            sIdx === setIndex ? newSetData : set
          )
        };
      }
      return exercise;
    });
    
    return updatedExercises;
  });
};

const handleAddSet = (exerciseIndex, newSet) => {
  setExercises(prevExercises => {
    const updatedExercises = prevExercises.map((exercise, idx) => {
      if (idx === exerciseIndex) {
        return {
          ...exercise,
          sets: [...exercise.sets, newSet]
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
      {/* Header Section */}
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
            isEditing={isEditing}
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
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  
  title: {
    ...typography.display,
    color: colors.gray900,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  
  subtitle: {
    ...typography.caption,
    color: colors.gray600,
    textAlign: 'center',
  },
  
  exercisesList: {
    gap: spacing.md,
  },
});

export default WorkoutScreen;