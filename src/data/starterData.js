/**
 * Starter data for first-time users.
 * One program with 2 workouts, each with 2 exercises.
 * No previous data, no history — clean slate.
 */

const STARTER_PROGRAMS = [
  {
    id: 'starter-prog-1',
    name: 'My First Program',
    note: 'Your starter program — customize it!',
    frequency: '3d/week',
    sessions: [
      {
        history: [],
        current: {
          id: 'starter-w1',
          name: 'Upper Body',
          completedAt: null,
          exercises: [
            {
              id: 'starter-e1',
              name: 'Bench Press',
              note: undefined,
              restTimerSeconds: 90,
              repRange: '8-12',
              sets: [
                { id: 'starter-s1', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s2', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s3', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
              ],
            },
            {
              id: 'starter-e2',
              name: 'Barbell Row',
              note: undefined,
              restTimerSeconds: 90,
              repRange: '8-12',
              sets: [
                { id: 'starter-s4', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s5', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s6', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
              ],
            },
          ],
        },
        previous: null,
        next: {
          id: 'starter-w1-next',
          name: 'Upper Body',
          exercises: [
            { id: 'starter-e1', name: 'Bench Press', sets: [
              { id: 'starter-ns1', weight: null, reps: null },
              { id: 'starter-ns2', weight: null, reps: null },
              { id: 'starter-ns3', weight: null, reps: null },
            ]},
            { id: 'starter-e2', name: 'Barbell Row', sets: [
              { id: 'starter-ns4', weight: null, reps: null },
              { id: 'starter-ns5', weight: null, reps: null },
              { id: 'starter-ns6', weight: null, reps: null },
            ]},
          ],
        },
      },
      {
        history: [],
        current: {
          id: 'starter-w2',
          name: 'Lower Body',
          completedAt: null,
          exercises: [
            {
              id: 'starter-e3',
              name: 'Squat',
              note: undefined,
              restTimerSeconds: 120,
              repRange: '5-8',
              sets: [
                { id: 'starter-s7', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s8', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s9', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
              ],
            },
            {
              id: 'starter-e4',
              name: 'Romanian Deadlift',
              note: undefined,
              restTimerSeconds: 90,
              repRange: '8-10',
              sets: [
                { id: 'starter-s10', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s11', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
                { id: 'starter-s12', weight: { value: null, state: 'empty' }, reps: { value: null, state: 'empty' }, rir: { value: null, state: 'empty' } },
              ],
            },
          ],
        },
        previous: null,
        next: {
          id: 'starter-w2-next',
          name: 'Lower Body',
          exercises: [
            { id: 'starter-e3', name: 'Squat', sets: [
              { id: 'starter-ns7', weight: null, reps: null },
              { id: 'starter-ns8', weight: null, reps: null },
              { id: 'starter-ns9', weight: null, reps: null },
            ]},
            { id: 'starter-e4', name: 'Romanian Deadlift', sets: [
              { id: 'starter-ns10', weight: null, reps: null },
              { id: 'starter-ns11', weight: null, reps: null },
              { id: 'starter-ns12', weight: null, reps: null },
            ]},
          ],
        },
      },
    ],
  },
];

export default STARTER_PROGRAMS;
