/**
 * Mock data representing an active workout session.
 *
 * Data hierarchy: Workout → Exercises → Sets → Fields
 * Each field (weight, reps, rir) has its own value and state,
 * since a user might have planned weight but manually entered reps.
 *
 * Field states:
 * - filled:        Value entered during current session
 * - previous:      Value carried over from last session
 * - planned:       Value from a planned program, not yet confirmed
 * - plannedFilled: Planned value confirmed unchanged by the user
 * - empty:         No value available
 *
 * State management (planned vs filled vs plannedFilled) will be handled
 * by the parent screen once real planned data is available for comparison.
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
        {
          id: 's1',
          completed: true,
          weight: { value: 120.5, state: 'plannedFilled' },
          reps: { value: 5, state: 'filled' },
          rir: { value: 2, state: 'filled' },
        },
        {
          id: 's2',
          completed: false,
          weight: { value: 120.5, state: 'previous' },
          reps: { value: 3, state: 'previous' },
          rir: { value: 1, state: 'previous' },
        },
        {
          id: 's3',
          completed: false,
          weight: { value: 120.5, state: 'planned' },
          reps: { value: 1, state: 'planned' },
          rir: { value: null, state: 'empty' },
        },
      ],
    },
    {
      id: 'e2',
      name: 'Machine Press',
      restTimerSeconds: 90,
      sets: [
        {
          id: 's4',
          completed: true,
          weight: { value: 161.5, state: 'filled' },
          reps: { value: 11, state: 'filled' },
          rir: { value: null, state: 'empty' },
        },
        {
          id: 's5',
          completed: false,
          weight: { value: 161.5, state: 'planned' },
          reps: { value: 12, state: 'planned' },
          rir: { value: null, state: 'empty' },
        },
        {
          id: 's6',
          completed: false,
          weight: { value: null, state: 'empty' },
          reps: { value: null, state: 'empty' },
          rir: { value: null, state: 'empty' },
        },
      ],
    },
  ],
};

export default MOCK_WORKOUT;