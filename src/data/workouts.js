/**
 * Workout Data
 * 
 * @module data/workouts
 * @description Hardcoded workout sessions for V1.
 * Each workout represents a training day with associated exercises.
 * 
 * Structure:
 *   - id: Unique identifier
 *   - name: Workout display name (uppercase for visual impact)
 *   - lastCompleted: ISO date string of last session (null if never done)
 *   - exercises: Array of exercise objects
 * 
 * Usage:
 *   import { workouts } from '../data/workouts';
 *   workouts.map(workout => <WorkoutScreen key={workout.id} data={workout} />)
 * 
 * @version 1.0.0
 */

/**
 * Master workout collection
 * 
 * @constant {Array<Object>} workouts
 */
export const workouts = [
  {
    id: 1,
    name: 'PUSH',
    lastCompleted: '2025-01-28', // ISO 8601 format
    exercises: [
      {
        id: 101,
        name: 'Bench Press',
        sets: [12, 10, 8], // Previous session reps
        notes: '',
      },
      {
        id: 102,
        name: 'Incline Dumbbell Press',
        sets: [12, 10, 8],
        notes: '',
      },
      {
        id: 103,
        name: 'Dumbbell Flyes',
        sets: [15, 12, 12],
        notes: '',
      },
      {
        id: 104,
        name: 'Tricep Dips',
        sets: [12, 10, 8],
        notes: '',
      },
    ],
  },
  
  {
    id: 2,
    name: 'PULL',
    lastCompleted: '2025-01-25',
    exercises: [
      {
        id: 201,
        name: 'Pull-Ups',
        sets: [10, 8, 6],
        notes: '',
      },
      {
        id: 202,
        name: 'Barbell Row',
        sets: [12, 10, 8],
        notes: '',
      },
      {
        id: 203,
        name: 'Lat Pulldown',
        sets: [12, 10, 10],
        notes: '',
      },
      {
        id: 204,
        name: 'Barbell Curl',
        sets: [12, 10, 8],
        notes: '',
      },
    ],
  },
  
  {
    id: 3,
    name: 'LEGS',
    lastCompleted: '2025-01-22',
    exercises: [
      {
        id: 301,
        name: 'Squat',
        sets: [10, 8, 6],
        notes: '',
      },
      {
        id: 302,
        name: 'Leg Press',
        sets: [15, 12, 10],
        notes: '',
      },
      {
        id: 303,
        name: 'Leg Curl',
        sets: [12, 12, 10],
        notes: '',
      },
      {
        id: 304,
        name: 'Standing Calf Raise',
        sets: [20, 15, 15],
        notes: '',
      },
    ],
  },
  
  {
    id: 4,
    name: 'ARMS / SHOULDERS',
    lastCompleted: null, // Never completed
    exercises: [
      {
        id: 401,
        name: 'Military Press',
        sets: [10, 8, 6],
        notes: '',
      },
      {
        id: 402,
        name: 'Lateral Raises',
        sets: [15, 12, 12],
        notes: '',
      },
      {
        id: 403,
        name: 'Dumbbell Curl',
        sets: [12, 10, 8],
        notes: '',
      },
      {
        id: 404,
        name: 'Tricep Extension',
        sets: [12, 10, 10],
        notes: '',
      },
    ],
  },
];

/**
 * Helper function to get next workout after a given workout ID
 * 
 * @param {number} currentWorkoutId - ID of current workout
 * @returns {Object|null} Next workout or null if at end
 */
export const getNextWorkout = (currentWorkoutId) => {
  const currentIndex = workouts.findIndex(w => w.id === currentWorkoutId);
  if (currentIndex === -1 || currentIndex === workouts.length - 1) {
    return null;
  }
  return workouts[currentIndex + 1];
};

/**
 * Helper function to get workout by ID
 * 
 * @param {number} workoutId - Workout identifier
 * @returns {Object|undefined} Workout object or undefined
 */
export const getWorkoutById = (workoutId) => {
  return workouts.find(w => w.id === workoutId);
};