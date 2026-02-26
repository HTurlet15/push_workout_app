/**
 * Mock data for programs.
 *
 * Each program contains a list of workout templates (name + exercise count).
 * The active program's workouts populate mockSessions / WorkoutsList.
 */

const MOCK_PROGRAMS = [
  {
    id: 'prog-1',
    name: 'Push Pull Legs',
    note: 'Hypertrophy focus, deload every 4th week',
    frequency: '5d/week',
    workouts: [
      { id: 'pw-1', name: 'Push A', exerciseCount: 4 },
      { id: 'pw-2', name: 'Pull A', exerciseCount: 4 },
      { id: 'pw-3', name: 'Legs A', exerciseCount: 5 },
      { id: 'pw-4', name: 'Push B', exerciseCount: 4 },
      { id: 'pw-5', name: 'Pull B', exerciseCount: 3 },
      { id: 'pw-6', name: 'Legs B', exerciseCount: 5 },
    ],
  },
  {
    id: 'prog-2',
    name: 'Upper / Lower',
    note: null,
    frequency: '4d/week',
    workouts: [
      { id: 'uw-1', name: 'Upper A', exerciseCount: 5 },
      { id: 'uw-2', name: 'Lower A', exerciseCount: 4 },
      { id: 'uw-3', name: 'Upper B', exerciseCount: 5 },
      { id: 'uw-4', name: 'Lower B', exerciseCount: 4 },
    ],
  },
  {
    id: 'prog-3',
    name: 'Full Body',
    note: 'Beginner-friendly, compound movements only',
    frequency: '3d/week',
    workouts: [
      { id: 'fb-1', name: 'Full Body A', exerciseCount: 6 },
      { id: 'fb-2', name: 'Full Body B', exerciseCount: 6 },
      { id: 'fb-3', name: 'Full Body C', exerciseCount: 5 },
    ],
  },
];

export default MOCK_PROGRAMS;