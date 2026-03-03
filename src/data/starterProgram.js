const daysAgo = (d) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

const generateHistory = (exercises, count, startDaysAgo, interval) => {
  const results = [];
  // Per-exercise state for staircase progression
  const state = exercises.map((ex) => ({ current: ex.base }));

  for (let i = 0; i < count; i++) {
    const day = startDaysAgo - (count - 1 - i) * interval;
    const exData = exercises.map((ex, ei) => {
      if (i > 0) {
        // Staircase: 40% plateau, 30% jump up, 15% small dip, 15% big jump
        const roll = Math.abs(Math.sin(i * 13 + ex.base * 7 + ei * 31)) % 1;
        if (roll < 0.40) {
          // Plateau — stay same or tiny variation
          state[ei].current += (roll < 0.2 ? 0 : Math.round(ex.base * 0.005));
        } else if (roll < 0.70) {
          // Normal jump up
          state[ei].current += Math.round(ex.growth / count * (1 + roll));
        } else if (roll < 0.85) {
          // Bad day — dip
          state[ei].current -= Math.round(ex.base * 0.03);
        } else {
          // Big jump (PR day)
          state[ei].current += Math.round(ex.growth / count * 2.5);
        }
        // Clamp: never below 90% of base
        state[ei].current = Math.max(state[ei].current, Math.round(ex.base * 0.9));
      }
      return { name: ex.name, tonnage: state[ei].current };
    });
    results.push({
      date: daysAgo(day),
      exercises: exData,
      totalTonnage: exData.reduce((s, e) => s + e.tonnage, 0),
    });
  }
  return results;
};

