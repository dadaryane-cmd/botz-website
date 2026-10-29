import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { heading, lead, section } from './section.js'

export const renderTeam = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    h(
      'div',
      { class: 'grid grid-2' },
      config.founders.map((founder, index) => personCard(founder, [], reveal(index))),
    ),
  )

/** Avatar initial, name and role, followed by optional `extra` content (used by the contact section). */
export const personCard = (person, extra = [], attributes = {}) =>
  h(
    'article',
    { class: 'card person-card', ...attributes },
    h('span', { class: 'avatar', 'aria-hidden': 'true' }, t(person.name).charAt(0)),
    h(
      'div',
      null,
      h('h3', null, t(person.name)),
      h('p', { class: 'muted' }, t(person.role)),
      extra,
    ),
  )
