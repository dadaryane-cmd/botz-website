/**
 * Light/dark theme on <html data-theme>. theme-init.js sets it before first paint (the saved
 * choice, else dark); a choice made with the lamp is saved and wins from then on.
 */
import { save } from './storage.js'

const root = document.documentElement

const REVEAL = {
  onMs: 640,
  offMs: 560,
  /** Light spreads quickly and settles gently; darkness gathers, then closes into the bulb. */
  onEasing: 'cubic-bezier(0.33, 1, 0.68, 1)',
  offEasing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  /** Soft edge of the reveal circle, as a share of its radius, capped in px. A narrow edge
   * keeps the two themes from mixing into a grey band. */
  feather: 0.1,
  featherMax: 120,
  /** Crossfade used where View Transitions are not supported. */
  fadeMs: 300,
}

export const getTheme = () => (root.dataset.theme === 'dark' ? 'dark' : 'light')

/** True while the new theme is spreading from the bulb (a view transition is running). */
export const isThemeChanging = () => 'vt' in root.dataset

/**
 * Switch to `theme`. With `origin` ({ x, y } in viewport px) the new theme spreads from that point
 * as a circle (View Transitions API); otherwise, or where unsupported, colours crossfade.
 */
export function setTheme(theme, { origin, animate = true } = {}) {
  const commit = () => {
    root.dataset.theme = theme
    save('theme', theme)
  }
  if (!animate) {
    commit()
  } else if (document.startViewTransition && origin) {
    revealFrom(origin, theme === 'light', commit)
  } else {
    crossfade(commit)
  }
}

function crossfade(commit) {
  root.classList.add('theme-fade')
  commit()
  setTimeout(() => root.classList.remove('theme-fade'), REVEAL.fadeMs + 50)
}

/** Light grows out of the origin when turning on; darkness closes into it when turning off. */
function revealFrom({ x, y }, turningOn, commit) {
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const feather = Math.round(Math.min(REVEAL.featherMax, radius * REVEAL.feather))
  // A soft edge needs an animatable custom property (@property); otherwise use a crisp clip-path.
  const soft = 'registerProperty' in CSS

  root.dataset.vt = turningOn ? 'on' : 'off'
  if (soft) {
    root.dataset.vtSoft = ''
    root.style.setProperty('--vt-x', `${x}px`)
    root.style.setProperty('--vt-y', `${y}px`)
    root.style.setProperty('--vt-feather', `${feather}px`)
  }

  const transition = document.startViewTransition(commit)
  transition.ready
    .then(() => {
      const options = {
        duration: turningOn ? REVEAL.onMs : REVEAL.offMs,
        easing: turningOn ? REVEAL.onEasing : REVEAL.offEasing,
        fill: 'both',
        pseudoElement: turningOn ? '::view-transition-new(root)' : '::view-transition-old(root)',
      }
      const [small, large] = soft
        ? ['0px', `${radius + feather}px`]
        : [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
      const frames = turningOn ? [small, large] : [large, small]
      root.animate(soft ? { '--vt-r': frames } : { clipPath: frames }, options)
    })
    // The browser may skip the transition (e.g. the tab is hidden); the theme still changes.
    .catch(() => {})
  transition.finished.finally(() => {
    delete root.dataset.vt
    delete root.dataset.vtSoft
    for (const property of ['--vt-x', '--vt-y', '--vt-feather']) {
      root.style.removeProperty(property)
    }
  })
}
