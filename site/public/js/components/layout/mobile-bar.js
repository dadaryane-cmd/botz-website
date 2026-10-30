import { h } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { external, phoneHref, whatsappHref } from '../../lib/links.js'

/** Call / WhatsApp buttons pinned to the bottom of small screens. */
export function renderMobileBar(bar) {
  bar.replaceChildren(
    h('a', { href: phoneHref }, ui('contact', 'call')),
    h('a', { href: whatsappHref(), ...external }, ui('contact', 'whatsapp')),
  )
}
