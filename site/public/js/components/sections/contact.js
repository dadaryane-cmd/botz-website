/** Contact section: the founders, direct contacts and the inquiry form. */
import { people } from '../../content/people.js'
import { site } from '../../content/site.js'
import { h } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { emailHref, external, phoneHref, whatsappHref } from '../../lib/links.js'
import { renderInquiryForm } from '../inquiry-form.js'
import { heading, lead, section } from './section.js'
import { personCard } from './team.js'

export const renderContact = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    h(
      'div',
      { class: 'contact-layout' },
      h('div', null, founders(), directContacts()),
      renderInquiryForm({ service: config.service }),
    ),
  )

function founders() {
  return h(
    'div',
    { class: 'people' },
    people.map((person) => {
      const services = person.services
        .filter((service) => service !== 'addon' && service !== 'bundle')
        .map((service) => ui('services', service))
        .join(', ')
      const greeting = ui('whatsapp', 'greeting', { contact: t(person.name) })
      return personCard(person, [
        h('p', { class: 'small' }, ui('contact', 'handles', { services })),
        h(
          'div',
          { class: 'btn-row' },
          h('a', { class: 'btn btn-secondary btn-small', href: phoneHref }, ui('contact', 'call')),
          h(
            'a',
            { class: 'btn btn-secondary btn-small', href: whatsappHref(greeting), ...external },
            ui('contact', 'whatsapp'),
          ),
        ),
      ])
    }),
    h('p', { class: 'muted small' }, ui('contact', 'eitherContact')),
  )
}

function directContacts() {
  const item = (label, link) => h('li', null, h('span', { class: 'label' }, label), link)
  return h(
    'ul',
    { class: 'direct-contacts' },
    item(ui('contact', 'phoneLabel'), h('a', { href: phoneHref }, site.phoneDisplay)),
    item(
      ui('contact', 'whatsapp'),
      h('a', { href: whatsappHref(), ...external }, site.phoneDisplay),
    ),
    item(ui('contact', 'email'), h('a', { href: emailHref }, site.email)),
    h('li', { class: 'muted small' }, ui('contact', 'sharedLine')),
  )
}
