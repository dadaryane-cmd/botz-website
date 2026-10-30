/**
 * Site footer, the quiet end of every page: logo and one line about the business; link columns
 * with the contact details, location, hours and social pages; and a bottom row with the notes.
 * The call to action belongs to each page's last section, not here.
 */
import { navigation, site } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { hasText, t, ui } from '../../lib/i18n.js'
import { emailHref, external, phoneHref, whatsappHref } from '../../lib/links.js'
import { renderSocialLinks } from './social-links.js'

export function renderFooter(footer) {
  footer.replaceChildren(
    h(
      'div',
      { class: 'container container-wide' },
      footerTop(),
      h(
        'div',
        { class: 'footer-columns' },
        navigation.footerColumns.map((group) =>
          column(
            t(group.title),
            group.links.map((link) => h('a', { href: link.href }, t(link.label))),
          ),
        ),
        contactColumn(),
      ),
      footerBottom(),
    ),
  )
}

/** The footer is always dark, so it always shows the light-on-dark logo. */
function footerTop() {
  return h(
    'div',
    { class: 'footer-top' },
    h(
      'a',
      { class: 'footer-logo', href: 'index.html' },
      h('img', {
        src: 'images/botz-logo-dark.webp',
        alt: t(site.name),
        width: 112,
        height: 44,
      }),
    ),
    hasText(navigation.footerTagline) &&
      h('p', { class: 'footer-tagline' }, t(navigation.footerTagline)),
  )
}

function column(title, items, extra) {
  return h(
    'div',
    null,
    h('h2', null, title),
    h(
      'ul',
      null,
      items.map((item) => h('li', null, item)),
    ),
    extra,
  )
}

function contactColumn() {
  const place = [site.location, site.hours].filter(hasText).map((value) => t(value))
  return column(
    ui('footer', 'contactTitle'),
    [
      h('a', { href: phoneHref }, site.phoneDisplay),
      h('a', { href: whatsappHref(), ...external }, 'WhatsApp'),
      h('a', { href: emailHref }, site.email),
    ],
    [
      place.length > 0 && h('p', { class: 'footer-place' }, place.join(' · ')),
      renderSocialLinks(site.social),
    ],
  )
}

function footerBottom() {
  return h(
    'div',
    { class: 'footer-bottom' },
    h('p', null, `© ${new Date().getFullYear()} ${t(site.name)} · ${ui('footer', 'madeBy')}`),
    h('p', null, t(navigation.footerNote)),
    // "#top" with no such id is the top of the page, by the HTML standard.
    h('a', { class: 'footer-top-link', href: '#top' }, `${ui('footer', 'backToTop')} ↑`),
  )
}
