/**
 * The founders, from content/people.json: on the About page a large card each (photo or
 * initial, name, role and bio); in the contact section a compact card.
 */
import { people } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { hasText, t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { picture } from '../picture.js'
import { heading, lead, section } from './section.js'

/**
 * The founders. Variant "compact" (home page): photo, name and role only, with a link to the
 * full cards on the About page.
 */
export function renderTeam(config) {
  const compact = config.variant === 'compact'
  const card = compact
    ? (person, index) => personCard(person, reveal(index))
    : (person, index) => founderCard(person, index)
  return section(
    config,
    heading(config.heading),
    lead(config.intro),
    h('div', { class: 'grid grid-2 founders' }, people.map(card)),
    config.link?.href &&
      h('a', { class: 'link-arrow founders-link', href: config.link.href }, t(config.link.label)),
  )
}

/** The photo (AVIF when there is one, else WebP/JPEG) or, without a photo, the first letter. */
const portrait = (person, className) =>
  person.photo
    ? picture({
        class: `${className} has-photo`,
        src: person.photo,
        avif: person.photoAvif,
        alt: '',
      })
    : h('span', { class: className, 'aria-hidden': 'true' }, t(person.name).charAt(0))

function founderCard(person, index) {
  return h(
    'article',
    { class: 'card founder-card', ...reveal(index) },
    portrait(person, 'avatar avatar-large'),
    h('h3', null, t(person.name)),
    h('p', { class: 'founder-role' }, t(person.role)),
    hasText(person.bio) && h('p', { class: 'muted' }, t(person.bio)),
  )
}

/** Avatar, name and role (contact section). */
export const personCard = (person, attributes = {}) =>
  h(
    'article',
    { class: 'card person-card', ...attributes },
    portrait(person, 'avatar'),
    h('div', null, h('h3', null, t(person.name)), h('p', { class: 'muted' }, t(person.role))),
  )
