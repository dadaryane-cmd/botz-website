/**
 * Scroll reveals: cards and rows marked with `REVEAL` fade up slightly as they approach the
 * viewport, all together (css/base/reveal.css). Headings and text are never hidden: they are
 * there to be read at once. Content is only hidden once this has run, so it stays visible if
 * JavaScript fails; anything already on screen is shown at once and never blinks.
 */
import { prefersReducedMotion } from './animation.js'

/** Attributes for a revealed card or row. */
export const REVEAL = Object.freeze({ 'data-reveal': true })

let observer = null

export function startReveals() {
  observer?.disconnect()
  const root = document.documentElement
  const pending = [...document.querySelectorAll('[data-reveal]:not(.is-in)')]
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    pending.forEach((element) => element.classList.add('is-in'))
    return
  }

  // Positions come from the observer, measured with the browser's own layout: reading them here
  // would force an extra layout of the whole page before the first paint. Until its first report
  // nothing is hidden (no `reveal-ready`), so what is on screen never fades in or blinks.
  root.classList.remove('reveal-ready')
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // In view, nearly (rootMargin), or already scrolled past (e.g. opened at #contact).
        const show = entry.isIntersecting || entry.boundingClientRect.top < 0
        if (!show) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
      root.classList.add('reveal-ready')
    },
    // Start a little before the element scrolls into view.
    { rootMargin: '0px 0px 15% 0px' },
  )
  pending.forEach((element) => observer.observe(element))
}
