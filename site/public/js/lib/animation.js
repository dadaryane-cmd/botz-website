/** Frame-based animation helpers. Each returns a function that cancels it. */

/**
 * Damped spring from `from` to `to`, integrated every animation frame.
 * Low damping relative to stiffness gives a few bounces before it settles.
 */
export function spring({ from, to, velocity = 0, stiffness, damping, mass = 1, onUpdate, onDone }) {
  let position = from
  let speed = velocity
  let last = performance.now()
  let frame = 0

  const step = (now) => {
    // Small fixed sub-steps keep the spring stable; long frames (background tabs) are capped.
    let remaining = Math.min(0.064, (now - last) / 1000)
    last = now
    while (remaining > 0) {
      const dt = Math.min(remaining, 1 / 240)
      const acceleration = (-stiffness * (position - to) - damping * speed) / mass
      speed += acceleration * dt
      position += speed * dt
      remaining -= dt
    }
    if (Math.abs(position - to) < 0.02 && Math.abs(speed) < 0.02) {
      onUpdate(to)
      onDone?.()
      return
    }
    onUpdate(position)
    frame = requestAnimationFrame(step)
  }

  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

/** Ease-out (cubic) tween from `from` to `to` over `duration` ms. */
export function tween(from, to, duration, onUpdate, onDone) {
  const start = performance.now()
  let frame = 0

  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration)
    onUpdate(from + (to - from) * (1 - (1 - progress) ** 3))
    if (progress < 1) frame = requestAnimationFrame(step)
    else onDone?.()
  }

  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
