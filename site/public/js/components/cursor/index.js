import { prefersReducedMotion } from '../../lib/animation.js'
import { setUpPriceTip } from './price-tip.js'
import { setUpTextLight } from './text-light.js'

/**
 * The custom cursor's parts: the light on big text (dark theme, every page) and the price tip on
 * package cards. Only with a mouse (phones and tablets have no cursor) and only when
 * the visitor has not asked for less motion.
 */
export function setUpCursor() {
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!hasMouse || prefersReducedMotion()) return
  setUpTextLight()
  setUpPriceTip()
}
