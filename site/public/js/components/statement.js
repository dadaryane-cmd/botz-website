/**
 * A statement that lights up (section type `sign`): a large headline and a tagline whose words
 * brighten one after another as the section scrolls into view, with a warm glow behind them like
 * the header's lamp (css/components/statement.css). Scrolling back dims them again. Visitors who
 * ask for less motion see it fully lit.
 */
import { prefersReducedMotion } from '../lib/animation.js'
import { h } from '../lib/dom.js'
import { hasText, t } from '../lib/i18n.js'
import { textLines, textWords } from '../lib/letters.js'
import { litWords, revealProgress } from '../lib/scroll-progress.js'
import { section } from './sections/section.js'

/** Stops the previous statement's listeners when the page is drawn again (a language change). */
let stopPrevious = null

export function renderStatement({ title, tagline, ...layout }) {
  if (!hasText(title)) return null

  // One running number across headline and tagline: the order in which the words light up.
  let count = 0
  const word = (text) => h('span', { class: 'statement-word', style: `--i: ${count++}` }, text)
  /** Each line typed in the editor stays a line; words keep plain spaces between them. */
  const line = (text) =>
    h(
      'span',
      { class: 'statement-line' },
      textWords(text).map((part, position) => [position > 0 && ' ', word(part)]),
    )

  const statement = h(
    'div',
    { class: 'statement' },
    h('h2', { class: 'statement-title' }, textLines(t(title)).map(line)),
    hasText(tagline) && h('p', { class: 'statement-tagline' }, textLines(t(tagline)).map(line)),
  )
  lightUpOnScroll(statement, count)
  return section(layout, statement)
}

/**
 * Sets --progress (0–1) and --lit (words lit) on the statement while it is near the screen, once
 * per frame at most; the CSS turns them into each word's brightness and the glow.
 */
function lightUpOnScroll(statement, count) {
  stopPrevious?.()
  const show = (progress) => {
    statement.style.setProperty('--progress', progress.toFixed(3))
    statement.style.setProperty('--lit', litWords(progress, count).toFixed(2))
  }
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    show(1)
    return
  }

  let frame = 0
  const update = () => {
    frame = 0
    if (!statement.isConnected) {
      stopPrevious?.()
      return
    }
    show(revealProgress(statement.getBoundingClientRect(), innerHeight))
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }
  const listen = (isNear) => {
    const method = isNear ? 'addEventListener' : 'removeEventListener'
    window[method]('scroll', schedule, { passive: true })
    window[method]('resize', schedule)
    if (isNear) schedule()
  }
  // Listen to scrolling only while the statement is on or near the screen.
  const observer = new IntersectionObserver((entries) => listen(entries[0].isIntersecting), {
    rootMargin: '20% 0px',
  })
  observer.observe(statement)
  show(0)

  stopPrevious = () => {
    observer.disconnect()
    listen(false)
    cancelAnimationFrame(frame)
    stopPrevious = null
  }
}
