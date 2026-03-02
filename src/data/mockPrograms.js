/**
 * Mock data for programs.
 * Each session now includes a history array for graph display.
 * history: [{ date, exercises: [{ name, tonnage }], totalTonnage }]
 */

const daysAgo = (d) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

/** Seeded pseudo-random for reproducible data */
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** Generate realistic non-linear history with dips, plateaus, and spikes */
const generateHistory = (exercises, count, startDaysAgo, interval) => {
  let seed = 0;
  exercises.forEach((ex) => { for (let i = 0; i < ex.name.length; i++) seed += ex.name.charCodeAt(i); });
  const rand = seededRandom(seed);

  return Array.from({ length: count }, (_, i) => {
    const day = startDaysAgo - i * interval;
    const t = i / (count - 1); // 0→1 over time
    const exData = exercises.map((ex) => {
      // Base trend (logarithmic-ish curve)
      const trend = ex.base + ex.growth * (1 - Math.pow(1 - t, 1.8));
      // Add noise: ±5% variation with occasional dips
      const noise = (rand() - 0.5) * 0.1 * ex.base;
      // Occasional bad day (10% chance of a -3% dip)
      const dip = rand() < 0.1 ? -0.03 * ex.base : 0;
      return {
        name: ex.name,
        tonnage: Math.round(Math.max(trend + noise + dip, ex.base * 0.85)),
      };
    });
    return {
      date: daysAgo(day),
      exercises: exData,
      totalTonnage: exData.reduce((s, e) => s + e.tonnage, 0),
    };
  });
};

