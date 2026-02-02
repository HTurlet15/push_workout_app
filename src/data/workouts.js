/**
 * Workout Data - Version 0.1.0 (Minimal)
 */

export const workouts = [
  {
    id: 1,
    name: 'PUSH',
    date: 'Jan 28',
    exercises: [
      { 
        id: 101, 
        name: 'Bench Press',
        sets: [
          { previous: '60kg × 5', kg: 60, reps: 6, rir: 2 },
          { previous: '65kg × 5', kg: 60, reps: 4, rir: 1 },
          { previous: '70kg × 3', kg: 60, reps: 2, rir: 0 },
        ],
      },
      { 
        id: 102, 
        name: 'Overhead Press',
        sets: [
          { previous: '40kg × 5', kg: 40, reps: 5, rir: 2 },
        ],
      },
    ]
  },
  {
    id: 2,
    name: 'PULL',
    date: 'Jan 26',
    exercises: [
      { 
        id: 201, 
        name: 'Pull-Ups',
        sets: [
          { previous: '0kg × 8', kg: 0, reps: 8, rir: 2 },
          { previous: '0kg × 6', kg: 0, reps: 6, rir: 1 },
          { previous: '0kg × 5', kg: 0, reps: 5, rir: 0 },
        ],
      },
      { 
        id: 202, 
        name: 'Barbell Rows',
        sets: [
          { previous: '60kg × 8', kg: 60, reps: 8, rir: 2 },
        ],
      },
    ]
  },
];