import { LANGUAGE_LABELS, LANGUAGES } from '../../config.js'
import { navigation, site } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { getLanguage, setLanguage, t, ui } from '../../lib/i18n.js'
import { currentFile } from '../../lib/page.js'
import { renderBulbToggle } from '../bulb/bulb-toggle.js'

/** Logo, navigation, language switch, the bulb theme toggle and the mobile menu button. */
export function renderHeader(header) {
  const nav = h(
    'nav',
    { class: 'nav', id: 'site-nav', 'aria-label': ui('common', 'menu') },
    h(
      'ul',
      null,
      navigation.header.map((link) =>
        h(
          'li',
          null,
          h(
            'a',
            { href: link.href, 'aria-current': link.href === currentFile() ? 'page' : null },
            t(link.label),
          ),
        ),
      ),
    ),
    h(
      'a',
      { class: 'btn btn-primary btn-small', href: navigation.cta.href },
      t(navigation.cta.label),
    ),
  )

  const languageSwitch = h(
    'div',
    { class: 'language-switch', role: 'group', 'aria-label': ui('common', 'language') },
    LANGUAGES.map((language) =>
      h(
        'button',
        {
          type: 'button',
          lang: language,
          'aria-pressed': String(language === getLanguage()),
          onclick: () => setLanguage(language),
        },
        LANGUAGE_LABELS[language],
      ),
    ),
  )

  const menuToggle = h(
    'button',
    {
      type: 'button',
      class: 'icon-button menu-toggle',
      'aria-controls': 'site-nav',
      'aria-expanded': 'false',
      'aria-label': ui('common', 'menu'),
      onclick: (event) => {
        const open = header.classList.toggle('is-open')
        event.currentTarget.setAttribute('aria-expanded', String(open))
      },
    },
    h('span', { class: 'burger', 'aria-hidden': 'true' }),
  )

  header.classList.remove('is-open')
  header.replaceChildren(
    h(
      'div',
      { class: 'container container-wide header-bar' },
      // Both logos are rendered; CSS shows the one for the current theme, so a theme change
      // never re-renders the header (and never interrupts the bulb's animation).
      h(
        'a',
        { class: 'logo', href: 'index.html' },
        h('img', {
          class: 'logo-light',
          src: 'images/botz-logo-light.webp',
          alt: t(site.name),
          width: 112,
          height: 44,
        }),
        h('img', {
          class: 'logo-dark',
          src: 'images/botz-logo-dark.webp',
          alt: t(site.name),
          width: 112,
          height: 44,
        }),
      ),
      nav,
      h('div', { class: 'header-tools' }, languageSwitch, renderBulbToggle(), menuToggle),
    ),
  )
}

/** Close the mobile menu once a link is chosen. Attached once, survives re-renders. */
export function closeMenuOnNavigate(header) {
  header.addEventListener('click', (event) => {
    if (event.target.closest('#site-nav a')) header.classList.remove('is-open')
  })
}
