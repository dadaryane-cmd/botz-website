import { navigation, site } from '../../content/index.js'
import { h, richText } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { emailHref, external, phoneHref, whatsappHref } from '../../lib/links.js'

export function renderFooter(footer) {
  const column = (title, items) =>
    h(
      'div',
      null,
      h('h2', null, title),
      h(
        'ul',
        null,
        items.map((item) => h('li', null, item)),
      ),
    )

  footer.replaceChildren(
    h(
      'div',
      { class: 'container container-wide' },
      h('p', { class: 'footer-statement' }, richText(navigation.footerStatement)),
      h(
        'div',
        { class: 'footer-columns' },
        navigation.footerColumns.map((col) =>
          column(
            t(col.title),
            col.links.map((link) => h('a', { href: link.href }, t(link.label))),
          ),
        ),
        column(ui('footer', 'contactTitle'), [
          h('a', { href: phoneHref }, site.phoneDisplay),
          h('a', { href: whatsappHref(), ...external }, 'WhatsApp'),
          h('a', { href: emailHref }, site.email),
        ]),
      ),
      h('p', { class: 'muted small' }, t(navigation.footerNote)),
      h(
        'p',
        { class: 'muted small' },
        `© ${new Date().getFullYear()} ${t(site.name)}. ${ui('footer', 'rights')}`,
      ),
    ),
  )
}
