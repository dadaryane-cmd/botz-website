/**
 * How far an element has come into view while the page scrolls. Pure, so it is unit-tested.
 */

/**
 * 0 while the element's top is still below `start` (a share of the window's height from its top),
 * rising to 1 when the element's middle reaches `end`; clamped to 0–1.
 */
export function revealProgress({ top, height }, viewportHeight, { start = 0.9, end = 0.45 } = {}) {
  const topAtStart = viewportHeight * start
  const topAtEnd = viewportHeight * end - height / 2
  const progress = (topAtStart - top) / (topAtStart - topAtEnd)
  return Math.min(1, Math.max(0, progress))
}

/**
 * How many of `count` words are lit at `progress`, as a number with a fraction (the word being
 * lit is part-way); every word is fully lit at 1.
 */
export const litWords = (progress, count) => progress * (count + 1)
