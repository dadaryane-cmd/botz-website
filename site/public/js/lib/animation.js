/** Frame-based animation helpers. Each returns a function that cancels it. */

const SPRING = {
  /** Longest time (s) simulated per frame, so a background tab does not make it jump. */
  maxFrame: 0.064,
  /** Small fixed sub-steps keep the simulation stable. */
  subStep: 1 / 240,
  /** Close enough and slow enough to count as settled. */
  rest: 0.02,
}

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
    let remaining = Math.min(SPRING.maxFrame, (now - last) / 1000)
    last = now
    while (remaining > 0) {
      const dt = Math.min(remaining, SPRING.subStep)
      const acceleration = (-stiffness * (position - to) - damping * speed) / mass
      speed += acceleration * dt
      position += speed * dt
      remaining -= dt
    }
    if (Math.abs(position - to) < SPRING.rest && Math.abs(speed) < SPRING.rest) {
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
    // A frame's time is when the frame began, which can be just before `start`: below zero the
    // ease would run backwards, past `from`.
    const progress = Math.min(1, Math.max(0, (now - start) / duration))
    onUpdate(from + (to - from) * (1 - (1 - progress) ** 3))
    if (progress < 1) frame = requestAnimationFrame(step)
    else onDone?.()
  }

  frame = requestAnimationFrame(step)
  return () => cancelAnimationFrame(frame)
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** The site's ease-out curve (css/base/tokens.css --ease-out), for animations started here. */
const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
const FADE_IN_MS = 200

/**
 * New content in a place that stays on the page (the next finder question, the thank-you
 * message) fades in and settles from a few pixels below, so the change is seen, not missed.
 */
export function fadeIn(element) {
  if (prefersReducedMotion() || !element.animate) return
  element.animate(
    [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: FADE_IN_MS, easing: EASE_OUT },
  )
}
