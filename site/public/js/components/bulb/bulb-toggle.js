/**
 * Hanging light bulb with a pull cord that switches light ↔ dark.
 * Pull the bead down (mouse, touch, pen), click it, or press Enter / Space.
 *
 * Idle sway, glow and flicker are CSS (css/components/bulb.css); the cord, the dip and the
 * pendulum swing are springs from lib/animation.js. Only transform and opacity are animated.
 */
import { h } from '../../lib/dom.js'
import { prefersReducedMotion, spring, tween } from '../../lib/animation.js'
import { ui } from '../../lib/i18n.js'
import { load, save } from '../../lib/storage.js'
import { getTheme, setTheme } from '../../lib/theme.js'
import { showEasterEgg } from './easter-egg.js'
import { createPullStreak } from './pull-streak.js'

const TUNING = {
  /** Max visual cord pull (px) and how far it must be pulled to switch. */
  maxPull: 52,
  threshold: 25,
  /** Pointer travel (px) before a press counts as a drag instead of a click. */
  dragSlop: 4,
  /** The automatic pull played on click / keyboard. */
  autoPull: 35,
  autoPullMs: 130,
  /** Bulb dip as a share of the pull; tilt per px of sideways drag. */
  dipRatio: 0.12,
  tiltPerPx: 0.18,
  maxTiltDeg: 10,
  /** Cord snap-back: low damping gives 2–3 bounces. */
  cord: { stiffness: 400, damping: 12 },
  /** Pendulum after the snap (about 1.2 s). */
  swing: { startDeg: 8, stiffness: 60, damping: 3.2 },
  /** How long the switching light effects stay applied (ms). */
  switchFxMs: 700,
  /** First-visit "Pull the cord" hint. */
  hintDelayMs: 1500,
  hintVisibleMs: 8000,
  /** Hidden message: this many switches in a row, each within `maxGapMs` of the last. */
  easterEgg: { pulls: 3, maxGapMs: 3000, celebrateMs: 1200 },
}

/** Rubber band: follows the finger at first, then stiffens towards maxPull. */
const rubber = (distance) =>
  TUNING.maxPull * (1 - Math.exp(-Math.max(0, distance) / TUNING.maxPull))

const otherTheme = () => (getTheme() === 'dark' ? 'light' : 'dark')

/* Static drawing (trusted markup): wire, screw base, glass, filament and highlight. */
const BULB_SVG = `
<svg class="bulb-svg" viewBox="0 0 40 60" focusable="false">
  <defs>
    <linearGradient id="bulb-cap" x1="0" x2="1">
      <stop offset="0" stop-color="var(--bulb-cap-dark)" />
      <stop offset="0.45" stop-color="var(--bulb-cap-light)" />
      <stop offset="1" stop-color="var(--bulb-cap-dark)" />
    </linearGradient>
    <radialGradient id="bulb-warm" cx="0.5" cy="0.62" r="0.6">
      <stop offset="0" stop-color="var(--bulb-glass-on-core)" />
      <stop offset="1" stop-color="var(--bulb-glass-on-edge)" />
    </radialGradient>
  </defs>
  <line class="bulb-wire" x1="20" y1="0" x2="20" y2="12.5" />
  <rect x="14" y="12" width="12" height="12" rx="2" fill="url(#bulb-cap)" />
  <path class="bulb-ridges" d="M14 15.5h12M14 18.5h12M14 21.5h12" />
  <path class="bulb-glass" d="M15 24C15 30 8 33 8 43a12 12 0 0 0 24 0c0-10-7-13-7-19Z" />
  <path class="bulb-glass-on" d="M15 24C15 30 8 33 8 43a12 12 0 0 0 24 0c0-10-7-13-7-19Z" fill="url(#bulb-warm)" />
  <path class="bulb-filament-dim" d="M17.5 25v15M22.5 25v15M17.5 40l1-2 1 2 1-2 1 2 1-2" />
  <g class="bulb-filament-hot">
    <path class="bulb-filament-glow" d="M17.5 40l1-2 1 2 1-2 1 2 1-2" />
    <path class="bulb-filament-core" d="M17.5 25v15M22.5 25v15M17.5 40l1-2 1 2 1-2 1 2 1-2" />
  </g>
  <ellipse class="bulb-shine" cx="13.6" cy="40" rx="1.6" ry="4.2" transform="rotate(18 13.6 40)" />
</svg>`

