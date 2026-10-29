import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { heading, section } from './section.js'

export const renderServices = (config) =>
  section(
    config,
    heading(config.heading),
    h('div', { class: 'grid services-grid' }, config.items.map(serviceCard)),
  )

const serviceCard = (item, index) =>
  h(
    'article',
    { class: 'card service-card', ...reveal(index) },
    h('span', { class: 'index' }, item.index),
    h('h3', null, t(item.title)),
    h(
      'ul',
      { class: 'chips' },
      item.highlights.map((text) => h('li', null, t(text))),
    ),
    item.link?.href && h('a', { class: 'link-arrow', href: item.link.href }, t(item.link.label)),
  )
