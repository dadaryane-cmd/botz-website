/** Contact section: the inquiry form, the founders and the direct contacts. */
import { people, site } from '../../content/index.js'
import { fromMarkup, h } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { emailHref, external, phoneHref, whatsappHref } from '../../lib/links.js'
import { renderInquiryForm } from '../inquiry-form.js'
import { heading, lead, section } from './section.js'
import { personCard } from './team.js'

const COPIED_MS = 2000

/* Static icons (trusted markup), drawn with the text colour. */
const ICON = {
  phone: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path
    d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>`,
  email: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18"
    height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>`,
}

export const renderContact = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    h(
      'div',
      { class: 'contact-layout' },
      // On phones the form comes first (css/components/contact.css); the bottom bar already calls.
      h('div', { class: 'contact-details' }, founders(), directContacts()),
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

/** One shared number (call or WhatsApp) and the email, each with its actions. */
function directContacts() {
  return h(
    'ul',
    { class: 'direct-contacts' },
    contactRow(
      ICON.phone,
      ui('contact', 'phoneAndWhatsapp'),
      h('strong', null, site.phoneDisplay),
      [
        h('a', { class: 'btn btn-secondary btn-small', href: phoneHref }, ui('contact', 'call')),
        h(
          'a',
          { class: 'btn btn-secondary btn-small', href: whatsappHref(), ...external },
          ui('contact', 'whatsapp'),
        ),
      ],
    ),
    contactRow(ICON.email, ui('contact', 'email'), h('a', { href: emailHref }, site.email), [
      copyButton(site.email),
    ]),
  )
}

function contactRow(icon, label, value, actions) {
  return h(
    'li',
    { class: 'contact-row' },
    h('span', { class: 'contact-icon', 'aria-hidden': 'true' }, fromMarkup(icon)),
    h('span', { class: 'contact-value' }, h('span', { class: 'label' }, label), value),
    h('span', { class: 'contact-actions' }, actions),
  )
}

/** Copies the text and says so for a moment; where copying is blocked, shows it to copy by hand. */
function copyButton(text) {
  const button = h(
    'button',
    { type: 'button', class: 'btn btn-secondary btn-small', onclick: copy },
    ui('contact', 'copy'),
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      button.textContent = ui('contact', 'copied')
      setTimeout(() => {
        button.textContent = ui('contact', 'copy')
      }, COPIED_MS)
    } catch {
      window.prompt(ui('contact', 'email'), text)
    }
  }

  return button
}
