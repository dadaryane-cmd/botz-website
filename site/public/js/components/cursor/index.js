import { prefersReducedMotion } from '../../lib/animation.js'
import { currentFile } from '../../lib/page.js'
import { setUpHeadlineFlip } from './headline-flip.js'
import { setUpPriceTip } from './price-tip.js'
import { startSparks } from './sparks.js'

/**
 * The custom cursor's moving parts: the headline flip, the price tip on package cards and, on the
 * home page, sparks. Only with a mouse (phones and tablets have no cursor) and only when the
 * visitor has not asked for less motion. The lamp's hand cursor is pure CSS (bulb.css).
 */
export function setUpCursor() {
  const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (!hasMouse || prefersReducedMotion()) return
  setUpHeadlineFlip()
  setUpPriceTip()
  if (currentFile() === 'index.html') startSparks()
}
