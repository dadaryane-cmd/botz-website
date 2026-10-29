/**
 * Scroll reveals: elements marked with `reveal(n)` fade up as they approach the viewport,
 * staggered by `n` (css/base/reveal.css). Content is only hidden once this has run, so it stays
 * visible if JavaScript fails; anything already on screen is shown at once and never blinks.
 */
import { prefersReducedMotion } from './animation.js'

/** Attributes for a revealed element; `order` staggers siblings (capped in CSS). */
export const reveal = (order = 0) => ({ 'data-reveal': true, style: `--reveal-order: ${order}` })

let observer = null

export function startReveals() {
  observer?.disconnect()
  const root = document.documentElement
  const pending = [...document.querySelectorAll('[data-reveal]:not(.is-in)')]
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    pending.forEach((element) => element.classList.add('is-in'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    },
    // Start a little before the element scrolls into view.
    { rootMargin: '0px 0px 15% 0px' },
  )

  // On screen, nearly on screen, or already scrolled past (e.g. opened at #contact): show at once.
  const nearlyVisible = window.innerHeight * 1.15
  for (const element of pending) {
    if (element.getBoundingClientRect().top < nearlyVisible) element.classList.add('is-in')
    else observer.observe(element)
  }
  root.classList.add('reveal-ready')
}
