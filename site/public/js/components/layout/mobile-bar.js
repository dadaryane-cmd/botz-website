import { h } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { external, phoneHref, whatsappHref } from '../../lib/links.js'

/** Sections that already offer calling and WhatsApp: while one is on screen, the bar steps aside. */
const OWN_CONTACTS = '.contact-layout, .site-footer'

/** Shared, so a re-render (language change) replaces the previous observer. */
let observer = null

/**
 * Call / WhatsApp buttons pinned to the bottom of small screens. It also hides while a form field
 * is focused or the pricing tool shows its own bar (css/layout/mobile-bar.css).
 */
export function renderMobileBar(bar) {
  bar.replaceChildren(
    h('a', { href: phoneHref }, ui('contact', 'call')),
    h('a', { href: whatsappHref(), ...external }, ui('contact', 'whatsapp')),
  )
  hideNearOwnContacts(bar)
}

function hideNearOwnContacts(bar) {
  observer?.disconnect()
  if (!('IntersectionObserver' in window)) return
  const visible = new Set()
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target)
      else visible.delete(entry.target)
    }
    bar.classList.toggle('is-hidden', visible.size > 0)
  })
  document.querySelectorAll(OWN_CONTACTS).forEach((element) => observer.observe(element))
}
