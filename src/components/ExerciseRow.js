/**
 * ExerciseRow Component (Strong-inspired design)
 * 
 * @module components/ExerciseRow
 * @description Table-based exercise tracking with Previous, Weight, Reps columns.
 * Inspired by Strong app's clean, efficient UX.
 * 
 * Features:
 *   - Tap on Previous to auto-fill weight and reps
 *   - Tap on kg/reps to edit with keyboard
 *   - Long press on kg for +2.5kg increment
 *   - Long press on reps for +1 increment
 *   - Tap checkbox to mark set as completed
 *   - Add/Remove set buttons in edit mode
 * 
 * @version 3.0.0
 */

import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
} from 'react-native';

// Import design system
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

/**
 * SetRow Component - Single set row in the table
 */
function SetRow({ 
  setNumber, 
  set, 
  onUpdateWeight, 
  onUpdateReps, 
  onToggleComplete,
  onCopyPrevious 
}) {
  const [weightText, setWeightText] = useState(set.weight.toString());
  const [repsText, setRepsText] = useState(set.reps.toString());
  
  const handleWeightChange = (text) => {
    setWeightText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateWeight(parsed);
    }
  };
  
  const handleRepsChange = (text) => {
    setRepsText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateReps(parsed);
    }
  };
  
  const handleWeightLongPress = () => {
    const newWeight = set.weight + 2.5;
    setWeightText(newWeight.toString());
    onUpdateWeight(newWeight);
  };
  
  const handleRepsLongPress = () => {
    const newReps = set.reps + 1;
    setRepsText(newReps.toString());
    onUpdateReps(newReps);
  };
  
  const handleCopyPrevious = () => {
    if (set.previous) {
      setWeightText(set.previous.weight.toString());
      setRepsText(set.previous.reps.toString());
      onCopyPrevious(set.previous.weight, set.previous.reps);
    }
  };
  
  return (
    <View style={styles.setRow}>
      {/* Set Number */}
      <Text style={styles.setNumber}>{setNumber}</Text>
      
      {/* Previous */}
      <TouchableOpacity 
        style={styles.previousContainer}
        onPress={handleCopyPrevious}
        activeOpacity={0.7}
      >
        {set.previous ? (
          <Text style={styles.previousText}>
            {set.previous.weight}kg × {set.previous.reps}
          </Text>
        ) : (
          <Text style={styles.previousTextEmpty}>—</Text>
        )}
      </TouchableOpacity>
      
      {/* Weight Input */}
      <TextInput
        style={styles.input}
        value={weightText}
        onChangeText={handleWeightChange}
        keyboardType="decimal-pad"
        selectTextOnFocus={true}
        onLongPress={handleWeightLongPress}
      />
      
      {/* Reps Input */}
      <TextInput
        style={styles.input}
        value={repsText}
        onChangeText={handleRepsChange}
        keyboardType="number-pad"
        selectTextOnFocus={true}
        onLongPress={handleRepsLongPress}
      />
      
      {/* Checkbox */}
      <TouchableOpacity 
        style={styles.checkboxContainer}
        onPress={onToggleComplete}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox,
          set.completed && styles.checkboxChecked
        ]}>
          {set.completed && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

/**
 * ExerciseRow Component
 */
function ExerciseRow({ exercise, isEditing, onUpdateSet, onAddSet, onRemoveSet }) {
  
  const handleUpdateWeight = (setIndex, weight) => {
    onUpdateSet(setIndex, { ...exercise.sets[setIndex], weight });
  };
  
  const handleUpdateReps = (setIndex, reps) => {
    onUpdateSet(setIndex, { ...exercise.sets[setIndex], reps });
  };
  
  const handleToggleComplete = (setIndex) => {
    const set = exercise.sets[setIndex];
    onUpdateSet(setIndex, { ...set, completed: !set.completed });
  };
  
  const handleCopyPrevious = (setIndex, weight, reps) => {
    onUpdateSet(setIndex, { 
      ...exercise.sets[setIndex], 
      weight, 
      reps 
    });
  };
  
  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 20,
      completed: false,
      previous: lastSet?.previous || null,
    };
    onAddSet(newSet);
  };
  
  return (
    <View style={styles.container}>
      {/* Exercise Name */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Set</Text>
        <Text style={[styles.headerCell, styles.headerPrevious]}>Previous</Text>
        <Text style={styles.headerCell}>kg</Text>
        <Text style={styles.headerCell}>Reps</Text>
        <Text style={styles.headerCell}>✓</Text>
      </View>
      
      {/* Separator */}
      <View style={styles.separator} />
      
      {/* Set Rows */}
      {exercise.sets.map((set, index) => (
        <SetRow
          key={index}
          setNumber={index + 1}
          set={set}
          onUpdateWeight={(weight) => handleUpdateWeight(index, weight)}
          onUpdateReps={(reps) => handleUpdateReps(index, reps)}
          onToggleComplete={() => handleToggleComplete(index)}
          onCopyPrevious={(weight, reps) => handleCopyPrevious(index, weight, reps)}
        />
      ))}
      
      {/* Edit Mode Buttons */}
      {isEditing && (
        <View style={styles.editButtons}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleAddSet}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>+ Add Set</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.editButton, styles.editButtonRemove]}
            onPress={onRemoveSet}
            activeOpacity={0.7}
            disabled={exercise.sets.length === 0}
          >
            <Text style={[
              styles.editButtonText,
              exercise.sets.length === 0 && styles.editButtonTextDisabled
            ]}>
              − Remove Last
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  
  exerciseName: {
    ...typography.h3,
    color: colors.gray900,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  
  headerCell: {
    ...typography.small,
    color: colors.gray600,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  
  headerPrevious: {
    flex: 2,
    textAlign: 'left',
  },
  
  separator: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.xs,
  },
  
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  
  setNumber: {
    ...typography.body,
    color: colors.gray700,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  
  previousContainer: {
    flex: 2,
    paddingHorizontal: spacing.xs,
  },
  
  previousText: {
    ...typography.caption,
    color: colors.gray500,
    fontWeight: '500',
  },
  
  previousTextEmpty: {
    ...typography.caption,
    color: colors.gray300,
  },
  
  input: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.gray50,
  },
  
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  checkboxChecked: {
    backgroundColor: colors.gray900,
    borderColor: colors.gray900,
  },
  
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  
  editButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  
  editButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  
  editButtonRemove: {
    backgroundColor: colors.gray50,
  },
  
  editButtonText: {
    ...typography.bodyBold,
    color: colors.gray900,
    fontSize: 14,
  },
  
  editButtonTextDisabled: {
    color: colors.gray400,
  },
});

export default ExerciseRow;