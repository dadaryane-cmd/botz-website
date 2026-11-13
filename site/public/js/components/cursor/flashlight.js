import { createFollower } from './follower.js'

/** The tops of pages (the headline, and the fire on the home page): never the text below. */
const LIT_AREAS = '.hero'

/**
 * In the dark theme, over the top of a page, the mouse is a flashlight: a little darker away from
 * it, bright around it (a large gradient that follows the mouse, css/components/cursor.css).
 * The light theme hides it in CSS, so switching themes needs nothing here.
 */
export function setUpFlashlight() {
  const light = createFollower('cursor-flashlight')
  document.addEventListener('pointerover', (event) => {
    const overLitArea = event.pointerType === 'mouse' && event.target.closest(LIT_AREAS)
    if (overLitArea) light.show(event)
    else light.hide()
  })
  // Leaving the window: no pointerover follows.
  document.documentElement.addEventListener('pointerleave', () => light.hide())
}
