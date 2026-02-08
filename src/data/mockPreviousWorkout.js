/**
 * Mock data representing the previous completed workout session.
 * Used to display read-only historical data in the "Previous" view.
 *
 * All fields are in 'previous' state since this is a completed session.
 * Structure mirrors mockWorkout for consistency.
 */

const MOCK_PREVIOUS_WORKOUT = {
  id: 'w0',
  muscleGroup: 'Pectoraux',
  completedAt: '2025-01-28T11:15:00',
  exercises: [
    {
      id: 'e1',
      name: 'Bench Press',
      sets: [
        {
          id: 'ps1',
          weight: 117.5,
          reps: 5,
          rir: 2,
        },
        {
          id: 'ps2',
          weight: 117.5,
          reps: 4,
          rir: 1,
        },
        {
          id: 'ps3',
          weight: 117.5,
          reps: 3,
          rir: 0,
        },
      ],
    },
    {
      id: 'e2',
      name: 'Machine Press',
      sets: [
        {
          id: 'ps4',
          weight: 155,
          reps: 12,
          rir: null,
        },
        {
          id: 'ps5',
          weight: 155,
          reps: 11,
          rir: null,
        },
        {
          id: 'ps6',
          weight: 155,
          reps: 10,
          rir: null,
        },
      ],
    },
  ],
};

export default MOCK_PREVIOUS_WORKOUT;