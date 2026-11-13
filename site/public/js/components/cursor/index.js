import { prefersReducedMotion } from '../../lib/animation.js'
import { setUpFlashlight } from './flashlight.js'
import { setUpPriceTip } from './price-tip.js'

/**
 * The custom cursor's moving parts: the flashlight (dark theme, every page) and the price tip on
 * package cards. Only with a mouse (phones and tablets have no cursor) and only when
 * the visitor has not asked for less motion. The lamp's hand cursor is pure CSS (bulb.css).
 */
export function setUpCursor() {
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!hasMouse || prefersReducedMotion()) return
  setUpFlashlight()
  setUpPriceTip()
}
