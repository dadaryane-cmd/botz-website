import { getTheme } from '../../lib/theme.js'
import { createFollower } from './follower.js'

/**
 * In the dark theme the mouse is a flashlight on every page: a warm glow around it, a little
 * darker further away (a large gradient that follows the mouse, css/components/cursor.css). It
 * shows once the mouse is on the page and hides when it leaves the window. In the light theme it
 * is switched off, so it follows nothing there; after switching back, it returns as soon as the
 * mouse moves on to another element.
 */
export function setUpFlashlight() {
  const light = createFollower('cursor-flashlight')
  document.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'mouse' && getTheme() === 'dark') light.show(event)
  })
  document.documentElement.addEventListener('pointerleave', () => light.hide())
  new MutationObserver(() => {
    if (getTheme() !== 'dark') light.hide()
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}
