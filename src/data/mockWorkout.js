/**
 * Mock data representing an active workout session.
 *
 * Data hierarchy: Workout → Exercises → Sets
 * This structure mirrors how a real workout is performed:
 * one session contains multiple exercises, each with multiple sets.
 *
 * Used for UI development before implementing persistent storage.
 */

const MOCK_WORKOUT = {
  id: 'w1',
  muscleGroup: 'Pectoraux',
  startedAt: '2025-02-01T10:30:00',
  exercises: [
    {
      id: 'e1',
      name: 'Bench Press',
      restTimerSeconds: 90,
      sets: [
        { id: 's1', weight: 120.5, reps: 5, rir: 2, completed: true, state: 'filled' },
        { id: 's2', weight: 120.5, reps: 3, rir: 1, completed: false, state: 'previous' },
        { id: 's3', weight: 120.5, reps: 1, rir: 0, completed: false, state: 'planned' },
      ],
    },
    {
      id: 'e2',
      name: 'Machine Press',
      restTimerSeconds: 90,
      sets: [
        { id: 's4', weight: 161.5, reps: 11, rir: null, completed: true, state: 'filled' },
        { id: 's5', weight: 161.5, reps: 12, rir: null, completed: false, state: 'previous' },
        { id: 's6', weight: 161.5, reps: 12, rir: null, completed: false, state: 'empty' },
      ],
    },
  ],
};

export default MOCK_WORKOUT;