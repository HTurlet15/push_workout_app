/**
 * Mock data representing the next planned workout session.
 * Used to display and edit upcoming planned values in the "Next" view.
 *
 * If a value is filled by the user, it becomes the planned value
 * for the next workout. Otherwise, the previous workout value is used.
 *
 * Structure is intentionally simple (raw values) since planned data
 * comes from a program or user input, not from a live session.
 */

const MOCK_NEXT_WORKOUT = {
  id: 'w2',
  muscleGroup: 'Pectoraux',
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
        { id: 'ns4', weight: 165, reps: 12 },
        { id: 'ns5', weight: 165, reps: 12 },
        { id: 'ns6', weight: 165, reps: 12 },
      ],
    },
  ],
};

export default MOCK_NEXT_WORKOUT;