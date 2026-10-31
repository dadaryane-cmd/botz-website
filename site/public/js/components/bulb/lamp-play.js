/**
 * What the lamp does as a visitor keeps pulling the cord on one page: it says something at the
 * 3rd and 6th pull, and from the 10th pull on it shows a marketing tip, a new one every pull.
 */

/** Pull number → key of the lamp's line in ui.json (`lamp` group). */
const SAYINGS = { 3: 'oneMore', 6: 'likePlaying' }

export const FIRST_TIP_PULL = 10

/** 'tip', the key of a saying, or null for an ordinary pull. */
export function lampReaction(pulls) {
  if (pulls >= FIRST_TIP_PULL) return 'tip'
  return SAYINGS[pulls] ?? null
}

/** The tip after `previous` (remembered from an earlier visit), starting over after the last. */
export function nextTipIndex(previous, count) {
  if (!Number.isInteger(previous) || previous < 0) return 0
  return (previous + 1) % count
}
