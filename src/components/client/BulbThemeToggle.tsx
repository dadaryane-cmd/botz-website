'use client'
/**
 * <BulbThemeToggle /> — a hanging light bulb with a pull cord.
 * Pull the bead (or click / press Enter or Space) to switch light ↔ dark.
 *
 * Zero dependencies: CSS for idle/hover motion and light effects, plus a tiny
 * spring integrator below for the cord, the dip and the pendulum swing. Only
 * `transform` and `opacity` are animated. Theme state lives on
 * <html data-theme> (set before paint by the head script in the locale layout)
 * and in localStorage under STORAGE_KEY.
 */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from 'react'

/* ───────────────────────── Tunable values ───────────────────────── */
export const BULB_TUNING = {
  STORAGE_KEY: 'botz:theme',
  /** Max visual cord pull in px (rubber-band asymptote). */
  MAX_PULL: 52,
  /** Pull distance (px) past which a release switches the theme. */
  THRESHOLD: 25,
  /** Pointer travel (px) before a press counts as a drag instead of a click. */
  DRAG_SLOP: 4,
  /** Auto-pull on click/keyboard. */
  AUTO_PULL: 35,
  AUTO_PULL_MS: 180,
  /** Bulb dip as a fraction of the pull, and horizontal tilt per px of sideways drag. */
  DIP_RATIO: 0.12,
  TILT_PER_PX: 0.18,
  MAX_TILT_DEG: 10,
  /** Cord snap-back spring (low damping ratio → 2–3 bounces). */
  CORD_STIFFNESS: 400,
  CORD_DAMPING: 12,
  /** Pendulum after the snap: starting angle and spring (≈1.2 s decay). */
  SWING_START_DEG: 8,
  SWING_STIFFNESS: 60,
  SWING_DAMPING: 3.2,
  /** Page reveal durations (ms) for the View Transitions circle. */
  REVEAL_ON_MS: 600,
  REVEAL_OFF_MS: 500,
  /** Fallback crossfade when View Transitions are unavailable. */
  FADE_MS: 300,
  /** How long the turning-on / turning-off light effects stay applied (ms). */
  SWITCH_FX_MS: 700,
  /** "Pull the cord" tip: delay before it appears, how long it stays, and where we remember it was used. */
  HINT_DELAY_MS: 1500,
  HINT_VISIBLE_MS: 8000,
  HINT_KEY: 'botz:bulb-used',
} as const
// Colours, sizes, flicker and glow timings are CSS custom properties: see
// the "Bulb theme toggle" section of src/app/(frontend)/styles.css.

const T = BULB_TUNING
type Theme = 'light' | 'dark'

