/**
 * Contact section, quickest way first: three large buttons (WhatsApp, call, Instagram), then a
 * short form for those who would rather be contacted, and beside it the founders, the email,
 * the opening hours and what happens next.
 */
import { people, site } from '../../content/index.js'
import { fromMarkup, h } from '../../lib/dom.js'
import { hasText, t, ui } from '../../lib/i18n.js'
import { emailHref, external, phoneHref } from '../../lib/links.js'
import { profileHandle, profileOf } from '../../lib/social.js'
import { renderInquiryForm } from '../inquiry-form.js'
import { networkIcon } from '../layout/social-links.js'
import { whatsappIcon, whatsappLinkAttributes } from '../whatsapp-link.js'
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
  clock: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12"
    r="9" /><path d="M12 7v5l3 2" /></svg>`,
}

export const renderContact = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    quickContacts(),
    h(
      'div',
      { class: 'contact-layout' },
      // On phones the form comes first (css/components/contact.css).
      h('div', { class: 'contact-details' }, founders(), directContacts(), nextSteps()),
      renderInquiryForm({ service: config.service }),
    ),
  )

/** One tap to reach us: WhatsApp, a call, and Instagram once its link is in site.json. */
function quickContacts() {
  const instagram = profileOf(site.social, 'instagram')
  return h(
    'ul',
    { class: 'quick-contacts' },
    quickContact(
      { class: 'is-primary', ...whatsappLinkAttributes() },
      whatsappIcon(),
      ui('contact', 'whatsapp'),
      ui('contact', 'whatsappHint'),
    ),
    quickContact(
      { href: phoneHref },
      fromMarkup(ICON.phone),
      ui('contact', 'call'),
      site.phoneDisplay,
    ),
    instagram &&
      quickContact(
        { href: instagram.url, ...external },
        networkIcon('instagram'),
        'Instagram',
        profileHandle(instagram.url),
      ),
  )
}

/** A large button: icon, what it does and, under it, the number or name it opens. */
const quickContact = (attributes, icon, title, detail) =>
  h(
    'li',
    null,
    h(
      'a',
      { ...attributes, class: ['quick-contact', attributes.class].filter(Boolean).join(' ') },
      h('span', { class: 'quick-contact-icon', 'aria-hidden': 'true' }, icon),
      h('strong', null, title),
      h('span', { class: 'quick-contact-detail' }, detail),
    ),
  )

/** Who handles what: each founder's role says it, so the cards need nothing else. */
const founders = () =>
  h(
    'div',
    { class: 'people' },
    people.map((person) => personCard(person)),
  )

/** The email (with a copy button) and the opening hours; the phone is in the buttons above. */
function directContacts() {
  return h(
    'ul',
    { class: 'direct-contacts' },
    contactRow(ICON.email, ui('contact', 'email'), h('a', { href: emailHref }, site.email), [
      copyButton(site.email),
    ]),
    hasText(site.hours) &&
      contactRow(
        ICON.clock,
        ui('contact', 'hoursLabel'),
        h('span', null, [site.location, site.hours].filter(hasText).map(t).join(' · ')),
      ),
  )
}

function contactRow(icon, label, value, actions = []) {
  return h(
    'li',
    { class: 'contact-row' },
    h('span', { class: 'contact-icon', 'aria-hidden': 'true' }, fromMarkup(icon)),
    h('span', { class: 'contact-value' }, h('span', { class: 'label' }, label), value),
    actions.length > 0 && h('span', { class: 'contact-actions' }, actions),
  )
}

/** What happens after sending: knowing the next steps makes it easier to send. */
const nextSteps = () =>
  h(
    'div',
    { class: 'next-steps' },
    h('p', { class: 'label' }, ui('contact', 'nextTitle')),
    h(
      'ol',
      null,
      ['nextReply', 'nextCall', 'nextProposal'].map((key) => h('li', null, ui('contact', key))),
    ),
  )

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
