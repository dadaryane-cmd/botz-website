/** How far the page scrolls before the header gets compact (css/layout/header.css). */
const COMPACT_AFTER_PX = 24

/**
 * The header is full at the top of the page and compact (a shorter row, a smaller logo) once the
 * page is scrolled. Its place in the page stays the same (header.css), so nothing below moves.
 * Attached once; survives re-renders of the header.
 */
export function setUpCompactHeader(header) {
  const update = () => header.classList.toggle('is-compact', window.scrollY > COMPACT_AFTER_PX)
  update()
  window.addEventListener('scroll', update, { passive: true })
}
