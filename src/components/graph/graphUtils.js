/**
 * Shared graph utilities used by GraphCard and GraphDetail.
 */

/**
 * Computes a live tonnage entry from the current session in progress.
 * Only counts sets that are 'filled' or 'plannedFilled'.
 * Returns null if no set has been filled yet.
 *
 * @param {Object} current - session.current object
 * @returns {{ date: string, exercises: Array, totalTonnage: number, isLive: true } | null}
 */
export const computeLiveEntry = (current) => {
  if (!current?.exercises?.length) return null;
  let hasAnyFilled = false;
  const exercises = current.exercises.map((ex) => {
    const tonnage = ex.sets.reduce((sum, set) => {
      const wDone = set.weight?.state === 'filled' || set.weight?.state === 'plannedFilled';
      const rDone = set.reps?.state === 'filled' || set.reps?.state === 'plannedFilled';
      if (!wDone || !rDone) return sum;
      hasAnyFilled = true;
      const w = typeof set.weight.value === 'object' ? (set.weight.value.kg ?? 0) : (set.weight.value ?? 0);
      const r = set.reps.value ?? 0;
      return sum + (w * r);
    }, 0);
    return { name: ex.name, tonnage: Math.round(tonnage) };
  });
  if (!hasAnyFilled) return null;
  const totalTonnage = exercises.reduce((sum, e) => sum + e.tonnage, 0);
  return { date: new Date().toISOString(), exercises, totalTonnage, isLive: true };
};
