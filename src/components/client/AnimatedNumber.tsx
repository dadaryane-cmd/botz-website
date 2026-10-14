'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Smoothly tweens between numbers. Screen readers always get the final value,
 * animation is skipped when motion is off/reduced or the tab is hidden, and a
 * timer guarantees the final value is shown even if animation frames are
 * paused — a price on screen is never left stale.
 */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [tween, setTween] = useState<{ target: number; shown: number } | null>(null)
  const from = useRef(value)

  useEffect(() => {
    const start = from.current
    from.current = value
    const motion = document.documentElement.dataset.motion
    if (motion === 'off' || document.hidden || start === value) return
    const t0 = performance.now()
    const dur = motion === 'subtle' ? 260 : 520
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setTween(p < 1 ? { target: value, shown: Math.round(start + (value - start) * e) } : null)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const done = window.setTimeout(() => setTween(null), dur + 80)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(done)
    }
  }, [value])

  // Only show an in-between number while it belongs to the current target.
  const shown = tween && tween.target === value ? tween.shown : value
  return (
    <>
      <span aria-hidden="true">{format(shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}
