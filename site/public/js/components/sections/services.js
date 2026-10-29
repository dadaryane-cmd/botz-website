import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { heading, section } from './section.js'

export const renderServices = (config) =>
  section(
    config,
    heading(config.heading),
    h('div', { class: 'grid services-grid' }, config.items.map(serviceCard)),
  )

const serviceCard = (item) =>
  h(
    'article',
    { class: 'card service-card' },
    h('span', { class: 'index' }, item.index),
    h('h3', null, t(item.title)),
    h('p', null, t(item.text)),
    h(
      'ul',
      { class: 'chips' },
      item.highlights.map((text) => h('li', null, t(text))),
    ),
    h('a', { class: 'link-arrow', href: item.link.href }, t(item.link.label)),
  )
