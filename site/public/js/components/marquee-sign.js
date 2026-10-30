/**
 * Cinema announcement banner (section type `sign`): a compact lit letter board with a headline
 * and a tagline, framed by chasing bulbs (css/components/marquee-sign.css). When it scrolls into
 * view it powers on: the bulbs flicker, the board lights up and the letters are put up one by one.
 */
import { prefersReducedMotion } from '../lib/animation.js'
import { h } from '../lib/dom.js'
import { hasText, t } from '../lib/i18n.js'
import { boardLines, splitWords } from '../lib/letters.js'

/** Shared, so a re-render (e.g. language change) replaces the previous sign's observer. */
let observer = null

export function renderMarqueeSign({ title, tagline }) {
  if (!hasText(title)) return null
  const titleText = t(title)
  const taglineText = t(tagline)

  // One running number across the whole board staggers the letters.
  let index = 0
  const letterSpan = (letter) =>
    h('span', { class: 'sign-letter', style: `--i: ${index++}` }, letter)
  const wordSpan = (letters) => h('span', { class: 'sign-word' }, letters.map(letterSpan))
  /** Words with plain spaces between them, so lines only break between words. */
  const lineText = (line) =>
    splitWords(line).map((letters, position) => [position > 0 && ' ', wordSpan(letters)])
  /** Each line of the text (a line break in the editor) is its own row of the board. */
  const boardRows = (text, className) =>
    boardLines(text).map((line) => h('p', { class: className }, lineText(line)))

  const board = h(
    'div',
    { class: 'sign-board', 'aria-hidden': 'true' },
    boardRows(titleText, 'sign-title'),
    boardRows(taglineText, 'sign-tagline'),
  )
  const sign = h(
    'div',
    { class: 'marquee-sign' },
    // Screen readers get the words, not single letters.
    h('p', { class: 'sr-only' }, [...boardLines(titleText), ...boardLines(taglineText)].join(' ')),
    h(
      'div',
      { class: 'sign-frame' },
      h('span', { class: 'sign-bulbs', 'aria-hidden': 'true' }),
      board,
      h('span', { class: 'sign-bulbs', 'aria-hidden': 'true' }),
    ),
  )
  powerOnWhenSeen(sign)
  return sign
}

/** Light the sign once most of it is on screen. */
function powerOnWhenSeen(sign) {
  observer?.disconnect()
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    sign.classList.add('is-lit')
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      sign.classList.add('is-lit')
      observer.disconnect()
    },
    { threshold: 0.6 },
  )
  observer.observe(sign)
}
