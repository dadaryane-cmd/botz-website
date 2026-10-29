import { h } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { buttonRow, heading, lead } from './section.js'

/** Page title. The home variant adds the flame background, the offer card and the ticker. */
export function renderHero(config) {
  const isHome = config.variant === 'home'
  return h(
    'section',
    { class: isHome ? 'hero hero-home' : 'hero' },
    isHome && h('div', { class: 'hero-flame', 'aria-hidden': 'true' }),
    h(
      'div',
      { class: 'container container-wide hero-grid' },
      h(
        'div',
        { class: 'hero-text' },
        heading(config.heading, 'h1'),
        lead(config.subheading),
        buttonRow(config.buttons),
      ),
      config.offerCard && offerCard(),
    ),
    config.ticker && ticker(config.ticker),
  )
}

function offerCard() {
  return h(
    'aside',
    { class: 'card offer-card' },
    h('img', { class: 'offer-mark', src: 'images/botz-mark.webp', alt: '', width: 48, height: 74 }),
    h('p', { class: 'badge' }, ui('trust', 'offerBadge')),
    h(
      'ul',
      { class: 'check-list' },
      h('li', null, ui('trust', 'auditNote')),
      h('li', null, ui('trust', 'trialNote')),
    ),
    h('a', { class: 'btn btn-primary', href: '#contact' }, ui('trust', 'offerCta')),
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
