import { createFollower } from './follower.js'

/** Only the large headlines: on body text the flip would only make reading harder. */
const HEADLINES = '.heading'

/**
 * Over a headline, a circle follows the mouse and flips the colours beneath it
 * (mix-blend-mode: difference, css/components/cursor.css).
 */
export function setUpHeadlineFlip() {
  const circle = createFollower('cursor-flip')
  document.addEventListener('pointerover', (event) => {
    const overHeadline = event.pointerType === 'mouse' && event.target.closest(HEADLINES)
    if (overHeadline) circle.show(event)
    else circle.hide()
  })
  // Leaving the window: no pointerover follows.
  document.documentElement.addEventListener('pointerleave', () => circle.hide())
}
