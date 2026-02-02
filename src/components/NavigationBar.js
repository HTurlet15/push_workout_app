/**
 * NavigationBar Component
 * 
 * @module components/NavigationBar
 * @description Fixed top navigation bar with workout name, page indicators, and edit button.
 * Inspired by Wealthsimple's navigation pattern.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Import design system
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

// Import workout data for names
import { workouts } from '../data/workouts';

/**
 * Page Indicator Dots
 */
function PageIndicators({ currentIndex, totalPages }) {
  return (
    <View style={styles.indicators}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

/**
 * NavigationBar Component
 */
function NavigationBar({ currentIndex, totalPages, isEditing, onToggleEdit }) {
  const currentWorkout = workouts[currentIndex];
  
  return (
    <View style={styles.container}>
      {/* Workout Name (Left) */}
      <Text style={styles.workoutName}>
        {currentWorkout.name}
      </Text>
      
      {/* Page Indicators (Center) */}
      <PageIndicators currentIndex={currentIndex} totalPages={totalPages} />
      
      {/* Edit Button (Right) */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={onToggleEdit}
        activeOpacity={0.6}
      >
        <Text style={styles.editIcon}>
          {isEditing ? 'Done' : '✎'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Stylesheet
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  
  workoutName: {
    ...typography.h3,
    color: colors.gray900,
    fontWeight: '600',
    flex: 1,
  },
  
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray300,
  },
  
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray900,
  },
  
  editButton: {
    flex: 1,
    alignItems: 'flex-end',
    paddingVertical: spacing.xs,
  },
  
  editIcon: {
    fontSize: 18,
    color: colors.gray700,
    fontWeight: '600',
  },
});

export default NavigationBar;