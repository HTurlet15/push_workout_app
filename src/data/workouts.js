/**
 * Workout Data
 * 
 * @module data/workouts
 * @version 2.0.0
 */

export const workouts = [
  {
    id: 1,
    name: 'PUSH',
    lastCompleted: '2025-01-28',
    exercises: [
      { 
        id: 101, 
        name: 'Bench Press', 
        sets: [
          { reps: 5, weight: 60, completed: false, previous: { reps: 5, weight: 60 } },
          { reps: 5, weight: 65, completed: false, previous: { reps: 5, weight: 65 } },
          { reps: 3, weight: 70, completed: false, previous: { reps: 3, weight: 70 } },
        ],
        notes: '' 
      },
      { 
        id: 102, 
        name: 'Incline Dumbbell Press', 
        sets: [
          { reps: 8, weight: 20, completed: false, previous: { reps: 8, weight: 20 } },
          { reps: 8, weight: 22.5, completed: false, previous: { reps: 8, weight: 22.5 } },
        ],
        notes: '' 
      },
      { 
        id: 103, 
        name: 'Dumbbell Flyes', 
        sets: [
          { reps: 12, weight: 12.5, completed: false, previous: { reps: 12, weight: 12.5 } },
          { reps: 12, weight: 12.5, completed: false, previous: { reps: 12, weight: 12.5 } },
        ],
        notes: '' 
      },
      { 
        id: 104, 
        name: 'Overhead Press', 
        sets: [
          { reps: 5, weight: 40, completed: false, previous: { reps: 5, weight: 40 } },
          { reps: 5, weight: 42.5, completed: false, previous: { reps: 5, weight: 42.5 } },
          { reps: 3, weight: 45, completed: false, previous: { reps: 3, weight: 45 } },
        ],
        notes: '' 
      },
    ]
  },
  {
    id: 2,
    name: 'PULL',
    lastCompleted: '2025-01-27',
    exercises: [
      { 
        id: 201, 
        name: 'Pull-Ups', 
        sets: [
          { reps: 8, weight: 0, completed: false, previous: { reps: 8, weight: 0 } },
          { reps: 6, weight: 0, completed: false, previous: { reps: 6, weight: 0 } },
          { reps: 5, weight: 0, completed: false, previous: { reps: 5, weight: 0 } },
        ],
        notes: '' 
      },
      { 
        id: 202, 
        name: 'Barbell Rows', 
        sets: [
          { reps: 8, weight: 60, completed: false, previous: { reps: 8, weight: 60 } },
          { reps: 8, weight: 65, completed: false, previous: { reps: 8, weight: 65 } },
        ],
        notes: '' 
      },
      { 
        id: 203, 
        name: 'Face Pulls', 
        sets: [
          { reps: 15, weight: 20, completed: false, previous: { reps: 15, weight: 20 } },
          { reps: 15, weight: 20, completed: false, previous: { reps: 15, weight: 20 } },
        ],
        notes: '' 
      },
      { 
        id: 204, 
        name: 'Bicep Curls', 
        sets: [
          { reps: 10, weight: 12.5, completed: false, previous: { reps: 10, weight: 12.5 } },
          { reps: 10, weight: 12.5, completed: false, previous: { reps: 10, weight: 12.5 } },
        ],
        notes: '' 
      },
    ]
  },
  {
    id: 3,
    name: 'LEGS',
    lastCompleted: '2025-01-26',
    exercises: [
      { 
        id: 301, 
        name: 'Squats', 
        sets: [
          { reps: 5, weight: 80, completed: false, previous: { reps: 5, weight: 80 } },
          { reps: 5, weight: 85, completed: false, previous: { reps: 5, weight: 85 } },
          { reps: 3, weight: 90, completed: false, previous: { reps: 3, weight: 90 } },
        ],
        notes: '' 
      },
      { 
        id: 302, 
        name: 'Romanian Deadlifts', 
        sets: [
          { reps: 8, weight: 60, completed: false, previous: { reps: 8, weight: 60 } },
          { reps: 8, weight: 65, completed: false, previous: { reps: 8, weight: 65 } },
        ],
        notes: '' 
      },
      { 
        id: 303, 
        name: 'Leg Press', 
        sets: [
          { reps: 10, weight: 100, completed: false, previous: { reps: 10, weight: 100 } },
          { reps: 10, weight: 110, completed: false, previous: { reps: 10, weight: 110 } },
        ],
        notes: '' 
      },
      { 
        id: 304, 
        name: 'Calf Raises', 
        sets: [
          { reps: 15, weight: 40, completed: false, previous: { reps: 15, weight: 40 } },
          { reps: 15, weight: 40, completed: false, previous: { reps: 15, weight: 40 } },
        ],
        notes: '' 
      },
    ]
  },
  {
    id: 4,
    name: 'ARMS/SHOULDERS',
    lastCompleted: '2025-01-25',
    exercises: [
      { 
        id: 401, 
        name: 'Lateral Raises', 
        sets: [
          { reps: 12, weight: 7.5, completed: false, previous: { reps: 12, weight: 7.5 } },
          { reps: 12, weight: 7.5, completed: false, previous: { reps: 12, weight: 7.5 } },
        ],
        notes: '' 
      },
      { 
        id: 402, 
        name: 'Tricep Extensions', 
        sets: [
          { reps: 10, weight: 15, completed: false, previous: { reps: 10, weight: 15 } },
          { reps: 10, weight: 15, completed: false, previous: { reps: 10, weight: 15 } },
        ],
        notes: '' 
      },
      { 
        id: 403, 
        name: 'Hammer Curls', 
        sets: [
          { reps: 10, weight: 12.5, completed: false, previous: { reps: 10, weight: 12.5 } },
          { reps: 10, weight: 12.5, completed: false, previous: { reps: 10, weight: 12.5 } },
        ],
        notes: '' 
      },
      { 
        id: 404, 
        name: 'Cable Flyes', 
        sets: [
          { reps: 15, weight: 10, completed: false, previous: { reps: 15, weight: 10 } },
          { reps: 15, weight: 10, completed: false, previous: { reps: 15, weight: 10 } },
        ],
        notes: '' 
      },
    ]
  },
];

export function getNextWorkout(currentId) {
  const currentIndex = workouts.findIndex(w => w.id === currentId);
  if (currentIndex === -1) return workouts[0];
  return workouts[(currentIndex + 1) % workouts.length];
}

export function getWorkoutById(id) {
  return workouts.find(w => w.id === id);
}