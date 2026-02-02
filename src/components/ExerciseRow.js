/**
 * ExerciseRow Component - Version 0.1.0 (Minimal)
 */

import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

function ExerciseRow({ exercise }) {
  return (
    <View style={styles.container}>
      {/* Exercise Name */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.cellSet]}>set</Text>
        <Text style={[styles.headerCell, styles.cellPrevious]}>previous</Text>
        <Text style={[styles.headerCell, styles.cellInput]}>kg</Text>
        <Text style={[styles.headerCell, styles.cellInput]}>reps</Text>
        <Text style={[styles.headerCell, styles.cellRir]}>rir</Text>
        <Text style={[styles.headerCell, styles.cellCheck]}>✓</Text>
      </View>
      
      {/* Separator */}
      <View style={styles.separator} />
      
      {/* Set Rows */}
      {exercise.sets.map((set, index) => (
        <View key={index} style={styles.setRow}>
          <Text style={[styles.cell, styles.cellSet]}>{index + 1}</Text>
          <Text style={[styles.cell, styles.cellPrevious]}>{set.previous}</Text>
          <TextInput 
            style={[styles.input, styles.cellInput]}
            defaultValue={set.kg.toString()}
            keyboardType="decimal-pad"
          />
          <TextInput 
            style={[styles.input, styles.cellInput]}
            defaultValue={set.reps.toString()}
            keyboardType="number-pad"
          />
          <TextInput 
            style={[styles.input, styles.cellRir]}
            defaultValue={set.rir.toString()}
            keyboardType="number-pad"
          />
          <Text style={[styles.cell, styles.cellCheck]}>→</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  
  exerciseName: {
    ...typography.body,
    color: colors.blue,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  separator: {
    height: 1,
    backgroundColor: colors.gray900,
    marginVertical: spacing.xs,
  },
  
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  
  headerCell: {
    ...typography.small,
    color: colors.gray900,
    fontWeight: '600',
  },
  
  cell: {
    ...typography.body,
    color: colors.gray900,
  },
  
  input: {
    ...typography.body,
    color: colors.gray900,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  
  cellSet: {
    width: 40,
    textAlign: 'center',
  },
  
  cellPrevious: {
    flex: 2,
  },
  
  cellInput: {
    flex: 1,
  },
  
  cellRir: {
    width: 50,
    textAlign: 'center',
  },
  
  cellCheck: {
    width: 40,
    textAlign: 'center',
  },
});

export default ExerciseRow;