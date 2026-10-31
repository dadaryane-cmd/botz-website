/**
 * One service explained (Services page): what it solves and how we work on the left, what is
 * included on the right, with a quiet link to its prices. No package cards here: prices live
 * on the Pricing page.
 */
import { h } from '../../lib/dom.js'
import { hasText, t, ui } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { heading, lead, section } from './section.js'

export const renderServiceDetail = (config) =>
  section(
    config,
    h(
      'div',
      { class: 'service-detail' },
      h(
        'div',
        { class: 'service-detail-story' },
        heading(config.title),
        lead(config.problem),
        hasText(config.approach) && [
          h('p', { class: 'label' }, ui('servicesPage', 'approachLabel')),
          h('p', null, t(config.approach)),
        ],
      ),
      h(
        'div',
        { class: 'card service-detail-includes', ...reveal(1) },
        h('p', { class: 'label' }, ui('servicesPage', 'includesLabel')),
        h(
          'ul',
          { class: 'check-list' },
          (config.deliverables ?? []).map((text) => h('li', null, t(text))),
        ),
        config.link?.href &&
          h('a', { class: 'link-arrow', href: config.link.href }, t(config.link.label)),
      ),
    ),
  )