/* ───────────────────────── Tiny spring ───────────────────────── */
type SpringOpts = {
  from: number
  to: number
  velocity?: number
  stiffness: number
  damping: number
  mass?: number
  onUpdate: (v: number) => void
  onDone?: () => void
}
/** Damped spring integrated per animation frame. Returns a cancel function. */
function spring({ from, to, velocity = 0, stiffness, damping, mass = 1, onUpdate, onDone }: SpringOpts) {
  let x = from
  let v = velocity
  let last = performance.now()
  let raf = 0
  const step = (now: number) => {
    // Sub-step for stability; cap long frames (background tabs).
    let dt = Math.min(0.064, (now - last) / 1000)
    last = now
    while (dt > 0) {
      const h = Math.min(dt, 1 / 240)
      const a = (-stiffness * (x - to) - damping * v) / mass
      v += a * h
      x += v * h
      dt -= h
    }
    if (Math.abs(x - to) < 0.02 && Math.abs(v) < 0.02) {
      onUpdate(to)
      onDone?.()
      return
    }
    onUpdate(x)
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

/** Ease-out tween (used for the automatic pull). */
function tween(from: number, to: number, ms: number, onUpdate: (v: number) => void, onDone: () => void) {
  const start = performance.now()
  let raf = 0
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / ms)
    onUpdate(from + (to - from) * (1 - Math.pow(1 - p, 3)))
    if (p < 1) raf = requestAnimationFrame(step)
    else onDone()
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

/** Rubber-band resistance: follows the finger at first, then stiffens towards MAX_PULL. */
const rubber = (d: number) => T.MAX_PULL * (1 - Math.exp(-Math.max(0, d) / T.MAX_PULL))

/* ───────────────────────── Theme store ───────────────────────── */
const subscribeTheme = (cb: () => void) => {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

const motionAllowed = () =>
  document.documentElement.dataset.motion !== 'off' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

type ViewTransition = { ready: Promise<void>; finished: Promise<void> }
type DocWithVT = Document & { startViewTransition?: (cb: () => void) => ViewTransition }

/** Apply a theme with a circular reveal from (x, y), or a plain fade where unsupported. */
function applyTheme(next: Theme, origin: { x: number; y: number }, animate: boolean) {
  const root = document.documentElement
  const commit = () => {
    root.dataset.theme = next
    try {
      localStorage.setItem(T.STORAGE_KEY, next)
    } catch {
      // private mode: the choice simply isn't remembered
    }
  }
  const doc = document as DocWithVT
  if (!animate) return commit()
  if (!doc.startViewTransition) {
    root.classList.add('theme-fade')
    commit()
    window.setTimeout(() => root.classList.remove('theme-fade'), T.FADE_MS + 50)
    return
  }
  const turningOn = next === 'light'
  root.dataset.vt = turningOn ? 'on' : 'off'
  const vt = doc.startViewTransition(commit)
  vt.ready
    .then(() => {
      const r = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y))
      const small = `circle(0px at ${origin.x}px ${origin.y}px)`
      const big = `circle(${r}px at ${origin.x}px ${origin.y}px)`
      root.animate(
        { clipPath: turningOn ? [small, big] : [big, small] },
        {
          duration: turningOn ? T.REVEAL_ON_MS : T.REVEAL_OFF_MS,
          easing: 'ease-in-out',
          pseudoElement: turningOn ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    })
    .catch(() => undefined)
  vt.finished.finally(() => delete root.dataset.vt)
}

/* ───────────────────────── Component ───────────────────────── */
export function BulbThemeToggle({ labels }: { labels: { toLight: string; toDark: string; theme: string; hint: string } }) {
  // null on the server and during hydration → neutral markup, no mismatch.
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null)

  const rootRef = useRef<HTMLButtonElement>(null)
  const swingRef = useRef<HTMLSpanElement>(null)
  const cordRef = useRef<HTMLSpanElement>(null)
  const beadRef = useRef<HTMLSpanElement>(null)
  const glassRef = useRef<SVGPathElement>(null)

  const state = useRef({ pull: 0, angle: 0, tilt: 0, busy: false })
  const drag = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const cancels = useRef<(() => void)[]>([])

  // First-visit tip. Shown until the visitor has used the bulb once (remembered in localStorage).
  const [hint, setHint] = useState(false)
  useEffect(() => {
    let used = false
    try {
      used = localStorage.getItem(T.HINT_KEY) === '1'
    } catch {
      // storage unavailable: still show the tip
    }
    if (used) return
    const show = window.setTimeout(() => setHint(true), T.HINT_DELAY_MS)
    const hide = window.setTimeout(() => setHint(false), T.HINT_DELAY_MS + T.HINT_VISIBLE_MS)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
  }, [])
  const markUsed = () => {
    setHint(false)
    try {
      localStorage.setItem(T.HINT_KEY, '1')
    } catch {
      // ignore
    }
  }

  /** Write the current pull / angle / tilt straight to the DOM (no React renders). */
  const paint = useCallback(() => {
    const { pull, angle, tilt } = state.current
    if (swingRef.current) swingRef.current.style.transform = `translateY(${pull * T.DIP_RATIO}px) rotate(${angle + tilt}deg)`
    if (cordRef.current) cordRef.current.style.transform = `scaleY(${1 + pull / cordLength(cordRef.current)})`
    if (beadRef.current) beadRef.current.style.transform = `translateY(${pull}px)`
  }, [])

  const stopAll = () => {
    cancels.current.forEach((c) => c())
    cancels.current = []
  }

  const bulbCentre = () => {
    const b = glassRef.current?.getBoundingClientRect()
    return b ? { x: b.left + b.width / 2, y: b.top + b.height * 0.62 } : { x: innerWidth - 60, y: 40 }
  }

  /** Light effects on the bulb itself (flicker on, afterglow off). */
  const lightFx = (next: Theme) => {
    const el = rootRef.current
    if (!el) return
    el.classList.remove('is-turning-on', 'is-turning-off')
    void el.offsetWidth // restart the CSS animations
    el.classList.add(next === 'light' ? 'is-turning-on' : 'is-turning-off')
    window.setTimeout(() => el.classList.remove('is-turning-on', 'is-turning-off'), T.SWITCH_FX_MS)
  }

  const squash = () => {
    const el = rootRef.current
    if (!el) return
    el.classList.remove('is-click')
    void el.offsetWidth
    el.classList.add('is-click')
  }

  /** Let go of the cord: snap back with a bouncy spring; toggle if pulled far enough. */
  const release = useCallback(
    (fromKeyboardOrClick = false) => {
      const s = state.current
      const shouldToggle = s.pull >= T.THRESHOLD
      stopAll()
      cancels.current.push(
        spring({
          from: s.pull,
          to: 0,
          stiffness: T.CORD_STIFFNESS,
          damping: T.CORD_DAMPING,
          onUpdate: (v) => {
            s.pull = v
            paint()
          },
          onDone: () => {
            s.busy = false
          },
        }),
      )
      cancels.current.push(
        spring({
          from: s.tilt,
          to: 0,
          stiffness: T.CORD_STIFFNESS / 2,
          damping: T.CORD_DAMPING,
          onUpdate: (v) => {
            s.tilt = v
            paint()
          },
        }),
      )
      if (!shouldToggle) return
      squash()
      // Pendulum swing after the snap, starting on the side opposite any sideways pull.
      const dir = s.tilt > 0.5 ? -1 : s.tilt < -0.5 ? 1 : fromKeyboardOrClick ? 1 : -1
      cancels.current.push(
        spring({
          from: T.SWING_START_DEG * dir,
          to: 0,
          stiffness: T.SWING_STIFFNESS,
          damping: T.SWING_DAMPING,
          onUpdate: (v) => {
            s.angle = v
            paint()
          },
        }),
      )
      const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
      lightFx(next)
      applyTheme(next, bulbCentre(), true)
    },
    [paint],
  )

  /** Click / Enter / Space: a short automatic pull, then release. */
  const autoToggle = useCallback(() => {
    const s = state.current
    if (s.busy) return
    if (!motionAllowed()) {
      const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
      applyTheme(next, bulbCentre(), false)
      return
    }
    s.busy = true
    stopAll()
    cancels.current.push(
      tween(s.pull, T.AUTO_PULL, T.AUTO_PULL_MS, (v) => {
        s.pull = v
        paint()
      }, () => release(true)),
    )
  }, [paint, release])

  /* Pointer: drag the cord (mouse, touch, pen). A press without travel is a click. */
  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    markUsed()
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dy = e.clientY - d.y
    const dx = e.clientX - d.x
    if (!d.dragging && Math.hypot(dx, dy) < T.DRAG_SLOP) return
    if (!d.dragging) {
      d.dragging = true
      stopAll()
      rootRef.current?.classList.add('is-dragging')
    }
    if (!motionAllowed()) return
    const s = state.current
    s.pull = rubber(dy)
    s.tilt = Math.max(-T.MAX_TILT_DEG, Math.min(T.MAX_TILT_DEG, -dx * T.TILT_PER_PX))
    paint()
  }
  const endPointer = (e: ReactPointerEvent<HTMLButtonElement>, cancelled = false) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    rootRef.current?.classList.remove('is-dragging')
    if (cancelled) return release()
    if (!d.dragging) return autoToggle()
    if (!motionAllowed()) {
      // Reduced motion: a downward drag past the threshold still switches, instantly.
      if (e.clientY - d.y >= T.THRESHOLD) applyTheme(readTheme() === 'dark' ? 'light' : 'dark', bulbCentre(), false)
      return
    }
    release()
  }

  const label = theme === null ? labels.theme : theme === 'dark' ? labels.toLight : labels.toDark

  return (
    <button
      ref={rootRef}
      type="button"
      className="bulb-toggle"
      aria-label={label}
      title={label}
      aria-pressed={theme === null ? undefined : theme === 'light'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => endPointer(e)}
      onPointerCancel={(e) => endPointer(e, true)}
      onClick={(e) => {
        // Pointer clicks are handled in pointerup; detail === 0 means keyboard (Enter / Space).
        if (e.detail === 0) {
          markUsed()
          autoToggle()
        }
      }}
    >
      <span className="bulb-sway" aria-hidden="true">
        <span className="bulb-swing" ref={swingRef}>
          <span className="bulb-halo">
            <span className="bulb-mote" />
            <span className="bulb-mote" />
            <span className="bulb-mote" />
            <span className="bulb-mote" />
          </span>
          <svg className="bulb-svg" viewBox="0 0 40 60" focusable="false">
            <defs>
              <linearGradient id="bulb-cap" x1="0" x2="1">
                <stop offset="0" stopColor="var(--bulb-cap-dark)" />
                <stop offset="0.45" stopColor="var(--bulb-cap-light)" />
                <stop offset="1" stopColor="var(--bulb-cap-dark)" />
              </linearGradient>
              <radialGradient id="bulb-warm" cx="0.5" cy="0.62" r="0.6">
                <stop offset="0" stopColor="var(--bulb-glass-on-core)" />
                <stop offset="1" stopColor="var(--bulb-glass-on-edge)" />
              </radialGradient>
            </defs>
            {/* wire */}
            <line x1="20" y1="0" x2="20" y2="12.5" className="bulb-wire" />
            {/* metal screw base with ridges */}
            <rect x="14" y="12" width="12" height="12" rx="2" fill="url(#bulb-cap)" />
            <path d="M14 15.5h12M14 18.5h12M14 21.5h12" className="bulb-ridges" />
            {/* glass */}
            <path
              ref={glassRef}
              className="bulb-glass"
              d="M15 24C15 30 8 33 8 43a12 12 0 0 0 24 0c0-10-7-13-7-19Z"
            />
            <path className="bulb-glass-on" d="M15 24C15 30 8 33 8 43a12 12 0 0 0 24 0c0-10-7-13-7-19Z" fill="url(#bulb-warm)" />
            {/* filament: supports + coil, dim and hot layers */}
            <path className="bulb-fil-dim" d="M17.5 25v15M22.5 25v15M17.5 40l1-2 1 2 1-2 1 2 1-2" />
            <g className="bulb-fil-hot">
              <path className="bulb-fil-glow" d="M17.5 40l1-2 1 2 1-2 1 2 1-2" />
              <path className="bulb-fil-core" d="M17.5 25v15M22.5 25v15M17.5 40l1-2 1 2 1-2 1 2 1-2" />
            </g>
            {/* glass highlight */}
            <ellipse className="bulb-shine" cx="13.6" cy="40" rx="1.6" ry="4.2" transform="rotate(18 13.6 40)" />
          </svg>
          <span className="bulb-cord" ref={cordRef} />
          <span className="bulb-bead" ref={beadRef}>
            <span className="bulb-bead-lift">
              <span className="bulb-bead-shape" />
            </span>
          </span>
        </span>
      </span>
      <span className={`bulb-hint${hint ? ' is-visible' : ''}`} aria-hidden="true">
        {labels.hint}
        <svg className="bulb-hint-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19c7 0 12-5 13-13M13 7l5-1 1 5" />
        </svg>
      </span>
    </button>
  )
}

/** Cord length in px, read once per element (its CSS height). */
const cordLengths = new WeakMap<HTMLElement, number>()
function cordLength(el: HTMLElement) {
  let l = cordLengths.get(el)
  if (!l) {
    l = el.offsetHeight || 16
    cordLengths.set(el, l)
  }
  return l
}