const HINT_ARROW = `
<svg class="bulb-hint-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
  stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c7 0 12-5 13-13M13 7l5-1 1 5" /></svg>`

const fromMarkup = (markup) => {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  return template.content.firstElementChild
}

export function renderBulbToggle() {
  const svg = fromMarkup(BULB_SVG)
  const glass = svg.querySelector('.bulb-glass')
  const cord = h('span', { class: 'bulb-cord' })
  const bead = h(
    'span',
    { class: 'bulb-bead' },
    h('span', { class: 'bulb-bead-lift' }, h('span', { class: 'bulb-bead-shape' })),
  )
  const halo = h(
    'span',
    { class: 'bulb-halo' },
    [1, 2, 3, 4].map(() => h('span', { class: 'bulb-mote' })),
  )
  const swing = h('span', { class: 'bulb-swing' }, halo, svg, cord, bead)
  const tip = h('span', { class: 'bulb-tip', 'aria-hidden': 'true' }, ui('trust', 'themeTooltip'))
  const hint = h(
    'span',
    { class: 'bulb-hint', 'aria-hidden': 'true' },
    ui('common', 'pullHint'),
    fromMarkup(HINT_ARROW),
  )
  const button = h(
    'button',
    { type: 'button', class: 'bulb-toggle' },
    h('span', { class: 'bulb-sway', 'aria-hidden': 'true' }, swing),
    tip,
    hint,
  )

  const state = { pull: 0, angle: 0, tilt: 0, busy: false }
  const countPull = createPullStreak({
    needed: TUNING.easterEgg.pulls,
    maxGapMs: TUNING.easterEgg.maxGapMs,
  })
  let cancels = []
  let drag = null

  /* ---------- drawing ---------- */

  const updateLabel = () => {
    const isLight = getTheme() === 'light'
    button.setAttribute('aria-label', ui('common', isLight ? 'switchToDark' : 'switchToLight'))
    button.setAttribute('aria-pressed', String(isLight))
  }

  function paint() {
    const cordLength = cord.offsetHeight || 16
    swing.style.transform = `translateY(${state.pull * TUNING.dipRatio}px) rotate(${state.angle + state.tilt}deg)`
    cord.style.transform = `scaleY(${1 + state.pull / cordLength})`
    bead.style.transform = `translateY(${state.pull}px)`
  }

  /** Write one animated value and redraw. */
  const setter = (key) => (value) => {
    state[key] = value
    paint()
  }

  const animateValue = (key, options) =>
    cancels.push(spring({ from: state[key], ...options, onUpdate: setter(key) }))

  const stopAll = () => {
    cancels.forEach((cancel) => cancel())
    cancels = []
  }

  /** Restart a CSS effect class (e.g. the flicker) even if it is already applied. */
  function replayClass(className, duration) {
    button.classList.remove(className)
    void button.offsetWidth
    button.classList.add(className)
    if (duration) setTimeout(() => button.classList.remove(className), duration)
  }

  /** Centre of the glass: where the new theme starts spreading from. */
  function bulbCentre() {
    const box = glass.getBoundingClientRect()
    return { x: box.left + box.width / 2, y: box.top + box.height * 0.62 }
  }

  /* ---------- switching ---------- */

  /** Switch light ↔ dark; with `animate: false` (reduced motion) instantly, without light effects. */
  function switchTheme({ animate = true } = {}) {
    const next = otherTheme()
    if (animate) {
      button.classList.remove('is-turning-on', 'is-turning-off')
      // Flicker when the light comes on, afterglow when it goes off.
      replayClass(next === 'light' ? 'is-turning-on' : 'is-turning-off', TUNING.switchFxMs)
      setTheme(next, { origin: bulbCentre() })
    } else {
      setTheme(next, { animate: false })
    }
    updateLabel()

    if (countPull()) {
      if (animate) replayClass('is-celebrating', TUNING.easterEgg.celebrateMs)
      showEasterEgg()
    }
  }

  /** The bulb swings away from any sideways pull; without one, a click swings it right. */
  function swingDirection(fromClick) {
    if (state.tilt > 0.5) return -1
    if (state.tilt < -0.5) return 1
    return fromClick ? 1 : -1
  }

  /** Let go of the cord: snap back; if it was pulled far enough, swing and switch. */
  function release({ fromClick = false, alreadySwitched = false } = {}) {
    const shouldSwitch = state.pull >= TUNING.threshold
    stopAll()
    state.busy = false // the cord can be pulled again while it is still bouncing
    animateValue('pull', { to: 0, ...TUNING.cord })
    animateValue('tilt', {
      to: 0,
      stiffness: TUNING.cord.stiffness / 2,
      damping: TUNING.cord.damping,
    })
    if (!shouldSwitch) return

    replayClass('is-click')
    state.angle = TUNING.swing.startDeg * swingDirection(fromClick)
    animateValue('angle', {
      to: 0,
      stiffness: TUNING.swing.stiffness,
      damping: TUNING.swing.damping,
    })
    if (!alreadySwitched) switchTheme()
  }

  /** Click / Enter / Space: switch at once while a short automatic pull plays. */
  function autoToggle() {
    if (state.busy) return
    if (prefersReducedMotion()) return switchTheme({ animate: false })
    state.busy = true
    stopAll()
    switchTheme()
    const releaseAfterPull = () => release({ fromClick: true, alreadySwitched: true })
    cancels.push(
      tween(state.pull, TUNING.autoPull, TUNING.autoPullMs, setter('pull'), releaseAfterPull),
    )
  }

  /* ---------- first-visit hint ---------- */

  // The hover tooltip stays out of the way while the hint is showing.
  const showHint = (visible) => {
    hint.classList.toggle('is-visible', visible)
    tip.classList.toggle('is-suppressed', visible)
  }
  const markUsed = () => {
    showHint(false)
    save('bulbUsed', true)
  }
  if (!load('bulbUsed')) {
    setTimeout(() => {
      if (!button.isConnected || load('bulbUsed')) return
      showHint(true)
      setTimeout(() => showHint(false), TUNING.hintVisibleMs)
    }, TUNING.hintDelayMs)
  }

  /* ---------- input ---------- */

  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return
    markUsed()
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
    button.setPointerCapture(event.pointerId)
  })

  button.addEventListener('pointermove', (event) => {
    if (drag?.id !== event.pointerId) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.moved && Math.hypot(dx, dy) < TUNING.dragSlop) return
    if (!drag.moved) {
      drag.moved = true
      stopAll()
      button.classList.add('is-dragging')
    }
    if (prefersReducedMotion()) return
    state.pull = rubber(dy)
    state.tilt = Math.max(-TUNING.maxTiltDeg, Math.min(TUNING.maxTiltDeg, -dx * TUNING.tiltPerPx))
    paint()
  })

  const endDrag = (event, cancelled) => {
    if (drag?.id !== event.pointerId) return
    const { moved, y } = drag
    drag = null
    button.classList.remove('is-dragging')
    if (cancelled) return release()
    if (!moved) return autoToggle()
    if (prefersReducedMotion()) {
      // A long enough downward drag still switches, without animation.
      if (event.clientY - y >= TUNING.threshold) switchTheme({ animate: false })
      return
    }
    release()
  }
  button.addEventListener('pointerup', (event) => endDrag(event, false))
  button.addEventListener('pointercancel', (event) => endDrag(event, true))

  // Pointer clicks are handled on pointerup; detail 0 means the keyboard (Enter / Space).
  button.addEventListener('click', (event) => {
    if (event.detail !== 0) return
    markUsed()
    autoToggle()
  })

  updateLabel()
  return button
}
