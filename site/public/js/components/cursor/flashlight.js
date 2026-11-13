import { createFollower } from './follower.js'

/**
 * In the dark theme the mouse is a flashlight on every page: a little darker away from it, bright
 * around it (a large gradient that follows the mouse, css/components/cursor.css). It shows once
 * the mouse is on the page and hides when it leaves the window. The light theme hides it in CSS,
 * so switching themes needs nothing here.
 */
export function setUpFlashlight() {
  const light = createFollower('cursor-flashlight')
  document.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'mouse') light.show(event)
  })
  document.documentElement.addEventListener('pointerleave', () => light.hide())
}
