import { h, richText } from '../../lib/dom.js'
import { hasText, t } from '../../lib/i18n.js'
import { renderFlameBackground } from '../flame/flame-background.js'
import { buttonRow, lead } from './section.js'

/**
 * Page title: the headline enters word by word. The home variant fills the first screen with the
 * animated fire and adds the ticker.
 */
export function renderHero(config) {
  const text = h(
    'div',
    { class: 'hero-text' },
    hasText(config.heading) &&
      h('h1', { class: 'heading' }, richText(config.heading, { words: true })),
    lead(config.subheading),
    buttonRow(config.buttons),
  )

  if (config.variant !== 'home') {
    return h('section', { class: 'hero' }, h('div', { class: 'container' }, text))
  }
  return h(
    'section',
    { class: 'hero hero-home' },
    h(
      'div',
      { class: 'hero-stage' },
      renderFlameBackground(),
      h('div', { class: 'container container-wide hero-content' }, text),
    ),
    config.ticker?.length > 0 && ticker(config.ticker),
  )
}

/** Scrolling word strip; the words are repeated once so the loop has no gap. */
function ticker(words) {
  const items = (hidden) =>
    words.map((word) => h('span', { 'aria-hidden': hidden ? 'true' : null }, t(word)))
  return h(
    'div',
    { class: 'ticker' },
    h('div', { class: 'ticker-track' }, items(false), items(true)),
  )
}
