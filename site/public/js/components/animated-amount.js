/**
 * An amount that counts to its new value when it changes (e.g. switching contract length).
 * The pricing tool re-renders on every change, so the last shown value is remembered by `key`.
 * Screen readers always get the final value; with reduced motion or a hidden tab it just updates.
 */
import { prefersReducedMotion, tween } from '../lib/animation.js'
import { h } from '../lib/dom.js'
import { formatAmd } from '../lib/format.js'

const DURATION_MS = 520
const lastShown = new Map()

export function animatedAmount(key, value, format = formatAmd) {
  const previous = lastShown.get(key)
  lastShown.set(key, value)

  const visible = h('span', { 'aria-hidden': 'true' }, format(value))
  const amount = h(
    'span',
    { class: 'amount' },
    visible,
    h('span', { class: 'sr-only' }, format(value)),
  )
  const unchanged = previous === undefined || previous === value
  if (unchanged || prefersReducedMotion() || document.hidden) {
    return amount
  }

  const show = (shown) => {
    visible.textContent = format(Math.round(shown))
  }
  show(previous)
  const cancel = tween(previous, value, DURATION_MS, show)
  // Frames can be paused (background tab): never leave a stale price on screen.
  setTimeout(() => {
    cancel()
    show(value)
  }, DURATION_MS + 80)
  return amount
}
