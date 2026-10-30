import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { teamLine } from '../team-line.js'
import { heading, lead, section } from './section.js'

/**
 * The services as rows on one shared grid (css/components/services.css): the name and who does
 * it, what it includes, and an arrow. The whole row links to the service's page or section.
 */
export const renderServices = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    h('ul', { class: 'service-list' }, config.items.map(serviceRow)),
  )

function serviceRow(item, index) {
  const content = [
    h('div', { class: 'service-name' }, h('h3', null, t(item.title)), teamLine(item.service)),
    // A middle dot keeps each item's capital letter readable ("Posts and stories · Meta ads").
    h('p', { class: 'service-includes' }, item.highlights.map((text) => t(text)).join(' · ')),
    h('span', { class: 'service-arrow', 'aria-hidden': 'true' }, '→'),
  ]
  const row = item.link?.href
    ? h('a', { class: 'service-row', href: item.link.href }, content)
    : h('div', { class: 'service-row' }, content)
  return h('li', reveal(index), row)
}
