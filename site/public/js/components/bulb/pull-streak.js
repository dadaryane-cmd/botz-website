/**
 * Counts quick repeats of an action. The returned `count()` reports true when `needed` actions
 * happened in a row, each within `maxGapMs` of the previous one, then starts counting again.
 * `now` is injectable so the counter can be tested without waiting.
 */
export function createPullStreak({ needed, maxGapMs, now = () => Date.now() }) {
  let streak = 0
  let lastPull = -Infinity

  return function count() {
    const time = now()
    streak = time - lastPull <= maxGapMs ? streak + 1 : 1
    lastPull = time
    if (streak < needed) return false
    streak = 0
    return true
  }
}
