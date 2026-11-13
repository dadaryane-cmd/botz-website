/**
 * Sparks that fall behind a fast-moving mouse (drawn by js/components/cursor/sparks.js). Pure:
 * positions in px, times in ms, so it is unit-tested.
 */

export const SPARK = {
  /** Slower than this (px per ms) the mouse leaves no sparks: reading and pointing stay calm. */
  minSpeed: 1.2,
  life: 500,
  /** Pulls sparks down, px per ms per ms. */
  gravity: 0.0012,
  /** The most sparks at once. */
  max: 40,
}

/** Sparks for one mouse movement at (x, y): none when it moved slowly, else one or two. */
export function newSparks({ x, y, speed, random = Math.random }) {
  if (speed < SPARK.minSpeed) return []
  const count = random() < 0.5 ? 1 : 2
  return Array.from({ length: count }, () => ({
    x,
    y,
    vx: (random() - 0.5) * 0.12,
    vy: -random() * 0.08,
    size: 1 + random() * 1.5,
    age: 0,
  }))
}

/** The sparks `ms` later: moved, pulled down, and without the ones that have burnt out. */
export const stepSparks = (sparks, ms) =>
  sparks
    .map((spark) => {
      const vy = spark.vy + SPARK.gravity * ms
      return { ...spark, x: spark.x + spark.vx * ms, y: spark.y + vy * ms, vy, age: spark.age + ms }
    })
    .filter((spark) => spark.age < SPARK.life)

/** Fully visible when new, gone at the end of its life. */
export const sparkOpacity = (spark) => Math.max(0, 1 - spark.age / SPARK.life)
