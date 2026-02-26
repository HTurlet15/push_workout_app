/**
 * Mock data for programs.
 *
 * Each program contains full session data (current/previous/next)
 * so that selecting a program loads its workouts into the session state.
 */

const daysAgo = (d) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

const MOCK_PROGRAMS = [
  // ── Program 1: Push Pull Legs ─────────────────────────────
  {
    id: 'prog-1',
    name: 'Push Pull Legs',
    note: 'Hypertrophy focus, deload every 4th week',
    frequency: '5d/week',
    sessions: [
      {
        current: {
          id: 'w1',
          name: 'Pectoraux',
          completedAt: null,
          exercises: [
            {
              id: 'e1', name: 'Bench Press', note: undefined, restTimerSeconds: 90,
              sets: [
                { id: 's1-1', weight: { value: 120.5, state: 'filled' }, reps: { value: 5, state: 'filled' }, rir: { value: 2, state: 'filled' } },
                { id: 's1-2', weight: { value: 120.5, state: 'filled' }, reps: { value: 3, state: 'filled' }, rir: { value: 1, state: 'previous' } },
                { id: 's1-3', weight: { value: 120.5, state: 'previous' }, reps: { value: 1, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'e2', name: 'Machine Press', note: undefined, restTimerSeconds: 60,
              sets: [
                { id: 's2-1', weight: { value: 161.5, state: 'filled' }, reps: { value: 11, state: 'filled' }, rir: { value: null, state: 'empty' } },
                { id: 's2-2', weight: { value: 161.5, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
                { id: 's2-3', weight: { value: 161.5, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
              ],
            },
          ],
        },
        previous: {
          id: 'w0', name: 'Pectoraux', completedAt: daysAgo(4),
          exercises: [
            { id: 'e1', name: 'Bench Press', sets: [{ id: 'ps1', weight: 117.5, reps: 5, rir: 2 }, { id: 'ps2', weight: 117.5, reps: 4, rir: 1 }, { id: 'ps3', weight: 117.5, reps: 3, rir: 0 }] },
            { id: 'e2', name: 'Machine Press', sets: [{ id: 'ps4', weight: 155, reps: 12, rir: null }, { id: 'ps5', weight: 155, reps: 11, rir: null }, { id: 'ps6', weight: 155, reps: 10, rir: null }] },
          ],
        },
        next: {
          id: 'w2', name: 'Pectoraux',
          exercises: [
            { id: 'e1', name: 'Bench Press', sets: [{ id: 'ns1', weight: 122.5, reps: 5 }, { id: 'ns2', weight: 122.5, reps: 4 }, { id: 'ns3', weight: 122.5, reps: 3 }] },
            { id: 'e2', name: 'Machine Press', sets: [{ id: 'ns4', weight: 161.5, reps: 12 }, { id: 'ns5', weight: 161.5, reps: 12 }, { id: 'ns6', weight: 161.5, reps: 12 }] },
          ],
        },
      },
      {
        current: {
          id: 'w3',
          name: 'Dos',
          completedAt: null,
          exercises: [
            {
              id: 'e3', name: 'Deadlift', note: undefined, restTimerSeconds: 120,
              sets: [
                { id: 's3-1', weight: { value: 180, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 's3-2', weight: { value: 180, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 's3-3', weight: { value: 180, state: 'previous' }, reps: { value: 3, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'e4', name: 'Lat Pulldown', note: undefined, restTimerSeconds: 60,
              sets: [
                { id: 's4-1', weight: { value: 70, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
                { id: 's4-2', weight: { value: 70, state: 'previous' }, reps: { value: 11, state: 'previous' }, rir: { value: null, state: 'empty' } },
                { id: 's4-3', weight: { value: 70, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: null, state: 'empty' } },
              ],
            },
          ],
        },
        previous: {
          id: 'w2b', name: 'Dos', completedAt: daysAgo(5),
          exercises: [
            { id: 'e3', name: 'Deadlift', sets: [{ id: 'ps7', weight: 175, reps: 5, rir: 2 }, { id: 'ps8', weight: 175, reps: 4, rir: 1 }, { id: 'ps9', weight: 175, reps: 3, rir: 0 }] },
            { id: 'e4', name: 'Lat Pulldown', sets: [{ id: 'ps10', weight: 67.5, reps: 12, rir: null }, { id: 'ps11', weight: 67.5, reps: 11, rir: null }, { id: 'ps12', weight: 67.5, reps: 10, rir: null }] },
          ],
        },
        next: {
          id: 'w4', name: 'Dos',
          exercises: [
            { id: 'e3', name: 'Deadlift', sets: [{ id: 'ns7', weight: 182.5, reps: 5 }, { id: 'ns8', weight: 182.5, reps: 4 }, { id: 'ns9', weight: 182.5, reps: 3 }] },
            { id: 'e4', name: 'Lat Pulldown', sets: [{ id: 'ns10', weight: 72.5, reps: 12 }, { id: 'ns11', weight: 72.5, reps: 11 }, { id: 'ns12', weight: 72.5, reps: 10 }] },
          ],
        },
      },
      {
        current: {
          id: 'w5',
          name: 'Bras',
          completedAt: null,
          exercises: [
            {
              id: 'e5', name: 'Barbell Curl', note: undefined, restTimerSeconds: 60,
              sets: [
                { id: 's5-1', weight: { value: 30, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 's5-2', weight: { value: 30, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 's5-3', weight: { value: 30, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'e6', name: 'Tricep Pushdown', note: undefined, restTimerSeconds: 60,
              sets: [
                { id: 's6-1', weight: { value: 25, state: 'previous' }, reps: { value: 15, state: 'previous' }, rir: { value: null, state: 'empty' } },
                { id: 's6-2', weight: { value: 25, state: 'previous' }, reps: { value: 13, state: 'previous' }, rir: { value: null, state: 'empty' } },
                { id: 's6-3', weight: { value: 25, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
              ],
            },
          ],
        },
        previous: {
          id: 'w4b', name: 'Bras', completedAt: daysAgo(1),
          exercises: [
            { id: 'e5', name: 'Barbell Curl', sets: [{ id: 'ps13', weight: 27.5, reps: 12, rir: 2 }, { id: 'ps14', weight: 27.5, reps: 10, rir: 1 }, { id: 'ps15', weight: 27.5, reps: 8, rir: 0 }] },
            { id: 'e6', name: 'Tricep Pushdown', sets: [{ id: 'ps16', weight: 22.5, reps: 15, rir: null }, { id: 'ps17', weight: 22.5, reps: 13, rir: null }, { id: 'ps18', weight: 22.5, reps: 12, rir: null }] },
          ],
        },
        next: {
          id: 'w6', name: 'Bras',
          exercises: [
            { id: 'e5', name: 'Barbell Curl', sets: [{ id: 'ns13', weight: 32.5, reps: 12 }, { id: 'ns14', weight: 32.5, reps: 10 }, { id: 'ns15', weight: 32.5, reps: 8 }] },
            { id: 'e6', name: 'Tricep Pushdown', sets: [{ id: 'ns16', weight: 27.5, reps: 15 }, { id: 'ns17', weight: 27.5, reps: 13 }, { id: 'ns18', weight: 27.5, reps: 12 }] },
          ],
        },
      },
    ],
  },

  // ── Program 2: Upper / Lower ──────────────────────────────
  {
    id: 'prog-2',
    name: 'Upper / Lower',
    note: null,
    frequency: '4d/week',
    sessions: [
      {
        current: {
          id: 'ul-w1', name: 'Upper A', completedAt: null,
          exercises: [
            {
              id: 'ul-e1', name: 'Overhead Press', note: undefined, restTimerSeconds: 90,
              sets: [
                { id: 'ul-s1', weight: { value: 60, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'ul-s2', weight: { value: 60, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'ul-s3', weight: { value: 60, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'ul-e2', name: 'Barbell Row', note: undefined, restTimerSeconds: 90,
              sets: [
                { id: 'ul-s4', weight: { value: 80, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'ul-s5', weight: { value: 80, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'ul-s6', weight: { value: 80, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
          ],
        },
        previous: {
          id: 'ul-w0', name: 'Upper A', completedAt: daysAgo(3),
          exercises: [
            { id: 'ul-e1', name: 'Overhead Press', sets: [{ id: 'ul-ps1', weight: 57.5, reps: 8, rir: 2 }, { id: 'ul-ps2', weight: 57.5, reps: 7, rir: 1 }, { id: 'ul-ps3', weight: 57.5, reps: 6, rir: 0 }] },
            { id: 'ul-e2', name: 'Barbell Row', sets: [{ id: 'ul-ps4', weight: 77.5, reps: 8, rir: 2 }, { id: 'ul-ps5', weight: 77.5, reps: 7, rir: 1 }, { id: 'ul-ps6', weight: 77.5, reps: 6, rir: 0 }] },
          ],
        },
        next: {
          id: 'ul-w2', name: 'Upper A',
          exercises: [
            { id: 'ul-e1', name: 'Overhead Press', sets: [{ id: 'ul-ns1', weight: 62.5, reps: 8 }, { id: 'ul-ns2', weight: 62.5, reps: 7 }, { id: 'ul-ns3', weight: 62.5, reps: 6 }] },
            { id: 'ul-e2', name: 'Barbell Row', sets: [{ id: 'ul-ns4', weight: 82.5, reps: 8 }, { id: 'ul-ns5', weight: 82.5, reps: 7 }, { id: 'ul-ns6', weight: 82.5, reps: 6 }] },
          ],
        },
      },
      {
        current: {
          id: 'ul-w3', name: 'Lower A', completedAt: null,
          exercises: [
            {
              id: 'ul-e3', name: 'Squat', note: undefined, restTimerSeconds: 120,
              sets: [
                { id: 'ul-s7', weight: { value: 140, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'ul-s8', weight: { value: 140, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'ul-s9', weight: { value: 140, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'ul-e4', name: 'Romanian Deadlift', note: undefined, restTimerSeconds: 90,
              sets: [
                { id: 'ul-s10', weight: { value: 100, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'ul-s11', weight: { value: 100, state: 'previous' }, reps: { value: 9, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'ul-s12', weight: { value: 100, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
          ],
        },
        previous: {
          id: 'ul-w2b', name: 'Lower A', completedAt: daysAgo(2),
          exercises: [
            { id: 'ul-e3', name: 'Squat', sets: [{ id: 'ul-ps7', weight: 137.5, reps: 5, rir: 2 }, { id: 'ul-ps8', weight: 137.5, reps: 5, rir: 1 }, { id: 'ul-ps9', weight: 137.5, reps: 4, rir: 0 }] },
            { id: 'ul-e4', name: 'Romanian Deadlift', sets: [{ id: 'ul-ps10', weight: 97.5, reps: 10, rir: 2 }, { id: 'ul-ps11', weight: 97.5, reps: 9, rir: 1 }, { id: 'ul-ps12', weight: 97.5, reps: 8, rir: 0 }] },
          ],
        },
        next: {
          id: 'ul-w4', name: 'Lower A',
          exercises: [
            { id: 'ul-e3', name: 'Squat', sets: [{ id: 'ul-ns7', weight: 142.5, reps: 5 }, { id: 'ul-ns8', weight: 142.5, reps: 5 }, { id: 'ul-ns9', weight: 142.5, reps: 4 }] },
            { id: 'ul-e4', name: 'Romanian Deadlift', sets: [{ id: 'ul-ns10', weight: 102.5, reps: 10 }, { id: 'ul-ns11', weight: 102.5, reps: 9 }, { id: 'ul-ns12', weight: 102.5, reps: 8 }] },
          ],
        },
      },
    ],
  },

  // ── Program 3: Full Body ──────────────────────────────────
  {
    id: 'prog-3',
    name: 'Full Body',
    note: 'Beginner-friendly, compound movements only',
    frequency: '3d/week',
    sessions: [
      {
        current: {
          id: 'fb-w1', name: 'Full Body A', completedAt: null,
          exercises: [
            {
              id: 'fb-e1', name: 'Squat', note: undefined, restTimerSeconds: 120,
              sets: [
                { id: 'fb-s1', weight: { value: 100, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'fb-s2', weight: { value: 100, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'fb-s3', weight: { value: 100, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'fb-e2', name: 'Bench Press', note: undefined, restTimerSeconds: 90,
              sets: [
                { id: 'fb-s4', weight: { value: 80, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'fb-s5', weight: { value: 80, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'fb-s6', weight: { value: 80, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
            {
              id: 'fb-e3', name: 'Barbell Row', note: undefined, restTimerSeconds: 90,
              sets: [
                { id: 'fb-s7', weight: { value: 70, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
                { id: 'fb-s8', weight: { value: 70, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
                { id: 'fb-s9', weight: { value: 70, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
              ],
            },
          ],
        },
        previous: {
          id: 'fb-w0', name: 'Full Body A', completedAt: daysAgo(6),
          exercises: [
            { id: 'fb-e1', name: 'Squat', sets: [{ id: 'fb-ps1', weight: 97.5, reps: 8, rir: 2 }, { id: 'fb-ps2', weight: 97.5, reps: 7, rir: 1 }, { id: 'fb-ps3', weight: 97.5, reps: 6, rir: 0 }] },
            { id: 'fb-e2', name: 'Bench Press', sets: [{ id: 'fb-ps4', weight: 77.5, reps: 8, rir: 2 }, { id: 'fb-ps5', weight: 77.5, reps: 7, rir: 1 }, { id: 'fb-ps6', weight: 77.5, reps: 6, rir: 0 }] },
            { id: 'fb-e3', name: 'Barbell Row', sets: [{ id: 'fb-ps7', weight: 67.5, reps: 8, rir: 2 }, { id: 'fb-ps8', weight: 67.5, reps: 7, rir: 1 }, { id: 'fb-ps9', weight: 67.5, reps: 6, rir: 0 }] },
          ],
        },
        next: {
          id: 'fb-w2', name: 'Full Body A',
          exercises: [
            { id: 'fb-e1', name: 'Squat', sets: [{ id: 'fb-ns1', weight: 102.5, reps: 8 }, { id: 'fb-ns2', weight: 102.5, reps: 7 }, { id: 'fb-ns3', weight: 102.5, reps: 6 }] },
            { id: 'fb-e2', name: 'Bench Press', sets: [{ id: 'fb-ns4', weight: 82.5, reps: 8 }, { id: 'fb-ns5', weight: 82.5, reps: 7 }, { id: 'fb-ns6', weight: 82.5, reps: 6 }] },
            { id: 'fb-e3', name: 'Barbell Row', sets: [{ id: 'fb-ns7', weight: 72.5, reps: 8 }, { id: 'fb-ns8', weight: 72.5, reps: 7 }, { id: 'fb-ns9', weight: 72.5, reps: 6 }] },
          ],
        },
      },
    ],
  },
];

export default MOCK_PROGRAMS;