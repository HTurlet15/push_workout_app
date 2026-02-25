/**
 * Mock data for all workout sessions.
 * Dates are relative — set close to "now" for realistic display.
 */

// Helper: date X days ago as ISO string
const daysAgo = (d) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

const MOCK_SESSIONS = [
  // ── Séance 1: Pectoraux ─────────────────────────────────
  {
    current: {
      id: 'w1',
      name: 'Pectoraux',
      completedAt: null,
      exercises: [
        {
          id: 'e1',
          name: 'Bench Press',
          note: undefined,
          restTimerSeconds: 90,
          sets: [
            { id: 's1-1', weight: { value: 120.5, state: 'filled' }, reps: { value: 5, state: 'filled' }, rir: { value: 2, state: 'filled' } },
            { id: 's1-2', weight: { value: 120.5, state: 'filled' }, reps: { value: 3, state: 'filled' }, rir: { value: 1, state: 'previous' } },
            { id: 's1-3', weight: { value: 120.5, state: 'previous' }, reps: { value: 1, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ],
        },
        {
          id: 'e2',
          name: 'Machine Press',
          note: undefined,
          restTimerSeconds: 60,
          sets: [
            { id: 's2-1', weight: { value: 161.5, state: 'filled' }, reps: { value: 11, state: 'filled' }, rir: { value: null, state: 'empty' } },
            { id: 's2-2', weight: { value: 161.5, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's2-3', weight: { value: 161.5, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
          ],
        },
      ],
    },
    previous: {
      id: 'w0',
      name: 'Pectoraux',
      completedAt: daysAgo(4),
      exercises: [
        {
          id: 'e1',
          name: 'Bench Press',
          sets: [
            { id: 'ps1', weight: 117.5, reps: 5, rir: 2 },
            { id: 'ps2', weight: 117.5, reps: 4, rir: 1 },
            { id: 'ps3', weight: 117.5, reps: 3, rir: 0 },
          ],
        },
        {
          id: 'e2',
          name: 'Machine Press',
          sets: [
            { id: 'ps4', weight: 155, reps: 12, rir: null },
            { id: 'ps5', weight: 155, reps: 11, rir: null },
            { id: 'ps6', weight: 155, reps: 10, rir: null },
          ],
        },
      ],
    },
    next: {
      id: 'w2',
      name: 'Pectoraux',
      exercises: [
        {
          id: 'e1',
          name: 'Bench Press',
          sets: [
            { id: 'ns1', weight: 122.5, reps: 5 },
            { id: 'ns2', weight: 122.5, reps: 4 },
            { id: 'ns3', weight: 122.5, reps: 3 },
          ],
        },
        {
          id: 'e2',
          name: 'Machine Press',
          sets: [
            { id: 'ns4', weight: 161.5, reps: 12 },
            { id: 'ns5', weight: 161.5, reps: 12 },
            { id: 'ns6', weight: 161.5, reps: 12 },
          ],
        },
      ],
    },
  },

  // ── Séance 2: Dos ───────────────────────────────────────
  {
    current: {
      id: 'w3',
      name: 'Dos',
      completedAt: null,
      exercises: [
        {
          id: 'e3',
          name: 'Deadlift',
          note: undefined,
          restTimerSeconds: 120,
          sets: [
            { id: 's3-1', weight: { value: 180, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's3-2', weight: { value: 180, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's3-3', weight: { value: 180, state: 'previous' }, reps: { value: 3, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ],
        },
        {
          id: 'e4',
          name: 'Lat Pulldown',
          note: undefined,
          restTimerSeconds: 60,
          sets: [
            { id: 's4-1', weight: { value: 70, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's4-2', weight: { value: 70, state: 'previous' }, reps: { value: 11, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's4-3', weight: { value: 70, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: null, state: 'empty' } },
          ],
        },
      ],
    },
    previous: {
      id: 'w2b',
      name: 'Dos',
      completedAt: daysAgo(5),
      exercises: [
        {
          id: 'e3',
          name: 'Deadlift',
          sets: [
            { id: 'ps7', weight: 175, reps: 5, rir: 2 },
            { id: 'ps8', weight: 175, reps: 4, rir: 1 },
            { id: 'ps9', weight: 175, reps: 3, rir: 0 },
          ],
        },
        {
          id: 'e4',
          name: 'Lat Pulldown',
          sets: [
            { id: 'ps10', weight: 67.5, reps: 12, rir: null },
            { id: 'ps11', weight: 67.5, reps: 11, rir: null },
            { id: 'ps12', weight: 67.5, reps: 10, rir: null },
          ],
        },
      ],
    },
    next: {
      id: 'w4',
      name: 'Dos',
      exercises: [
        {
          id: 'e3',
          name: 'Deadlift',
          sets: [
            { id: 'ns7', weight: 182.5, reps: 5 },
            { id: 'ns8', weight: 182.5, reps: 4 },
            { id: 'ns9', weight: 182.5, reps: 3 },
          ],
        },
        {
          id: 'e4',
          name: 'Lat Pulldown',
          sets: [
            { id: 'ns10', weight: 72.5, reps: 12 },
            { id: 'ns11', weight: 72.5, reps: 11 },
            { id: 'ns12', weight: 72.5, reps: 10 },
          ],
        },
      ],
    },
  },

  // ── Séance 3: Bras ──────────────────────────────────────
  {
    current: {
      id: 'w5',
      name: 'Bras',
      completedAt: null,
      exercises: [
        {
          id: 'e5',
          name: 'Barbell Curl',
          note: undefined,
          restTimerSeconds: 60,
          sets: [
            { id: 's5-1', weight: { value: 30, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's5-2', weight: { value: 30, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's5-3', weight: { value: 30, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ],
        },
        {
          id: 'e6',
          name: 'Tricep Pushdown',
          note: undefined,
          restTimerSeconds: 60,
          sets: [
            { id: 's6-1', weight: { value: 25, state: 'previous' }, reps: { value: 15, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's6-2', weight: { value: 25, state: 'previous' }, reps: { value: 13, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's6-3', weight: { value: 25, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
          ],
        },
      ],
    },
    previous: {
      id: 'w4b',
      name: 'Bras',
      completedAt: daysAgo(1),
      exercises: [
        {
          id: 'e5',
          name: 'Barbell Curl',
          sets: [
            { id: 'ps13', weight: 27.5, reps: 12, rir: 2 },
            { id: 'ps14', weight: 27.5, reps: 10, rir: 1 },
            { id: 'ps15', weight: 27.5, reps: 8, rir: 0 },
          ],
        },
        {
          id: 'e6',
          name: 'Tricep Pushdown',
          sets: [
            { id: 'ps16', weight: 22.5, reps: 15, rir: null },
            { id: 'ps17', weight: 22.5, reps: 13, rir: null },
            { id: 'ps18', weight: 22.5, reps: 12, rir: null },
          ],
        },
      ],
    },
    next: {
      id: 'w6',
      name: 'Bras',
      exercises: [
        {
          id: 'e5',
          name: 'Barbell Curl',
          sets: [
            { id: 'ns13', weight: 32.5, reps: 12 },
            { id: 'ns14', weight: 32.5, reps: 10 },
            { id: 'ns15', weight: 32.5, reps: 8 },
          ],
        },
        {
          id: 'e6',
          name: 'Tricep Pushdown',
          sets: [
            { id: 'ns16', weight: 27.5, reps: 15 },
            { id: 'ns17', weight: 27.5, reps: 13 },
            { id: 'ns18', weight: 27.5, reps: 12 },
          ],
        },
      ],
    },
  },
];

export default MOCK_SESSIONS;