const STARTER_PROGRAM = {
  id: 'starter-ppl',
  name: 'Push Pull Legs',
  note: null,
  frequency: '3-6d/week',
  sessions: [
    {
      history: generateHistory([
        { name: 'Bench Press', base: 3600, growth: 900 },
        { name: 'Overhead Press', base: 2100, growth: 450 },
      ], 8, 28, 4),
      current: {
        id: 'wk-push', name: 'Push', completedAt: null,
        exercises: [
          { id: 'ex-bench', name: 'Bench Press', note: undefined, restTimerSeconds: 90, repRange: '6-8', sets: [
            { id: 's-b1', weight: { value: 80, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's-b2', weight: { value: 80, state: 'previous' }, reps: { value: 7, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's-b3', weight: { value: 80, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'ex-ohp', name: 'Overhead Press', note: undefined, restTimerSeconds: 90, repRange: '8-10', sets: [
            { id: 's-o1', weight: { value: 45, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's-o2', weight: { value: 45, state: 'previous' }, reps: { value: 9, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's-o3', weight: { value: 45, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
        ],
      },
      previous: { id: 'wk-push-prev', name: 'Push', completedAt: daysAgo(4), exercises: [
        { id: 'ex-bench', name: 'Bench Press', sets: [
          { id: 'pb1', weight: 77.5, reps: 8, rir: 2 }, { id: 'pb2', weight: 77.5, reps: 7, rir: 1 }, { id: 'pb3', weight: 77.5, reps: 6, rir: 0 },
        ]},
        { id: 'ex-ohp', name: 'Overhead Press', sets: [
          { id: 'po1', weight: 42.5, reps: 10, rir: 2 }, { id: 'po2', weight: 42.5, reps: 9, rir: 1 }, { id: 'po3', weight: 42.5, reps: 8, rir: 0 },
        ]},
      ]},
      next: { id: 'wk-push-next', name: 'Push', exercises: [
        { id: 'ex-bench', name: 'Bench Press', sets: [
          { id: 'nb1', weight: null, reps: null }, { id: 'nb2', weight: null, reps: null }, { id: 'nb3', weight: null, reps: null },
        ]},
        { id: 'ex-ohp', name: 'Overhead Press', sets: [
          { id: 'no1', weight: null, reps: null }, { id: 'no2', weight: null, reps: null }, { id: 'no3', weight: null, reps: null },
        ]},
      ]},
    },
    {
      history: generateHistory([
        { name: 'Deadlift', base: 5400, growth: 1200 },
        { name: 'Barbell Row', base: 3000, growth: 600 },
      ], 8, 27, 4),
      current: {
        id: 'wk-pull', name: 'Pull', completedAt: null,
        exercises: [
          { id: 'ex-dl', name: 'Deadlift', note: undefined, restTimerSeconds: 120, repRange: '3-5', sets: [
            { id: 's-d1', weight: { value: 140, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's-d2', weight: { value: 140, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's-d3', weight: { value: 140, state: 'previous' }, reps: { value: 3, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'ex-row', name: 'Barbell Row', note: undefined, restTimerSeconds: 90, repRange: '8-10', sets: [
            { id: 's-r1', weight: { value: 70, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's-r2', weight: { value: 70, state: 'previous' }, reps: { value: 9, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's-r3', weight: { value: 70, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
        ],
      },
      previous: { id: 'wk-pull-prev', name: 'Pull', completedAt: daysAgo(3), exercises: [
        { id: 'ex-dl', name: 'Deadlift', sets: [
          { id: 'pd1', weight: 135, reps: 5, rir: 2 }, { id: 'pd2', weight: 135, reps: 4, rir: 1 }, { id: 'pd3', weight: 135, reps: 3, rir: 0 },
        ]},
        { id: 'ex-row', name: 'Barbell Row', sets: [
          { id: 'pr1', weight: 67.5, reps: 10, rir: 2 }, { id: 'pr2', weight: 67.5, reps: 9, rir: 1 }, { id: 'pr3', weight: 67.5, reps: 8, rir: 0 },
        ]},
      ]},
      next: { id: 'wk-pull-next', name: 'Pull', exercises: [
        { id: 'ex-dl', name: 'Deadlift', sets: [
          { id: 'nd1', weight: null, reps: null }, { id: 'nd2', weight: null, reps: null }, { id: 'nd3', weight: null, reps: null },
        ]},
        { id: 'ex-row', name: 'Barbell Row', sets: [
          { id: 'nr1', weight: null, reps: null }, { id: 'nr2', weight: null, reps: null }, { id: 'nr3', weight: null, reps: null },
        ]},
      ]},
    },
    {
      history: generateHistory([
        { name: 'Squat', base: 4200, growth: 1000 },
        { name: 'Romanian Deadlift', base: 3200, growth: 650 },
      ], 8, 26, 4),
      current: {
        id: 'wk-legs', name: 'Legs', completedAt: null,
        exercises: [
          { id: 'ex-sq', name: 'Squat', note: undefined, restTimerSeconds: 120, repRange: '4-6', sets: [
            { id: 's-sq1', weight: { value: 120, state: 'previous' }, reps: { value: 6, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's-sq2', weight: { value: 120, state: 'previous' }, reps: { value: 5, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's-sq3', weight: { value: 120, state: 'previous' }, reps: { value: 4, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
          { id: 'ex-rdl', name: 'Romanian Deadlift', note: undefined, restTimerSeconds: 90, repRange: '8-10', sets: [
            { id: 's-rdl1', weight: { value: 80, state: 'previous' }, reps: { value: 10, state: 'previous' }, rir: { value: 2, state: 'previous' } },
            { id: 's-rdl2', weight: { value: 80, state: 'previous' }, reps: { value: 9, state: 'previous' }, rir: { value: 1, state: 'previous' } },
            { id: 's-rdl3', weight: { value: 80, state: 'previous' }, reps: { value: 8, state: 'previous' }, rir: { value: 0, state: 'previous' } },
          ]},
        ],
      },
      previous: { id: 'wk-legs-prev', name: 'Legs', completedAt: daysAgo(2), exercises: [
        { id: 'ex-sq', name: 'Squat', sets: [
          { id: 'psq1', weight: 115, reps: 6, rir: 2 }, { id: 'psq2', weight: 115, reps: 5, rir: 1 }, { id: 'psq3', weight: 115, reps: 4, rir: 0 },
        ]},
        { id: 'ex-rdl', name: 'Romanian Deadlift', sets: [
          { id: 'prdl1', weight: 77.5, reps: 10, rir: 2 }, { id: 'prdl2', weight: 77.5, reps: 9, rir: 1 }, { id: 'prdl3', weight: 77.5, reps: 8, rir: 0 },
        ]},
      ]},
      next: { id: 'wk-legs-next', name: 'Legs', exercises: [
        { id: 'ex-sq', name: 'Squat', sets: [
          { id: 'nsq1', weight: null, reps: null }, { id: 'nsq2', weight: null, reps: null }, { id: 'nsq3', weight: null, reps: null },
        ]},
        { id: 'ex-rdl', name: 'Romanian Deadlift', sets: [
          { id: 'nrdl1', weight: null, reps: null }, { id: 'nrdl2', weight: null, reps: null }, { id: 'nrdl3', weight: null, reps: null },
        ]},
      ]},
    },
  ],
};

export default STARTER_PROGRAM;