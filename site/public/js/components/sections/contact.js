/** Contact section: the founders, direct contacts and the inquiry form. */
import { people, site } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
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

/** Who handles what: each founder's role says it, so the cards need nothing else. */
const founders = () =>
  h(
    'div',
    { class: 'people' },
    people.map((person) => personCard(person)),
  )

/** One shared phone, WhatsApp and email for the whole team. */
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
  )
}
