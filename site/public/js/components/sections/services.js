import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { heading, section } from './section.js'

/** The services as a list of rows: name, what it includes, and a link to its page. */
export const renderServices = (config) =>
  section(
    config,
    heading(config.heading),
    h('ul', { class: 'service-list' }, config.items.map(serviceRow)),
  )

const serviceRow = (item, index) =>
  h(
    'li',
    { class: 'service-row', ...reveal(index) },
    h('h3', null, t(item.title)),
    // A middle dot keeps each item's capital letter readable ("Posts and stories · Meta ads").
    h('p', { class: 'service-includes' }, item.highlights.map((text) => t(text)).join(' · ')),
    item.link?.href && h('a', { class: 'link-arrow', href: item.link.href }, t(item.link.label)),
  )