const MOCK_PROGRAMS = [
  {
    id: 'prog-1', name: 'Push Pull Legs',
    note: 'Hypertrophy focus, deload every 4th week', frequency: '5d/week',
    sessions: [
      {
        history: generateHistory([
          { name: 'Bench Press', base: 4800, growth: 1225 },
          { name: 'Machine Press', base: 4100, growth: 1115 },
        ], 12, 48, 4),
        current: { id: 'w1', name: 'Pectoraux', completedAt: null, exercises: [
          { id: 'e1', name: 'Bench Press', note: undefined, restTimerSeconds: 90, repRange: '3-5', sets: [
            { id: 's1-1', weight: { value: 120.5, state: 'filled' }, reps: { value: 5, state: 'filled' }, rir: { value: 2, state: 'filled' } },
            { id: 's1-2', weight: { value: 120.5, state: 'filled' }, reps: { value: 3, state: 'filled' }, rir: { value: 1, state: 'previous' } },
            { id: 's1-3', weight: { value: 120.5, state: 'previous' }, reps: { value: 1, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'e2', name: 'Machine Press', note: undefined, restTimerSeconds: 60, repRange: '10-12', sets: [
            { id: 's2-1', weight: { value: 161.5, state: 'filled' }, reps: { value: 11, state: 'filled' }, rir: { value: null, state: 'empty' } },
            { id: 's2-2', weight: { value: 161.5, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's2-3', weight: { value: 161.5, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
          ]},
        ]},
        previous: { id: 'w0', name: 'Pectoraux', completedAt: daysAgo(4), exercises: [
          { id: 'e1', name: 'Bench Press', sets: [{ id: 'ps1', weight: 117.5, reps: 5, rir: 2 }, { id: 'ps2', weight: 117.5, reps: 4, rir: 1 }, { id: 'ps3', weight: 117.5, reps: 3, rir: 0 }] },
          { id: 'e2', name: 'Machine Press', sets: [{ id: 'ps4', weight: 155, reps: 12, rir: null }, { id: 'ps5', weight: 155, reps: 11, rir: null }, { id: 'ps6', weight: 155, reps: 10, rir: null }] },
        ]},
        next: { id: 'w2', name: 'Pectoraux', exercises: [
          { id: 'e1', name: 'Bench Press', sets: [{ id: 'ns1', weight: 122.5, reps: 5 }, { id: 'ns2', weight: 122.5, reps: 4 }, { id: 'ns3', weight: 122.5, reps: 3 }] },
          { id: 'e2', name: 'Machine Press', sets: [{ id: 'ns4', weight: 161.5, reps: 12 }, { id: 'ns5', weight: 161.5, reps: 12 }, { id: 'ns6', weight: 161.5, reps: 12 }] },
        ]},
      },
      {
        history: generateHistory([
          { name: 'Deadlift', base: 8200, growth: 1480 },
          { name: 'Lat Pulldown', base: 4800, growth: 900 },
        ], 12, 49, 4),
        current: { id: 'w3', name: 'Dos', completedAt: null, exercises: [
          { id: 'e3', name: 'Deadlift', note: undefined, restTimerSeconds: 120, repRange: '3-5', sets: [
            { id: 's3-1', weight: { value: 180, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's3-2', weight: { value: 180, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's3-3', weight: { value: 180, state: 'previous' }, reps: { value: 3, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'e4', name: 'Lat Pulldown', note: undefined, restTimerSeconds: 60, repRange: '10-12', sets: [
            { id: 's4-1', weight: { value: 70, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's4-2', weight: { value: 70, state: 'previous' }, reps: { value: 11, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's4-3', weight: { value: 70, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: null, state: 'empty' } },
          ]},
        ]},
        previous: { id: 'w2b', name: 'Dos', completedAt: daysAgo(5), exercises: [
          { id: 'e3', name: 'Deadlift', sets: [{ id: 'ps7', weight: 175, reps: 5, rir: 2 }, { id: 'ps8', weight: 175, reps: 4, rir: 1 }, { id: 'ps9', weight: 175, reps: 3, rir: 0 }] },
          { id: 'e4', name: 'Lat Pulldown', sets: [{ id: 'ps10', weight: 67.5, reps: 12, rir: null }, { id: 'ps11', weight: 67.5, reps: 11, rir: null }, { id: 'ps12', weight: 67.5, reps: 10, rir: null }] },
        ]},
        next: { id: 'w4', name: 'Dos', exercises: [
          { id: 'e3', name: 'Deadlift', sets: [{ id: 'ns7', weight: 182.5, reps: 5 }, { id: 'ns8', weight: 182.5, reps: 4 }, { id: 'ns9', weight: 182.5, reps: 3 }] },
          { id: 'e4', name: 'Lat Pulldown', sets: [{ id: 'ns10', weight: 72.5, reps: 12 }, { id: 'ns11', weight: 72.5, reps: 11 }, { id: 'ns12', weight: 72.5, reps: 10 }] },
        ]},
      },
      {
        history: generateHistory([
          { name: 'Barbell Curl', base: 2400, growth: 380 },
          { name: 'Tricep Pushdown', base: 2100, growth: -150 },
        ], 11, 44, 4),
        current: { id: 'w5', name: 'Bras', completedAt: null, exercises: [
          { id: 'e5', name: 'Barbell Curl', note: undefined, restTimerSeconds: 60, repRange: '8-12', sets: [
            { id: 's5-1', weight: { value: 30, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's5-2', weight: { value: 30, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's5-3', weight: { value: 30, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'e6', name: 'Tricep Pushdown', note: undefined, restTimerSeconds: 60, repRange: '12-15', sets: [
            { id: 's6-1', weight: { value: 25, state: 'previous' }, reps: { value: 15, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's6-2', weight: { value: 25, state: 'previous' }, reps: { value: 13, state: 'previous' }, rir: { value: null, state: 'empty' } },
            { id: 's6-3', weight: { value: 25, state: 'previous' }, reps: { value: 12, state: 'previous' }, rir: { value: null, state: 'empty' } },
          ]},
        ]},
        previous: { id: 'w4b', name: 'Bras', completedAt: daysAgo(1), exercises: [
          { id: 'e5', name: 'Barbell Curl', sets: [{ id: 'ps13', weight: 27.5, reps: 12, rir: 2 }, { id: 'ps14', weight: 27.5, reps: 10, rir: 1 }, { id: 'ps15', weight: 27.5, reps: 8, rir: 0 }] },
          { id: 'e6', name: 'Tricep Pushdown', sets: [{ id: 'ps16', weight: 22.5, reps: 15, rir: null }, { id: 'ps17', weight: 22.5, reps: 13, rir: null }, { id: 'ps18', weight: 22.5, reps: 12, rir: null }] },
        ]},
        next: { id: 'w6', name: 'Bras', exercises: [
          { id: 'e5', name: 'Barbell Curl', sets: [{ id: 'ns13', weight: 32.5, reps: 12 }, { id: 'ns14', weight: 32.5, reps: 10 }, { id: 'ns15', weight: 32.5, reps: 8 }] },
          { id: 'e6', name: 'Tricep Pushdown', sets: [{ id: 'ns16', weight: 27.5, reps: 15 }, { id: 'ns17', weight: 27.5, reps: 13 }, { id: 'ns18', weight: 27.5, reps: 12 }] },
        ]},
      },
    ],
  },
  {
    id: 'prog-2', name: 'Upper / Lower', note: null, frequency: '4d/week',
    sessions: [
      {
        history: generateHistory([
          { name: 'Overhead Press', base: 3200, growth: 600 },
          { name: 'Barbell Row', base: 4400, growth: 700 },
        ], 10, 40, 4),
        current: { id: 'ul-w1', name: 'Upper A', completedAt: null, exercises: [
          { id: 'ul-e1', name: 'Overhead Press', note: undefined, restTimerSeconds: 90, repRange: '6-8', sets: [
            { id: 'ul-s1', weight: { value: 60, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 'ul-s2', weight: { value: 60, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 'ul-s3', weight: { value: 60, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'ul-e2', name: 'Barbell Row', note: undefined, restTimerSeconds: 90, repRange: '6-8', sets: [
            { id: 'ul-s4', weight: { value: 80, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 'ul-s5', weight: { value: 80, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 'ul-s6', weight: { value: 80, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
        ]},
        previous: { id: 'ul-w0', name: 'Upper A', completedAt: daysAgo(3), exercises: [
          { id: 'ul-e1', name: 'Overhead Press', sets: [{ id: 'ul-ps1', weight: 57.5, reps: 8, rir: 2 }, { id: 'ul-ps2', weight: 57.5, reps: 7, rir: 1 }, { id: 'ul-ps3', weight: 57.5, reps: 6, rir: 0 }] },
          { id: 'ul-e2', name: 'Barbell Row', sets: [{ id: 'ul-ps4', weight: 77.5, reps: 8, rir: 2 }, { id: 'ul-ps5', weight: 77.5, reps: 7, rir: 1 }, { id: 'ul-ps6', weight: 77.5, reps: 6, rir: 0 }] },
        ]},
        next: { id: 'ul-w2', name: 'Upper A', exercises: [
          { id: 'ul-e1', name: 'Overhead Press', sets: [{ id: 'ul-ns1', weight: 62.5, reps: 8 }, { id: 'ul-ns2', weight: 62.5, reps: 7 }, { id: 'ul-ns3', weight: 62.5, reps: 6 }] },
          { id: 'ul-e2', name: 'Barbell Row', sets: [{ id: 'ul-ns4', weight: 82.5, reps: 8 }, { id: 'ul-ns5', weight: 82.5, reps: 7 }, { id: 'ul-ns6', weight: 82.5, reps: 6 }] },
        ]},
      },
      {
        history: generateHistory([
          { name: 'Squat', base: 5600, growth: 900 },
          { name: 'Romanian Deadlift', base: 5200, growth: 750 },
        ], 10, 38, 4),
        current: { id: 'ul-w3', name: 'Lower A', completedAt: null, exercises: [
          { id: 'ul-e3', name: 'Squat', note: undefined, restTimerSeconds: 120, repRange: '4-5', sets: [
            { id: 'ul-s7', weight: { value: 140, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 'ul-s8', weight: { value: 140, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 'ul-s9', weight: { value: 140, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'ul-e4', name: 'Romanian Deadlift', note: undefined, restTimerSeconds: 90, repRange: '8-10', sets: [
            { id: 'ul-s10', weight: { value: 100, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 'ul-s11', weight: { value: 100, state: 'previous' }, reps: { value: 9, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 'ul-s12', weight: { value: 100, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
        ]},
        previous: { id: 'ul-w2b', name: 'Lower A', completedAt: daysAgo(2), exercises: [
          { id: 'ul-e3', name: 'Squat', sets: [{ id: 'ul-ps7', weight: 137.5, reps: 5, rir: 2 }, { id: 'ul-ps8', weight: 137.5, reps: 5, rir: 1 }, { id: 'ul-ps9', weight: 137.5, reps: 4, rir: 0 }] },
          { id: 'ul-e4', name: 'Romanian Deadlift', sets: [{ id: 'ul-ps10', weight: 97.5, reps: 10, rir: 2 }, { id: 'ul-ps11', weight: 97.5, reps: 9, rir: 1 }, { id: 'ul-ps12', weight: 97.5, reps: 8, rir: 0 }] },
        ]},
        next: { id: 'ul-w4', name: 'Lower A', exercises: [
          { id: 'ul-e3', name: 'Squat', sets: [{ id: 'ul-ns7', weight: 142.5, reps: 5 }, { id: 'ul-ns8', weight: 142.5, reps: 5 }, { id: 'ul-ns9', weight: 142.5, reps: 4 }] },
          { id: 'ul-e4', name: 'Romanian Deadlift', sets: [{ id: 'ul-ns10', weight: 102.5, reps: 10 }, { id: 'ul-ns11', weight: 102.5, reps: 9 }, { id: 'ul-ns12', weight: 102.5, reps: 8 }] },
        ]},
      },
    ],
  },
  {
    id: 'prog-3', name: 'Full Body',
    note: 'Beginner-friendly, compound movements only', frequency: '3d/week',
    sessions: [{
      history: generateHistory([
        { name: 'Squat', base: 4200, growth: 650 },
        { name: 'Bench Press', base: 3400, growth: 500 },
        { name: 'Barbell Row', base: 3000, growth: 450 },
      ], 8, 42, 5),
      current: { id: 'fb-w1', name: 'Full Body A', completedAt: null, exercises: [
        { id: 'fb-e1', name: 'Squat', note: undefined, restTimerSeconds: 120, repRange: '6-8', sets: [
          { id: 'fb-s1', weight: { value: 100, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
          { id: 'fb-s2', weight: { value: 100, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
          { id: 'fb-s3', weight: { value: 100, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
        ]},
        { id: 'fb-e2', name: 'Bench Press', note: undefined, restTimerSeconds: 90, repRange: '6-8', sets: [
          { id: 'fb-s4', weight: { value: 80, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
          { id: 'fb-s5', weight: { value: 80, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
          { id: 'fb-s6', weight: { value: 80, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
        ]},
        { id: 'fb-e3', name: 'Barbell Row', note: undefined, restTimerSeconds: 90, repRange: '6-8', sets: [
          { id: 'fb-s7', weight: { value: 70, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
          { id: 'fb-s8', weight: { value: 70, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
          { id: 'fb-s9', weight: { value: 70, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
        ]},
      ]},
      previous: { id: 'fb-w0', name: 'Full Body A', completedAt: daysAgo(6), exercises: [
        { id: 'fb-e1', name: 'Squat', sets: [{ id: 'fb-ps1', weight: 97.5, reps: 8, rir: 2 }, { id: 'fb-ps2', weight: 97.5, reps: 7, rir: 1 }, { id: 'fb-ps3', weight: 97.5, reps: 6, rir: 0 }] },
        { id: 'fb-e2', name: 'Bench Press', sets: [{ id: 'fb-ps4', weight: 77.5, reps: 8, rir: 2 }, { id: 'fb-ps5', weight: 77.5, reps: 7, rir: 1 }, { id: 'fb-ps6', weight: 77.5, reps: 6, rir: 0 }] },
        { id: 'fb-e3', name: 'Barbell Row', sets: [{ id: 'fb-ps7', weight: 67.5, reps: 8, rir: 2 }, { id: 'fb-ps8', weight: 67.5, reps: 7, rir: 1 }, { id: 'fb-ps9', weight: 67.5, reps: 6, rir: 0 }] },
      ]},
      next: { id: 'fb-w2', name: 'Full Body A', exercises: [
        { id: 'fb-e1', name: 'Squat', sets: [{ id: 'fb-ns1', weight: 102.5, reps: 8 }, { id: 'fb-ns2', weight: 102.5, reps: 7 }, { id: 'fb-ns3', weight: 102.5, reps: 6 }] },
        { id: 'fb-e2', name: 'Bench Press', sets: [{ id: 'fb-ns4', weight: 82.5, reps: 8 }, { id: 'fb-ns5', weight: 82.5, reps: 7 }, { id: 'fb-ns6', weight: 82.5, reps: 6 }] },
        { id: 'fb-e3', name: 'Barbell Row', sets: [{ id: 'fb-ns7', weight: 72.5, reps: 8 }, { id: 'fb-ns8', weight: 72.5, reps: 7 }, { id: 'fb-ns9', weight: 72.5, reps: 6 }] },
      ]},
    }],
  },
];

export default MOCK_PROGRAMS;