/**
 * ExerciseRow Component
 * 
 * @module components/ExerciseRow
 * @description Displays a single exercise with interactive set controls.
 * Features:
 *   - Tap ▲ to increment reps
 *   - Tap ▼ to decrement reps
 *   - Long press badge to manually edit value
 *   - Tap + to add new set
 *   - Tap - to remove last set
 * 
 * Props:
 *   - exercise: Object with { id, name, sets, notes }
 *   - onUpdateSet: Function(setIndex, newValue) - Update specific set
 *   - onAddSet: Function(value) - Add new set
 *   - onRemoveSet: Function() - Remove last set
 * 
 * @version 2.2.0
 */

import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Keyboard,
} from 'react-native';

// Import design system
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

/**
 * EditSetModal Component - Cross-platform modal for editing set value
 */
function EditSetModal({ visible, currentValue, onSave, onCancel }) {
  const [value, setValue] = useState(currentValue.toString());
  
  const handleSave = () => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
      Keyboard.dismiss();
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Reps</Text>
          
          <TextInput
            style={styles.modalInput}
            value={value}
            onChangeText={setValue}
            keyboardType="number-pad"
            autoFocus={true}
            selectTextOnFocus={true}
            onSubmitEditing={handleSave}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSave]}
              onPress={handleSave}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/**
 * SetControl Component - Individual set with increment/decrement arrows
 */
function SetControl({ value, onIncrement, onDecrement, onLongPress }) {
  return (
    <View style={styles.setControl}>
      {/* Increment Arrow */}
      <TouchableOpacity 
        style={styles.arrowButton}
        onPress={onIncrement}
        activeOpacity={0.6}
      >
        <Text style={styles.arrowText}>▲</Text>
      </TouchableOpacity>
      
      {/* Set Badge */}
      <TouchableOpacity 
        style={styles.badge}
        onLongPress={onLongPress}
        activeOpacity={0.8}
        delayLongPress={500}
      >
        <Text style={styles.badgeText}>{value}</Text>
      </TouchableOpacity>
      
      {/* Decrement Arrow */}
      <TouchableOpacity 
        style={styles.arrowButton}
        onPress={onDecrement}
        activeOpacity={0.6}
      >
        <Text style={styles.arrowText}>▼</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * AddRemoveButtons Component - Vertical add/remove set buttons
 */
function AddRemoveButtons({ onAdd, onRemove, canRemove }) {
  return (
    <View style={styles.addRemoveContainer}>
      {/* Add Set Button */}
      <TouchableOpacity 
        style={styles.addRemoveButton}
        onPress={onAdd}
        activeOpacity={0.7}
      >
        <Text style={styles.addRemoveButtonText}>+</Text>
      </TouchableOpacity>
      
      {/* Remove Set Button */}
      <TouchableOpacity 
        style={[
          styles.addRemoveButton,
          !canRemove && styles.addRemoveButtonDisabled
        ]}
        onPress={onRemove}
        activeOpacity={0.7}
        disabled={!canRemove}
      >
        <Text style={[
          styles.addRemoveButtonText,
          !canRemove && styles.addRemoveButtonTextDisabled
        ]}>
          −
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * ExerciseRow Component
 */
function ExerciseRow({ exercise, onUpdateSet, onAddSet, onRemoveSet }) {
  const [editingSetIndex, setEditingSetIndex] = useState(null);

  const handleIncrement = (setIndex) => {
    const currentValue = exercise.sets[setIndex];
    onUpdateSet(setIndex, currentValue + 1);
  };
  
  const handleDecrement = (setIndex) => {
    const currentValue = exercise.sets[setIndex];
    if (currentValue > 1) {
      onUpdateSet(setIndex, currentValue - 1);
    }
  };
  
  const handleLongPress = (setIndex) => {
    setEditingSetIndex(setIndex);
  };
  
  const handleSaveEdit = (newValue) => {
    if (editingSetIndex !== null) {
      onUpdateSet(editingSetIndex, newValue);
      setEditingSetIndex(null);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingSetIndex(null);
  };
  
  const handleAddSet = () => {
    const lastSetValue = exercise.sets.length > 0 
      ? exercise.sets[exercise.sets.length - 1] 
      : 10;
    
    onAddSet(lastSetValue);
  };
  
  const handleRemoveSet = () => {
    if (exercise.sets.length > 0) {
      onRemoveSet();
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Exercise Name */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      
      {/* Sets Row */}
    <View style={styles.setsContainer}>
    {/* Existing Sets with Controls */}
    {exercise.sets.map((reps, index) => (
        <SetControl
        key={index}
        value={reps}
        onIncrement={() => handleIncrement(index)}
        onDecrement={() => handleDecrement(index)}
        onLongPress={() => handleLongPress(index)}
        />
    ))}
    
    {/* Add/Remove Buttons */}
    <AddRemoveButtons 
        onAdd={handleAddSet}
        onRemove={handleRemoveSet}
        canRemove={exercise.sets.length > 0}
    />
    </View>
      
      {/* Edit Modal */}
      {editingSetIndex !== null && (
        <EditSetModal
          visible={true}
          currentValue={exercise.sets[editingSetIndex]}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </View>
  );
}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray100,
    padding: spacing.md,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  
  exerciseName: {
    ...typography.bodyBold,
    color: colors.black,
    marginBottom: spacing.sm,
  },
  
setsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: spacing.sm,
},
  
  setControl: {
    alignItems: 'center',
    gap: spacing.micro,
  },
  
  arrowButton: {
    width: 40,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray200,
    borderRadius: 4,
  },
  
  arrowText: {
    fontSize: 10,
    color: colors.gray700,
    fontWeight: '700',
  },
  
  badge: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xs,      
    paddingHorizontal: spacing.sm,    
    borderRadius: spacing.xs,
    borderWidth: 2,
    borderColor: colors.gray900,
    minWidth: 48,                      
    minHeight: 48,                     
    alignItems: 'center',
    justifyContent: 'center',
  },
  
badgeText: {
  ...typography.body,         
  color: colors.gray900,
  fontWeight: '700',
  fontSize: 18,              
},
  
// Add/Remove buttons container
addRemoveContainer: {
  gap: spacing.xs,
  alignItems: 'center',
  alignSelf: 'flex-end', 
},
  
  addRemoveButton: {
    backgroundColor: colors.gray300,
    width: 40,
    height: 40,
    borderRadius: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  addRemoveButtonDisabled: {
    backgroundColor: colors.gray200,
  },
  
  addRemoveButtonText: {
    fontSize: 24,
    color: colors.gray700,
    fontWeight: '700',
  },
  
  addRemoveButtonTextDisabled: {
    color: colors.gray500,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
    padding: spacing.lg,
    width: '80%',
    maxWidth: 300,
  },
  
  modalTitle: {
    ...typography.h3,
    color: colors.gray900,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  
  modalInput: {
    ...typography.h2,
    color: colors.gray900,
    borderWidth: 2,
    borderColor: colors.gray900,
    borderRadius: spacing.xs,
    padding: spacing.md,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.xs,
    alignItems: 'center',
  },
  
  modalButtonCancel: {
    backgroundColor: colors.gray200,
  },
  
  modalButtonSave: {
    backgroundColor: colors.gray900,
  },
  
  modalButtonText: {
    ...typography.bodyBold,
    color: colors.gray900,
  },
  
  modalButtonTextSave: {
    color: colors.white,
  },
});

export default ExerciseRow;