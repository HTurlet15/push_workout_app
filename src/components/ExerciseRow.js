/**
 * ExerciseRow Component with Right-Side Swipeable Planning
 * 
 * @module components/ExerciseRow
 * @description Table-based exercise tracking with slide-right planning reveal.
 * 
 * Features:
 *   - Tap → to reveal "Planned Next" (slides from right)
 *   - Previous slides out left, kg/Reps/RIR shift left
 *   - Edit planned kg/reps for next session
 *   - Tap ← to save and return
 *   - Header changes dynamically
 * 
 * @version 5.0.0
 */

import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  Animated,
} from 'react-native';

// Import design system
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

/**
 * SetRow Component with Right-Reveal Planning
 */
function SetRow({ 
  setNumber, 
  set, 
  isPlanning,
  onUpdateWeight, 
  onUpdateReps, 
  onUpdateRir,
  onValidate,
  onOpenPlanning,
  onClosePlanning,
}) {
  const [slideAnim] = useState(new Animated.Value(0));
  
  // Local state for inputs
  const [weightText, setWeightText] = useState((set.weight || 0).toString());
  const [repsText, setRepsText] = useState((set.reps || 0).toString());
  const [rirText, setRirText] = useState((set.rir || '').toString());
  
  // Local state for planned values
  const [plannedWeight, setPlannedWeight] = useState(
    (set.plannedWeight || set.weight || 0).toString()
  );
  const [plannedReps, setPlannedReps] = useState(
    (set.plannedReps || set.reps || 0).toString()
  );
  
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isPlanning ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isPlanning]);
  
  const handleWeightChange = (text) => {
    setWeightText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateWeight(parsed);
    }
  };
  
  const handleRepsChange = (text) => {
    setRepsText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateReps(parsed);
    }
  };
  
  const handleRirChange = (text) => {
    setRirText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateRir(parsed);
    }
  };
  
  const handleSavePlanning = () => {
    const parsedWeight = parseFloat(plannedWeight);
    const parsedReps = parseInt(plannedReps, 10);
    
    if (!isNaN(parsedWeight) && !isNaN(parsedReps)) {
      onClosePlanning(parsedWeight, parsedReps);
    }
  };
  
  // Interpolations
  const previousOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  
  const previousTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100], // Slide out left
  });
  
  const mainInputsTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80], // Shift left to fill Previous space
  });
  
  const plannedWidth = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180], // Width of Planned section
  });
  
  const plannedOpacity = slideAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  // Get status icon
  const getStatusIcon = () => {
    if (set.planned) return '✓';
    if (set.completed) return '→';
    return '○';
  };
  
  const getStatusColor = () => {
    if (set.planned) return colors.green;
    if (set.completed) return colors.gray700;
    return colors.gray400;
  };
  
  return (
    <View style={styles.setRowContainer}>
      {/* Set Number (Static) */}
      <View style={styles.setNumberContainer}>
        <Text style={styles.setNumber}>{setNumber}</Text>
      </View>
      
      {/* Previous (Slides out left) */}
      {!isPlanning && (
        <Animated.View 
          style={[
            styles.previousContainer,
            {
              opacity: previousOpacity,
              transform: [{ translateX: previousTranslateX }],
            }
          ]}
        >
          {set.previousWeight && set.previousReps ? (
            <>
              <Text style={styles.previousText}>
                {set.previousWeight}kg × {set.previousReps}
              </Text>
              {set.previousRir !== null && set.previousRir !== undefined && (
                <Text style={styles.previousRir}>RIR {set.previousRir}</Text>
              )}
            </>
          ) : (
            <Text style={styles.previousTextEmpty}>—</Text>
          )}
        </Animated.View>
      )}
      
      {/* Main Inputs (Shift left) */}
      <Animated.View 
        style={[
          styles.mainInputsContainer,
          { transform: [{ translateX: mainInputsTranslateX }] }
        ]}
      >
        <TextInput
          style={[styles.input, set.isPlanned && styles.inputPlanned]}
          value={weightText}
          onChangeText={handleWeightChange}
          keyboardType="decimal-pad"
          selectTextOnFocus={true}
          editable={!set.completed}
        />
        
        <TextInput
          style={[styles.input, set.isPlanned && styles.inputPlanned]}
          value={repsText}
          onChangeText={handleRepsChange}
          keyboardType="number-pad"
          selectTextOnFocus={true}
          editable={!set.completed}
        />
        
        <TextInput
          style={styles.inputSmall}
          value={rirText}
          onChangeText={handleRirChange}
          keyboardType="number-pad"
          selectTextOnFocus={true}
          placeholder="—"
          placeholderTextColor={colors.gray300}
          editable={!set.completed}
        />
      </Animated.View>
      
      {/* Planned Next (Slides in from right) */}
      <Animated.View 
        style={[
          styles.plannedContainer,
          {
            width: plannedWidth,
            opacity: plannedOpacity,
          }
        ]}
      >
        <TextInput
          style={styles.inputPlanning}
          value={plannedWeight}
          onChangeText={setPlannedWeight}
          keyboardType="decimal-pad"
          selectTextOnFocus={true}
          placeholder="kg"
          placeholderTextColor={colors.gray500}
        />
        
        <TextInput
          style={styles.inputPlanning}
          value={plannedReps}
          onChangeText={setPlannedReps}
          keyboardType="number-pad"
          selectTextOnFocus={true}
          placeholder="reps"
          placeholderTextColor={colors.gray500}
        />
      </Animated.View>
      
      {/* Status Button */}
      <TouchableOpacity 
        style={styles.statusButton}
        onPress={
          isPlanning 
            ? handleSavePlanning 
            : (set.completed ? onOpenPlanning : onValidate)
        }
        activeOpacity={0.7}
      >
        <Text style={[styles.statusIcon, { color: getStatusColor() }]}>
          {isPlanning ? '←' : getStatusIcon()}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * ExerciseRow Component
 */
function ExerciseRow({ exercise, isEditing, onUpdateSet, onAddSet, onRemoveSet }) {
  const [planningSetIndex, setPlanningSetIndex] = useState(null);
  
  const handleUpdateWeight = (setIndex, weight) => {
    onUpdateSet(setIndex, { ...exercise.sets[setIndex], weight });
  };
  
  const handleUpdateReps = (setIndex, reps) => {
    onUpdateSet(setIndex, { ...exercise.sets[setIndex], reps });
  };
  
  const handleUpdateRir = (setIndex, rir) => {
    onUpdateSet(setIndex, { ...exercise.sets[setIndex], rir });
  };
  
  const handleValidate = (setIndex) => {
    onUpdateSet(setIndex, { 
      ...exercise.sets[setIndex], 
      completed: true 
    });
  };
  
  const handleOpenPlanning = (setIndex) => {
    setPlanningSetIndex(setIndex);
  };
  
  const handleClosePlanning = (setIndex, weight, reps) => {
    onUpdateSet(setIndex, { 
      ...exercise.sets[setIndex], 
      plannedWeight: weight,
      plannedReps: reps,
      planned: true,
    });
    setPlanningSetIndex(null);
  };
  
  const handleAddSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 20,
      rir: null,
      completed: false,
      planned: false,
      previousWeight: lastSet?.previousWeight || null,
      previousReps: lastSet?.previousReps || null,
      previousRir: lastSet?.previousRir || null,
      isPlanned: false,
    };
    onAddSet(newSet);
  };
  
  // Check if any set is in planning mode
  const isAnyPlanning = planningSetIndex !== null;
  
  return (
    <View style={styles.container}>
      {/* Exercise Name */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      
      {/* Table Header (Dynamic) */}
      <View style={styles.headerRow}>
        <Text style={styles.headerSet}>Set</Text>
        {!isAnyPlanning && (
          <Text style={styles.headerPrevious}>Previous</Text>
        )}
        <Text style={styles.headerCell}>kg</Text>
        <Text style={styles.headerCell}>Reps</Text>
        <Text style={styles.headerCellSmall}>RIR</Text>
        {isAnyPlanning && (
          <Text style={styles.headerPlanned}>Planned Next</Text>
        )}
        <Text style={styles.headerCellSmall}>{isAnyPlanning ? '←' : '✓'}</Text>
      </View>
      
      {/* Separator */}
      <View style={styles.separator} />
      
      {/* Set Rows */}
      {exercise.sets.map((set, index) => (
        <SetRow
          key={index}
          setNumber={index + 1}
          set={set}
          isPlanning={planningSetIndex === index}
          onUpdateWeight={(weight) => handleUpdateWeight(index, weight)}
          onUpdateReps={(reps) => handleUpdateReps(index, reps)}
          onUpdateRir={(rir) => handleUpdateRir(index, rir)}
          onValidate={() => handleValidate(index)}
          onOpenPlanning={() => handleOpenPlanning(index)}
          onClosePlanning={(weight, reps) => handleClosePlanning(index, weight, reps)}
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
  
  headerSet: {
    ...typography.small,
    color: colors.gray600,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  
  headerPrevious: {
    ...typography.small,
    color: colors.gray600,
    fontWeight: '600',
    flex: 2,
  },
  
  headerCell: {
    ...typography.small,
    color: colors.gray600,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  
  headerCellSmall: {
    ...typography.small,
    color: colors.gray600,
    fontWeight: '600',
    width: 50,
    textAlign: 'center',
  },
  
  headerPlanned: {
    ...typography.small,
    color: colors.gray600,
    fontWeight: '600',
    width: 180,
    textAlign: 'center',
  },
  
  separator: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.xs,
  },
  
  setRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    minHeight: 60,
    overflow: 'hidden',
  },
  
  setNumberContainer: {
    width: 40,
    alignItems: 'center',
  },
  
  setNumber: {
    ...typography.body,
    color: colors.gray700,
    fontWeight: '600',
  },
  
  previousContainer: {
    flex: 2,
    paddingRight: spacing.xs,
  },
  
  previousText: {
    ...typography.caption,
    color: colors.gray600,
    fontWeight: '500',
  },
  
  previousRir: {
    ...typography.small,
    color: colors.gray400,
    marginTop: 2,
  },
  
  previousTextEmpty: {
    ...typography.caption,
    color: colors.gray300,
  },
  
  mainInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  input: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    width: 60,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
    backgroundColor: 'transparent',
  },
  
  inputPlanned: {
    backgroundColor: colors.gray100,
    color: colors.gray600,
  },
  
  inputSmall: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    width: 50,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  
  plannedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.gray300,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    overflow: 'hidden',
  },
  
  inputPlanning: {
    ...typography.body,
    color: colors.gray900,
    fontWeight: '600',
    width: 60,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.gray400,
  },
  
  statusButton: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statusIcon: {
    fontSize: 20,
    fontWeight: '700',
  },
  
  // Edit buttons
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