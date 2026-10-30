import { LANGUAGE_LABELS, LANGUAGES } from '../../config.js'
import { navigation, site } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { getLanguage, setLanguage, t, ui } from '../../lib/i18n.js'
import { currentFile } from '../../lib/page.js'
import { renderBulbToggle } from '../bulb/bulb-toggle.js'

/** From this width the full navigation shows and the phone menu is not used (header.css). */
const WIDE_NAV_MIN_PX = 1081

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
      onclick: () => setMenuOpen(header, !header.classList.contains('is-open')),
    },
    h('span', { class: 'burger', 'aria-hidden': 'true' }),
  )

  setMenuOpen(header, false)
  header.replaceChildren(
    h(
      'div',
      { class: 'container container-wide header-bar' },
      // Both logos are rendered; CSS shows the one for the current theme, so a theme change
      // never re-renders the header (and never interrupts the bulb's animation).
      h('a', { class: 'logo', href: 'index.html' }, logoImage('light'), logoImage('dark')),
      nav,
      h('div', { class: 'header-tools' }, languageSwitch, renderBulbToggle(), menuToggle),
    ),
  )
}

const logoImage = (theme) =>
  h('img', {
    class: `logo-${theme}`,
    src: `images/botz-logo-${theme}.webp`,
    alt: t(site.name),
    width: 112,
    height: 44,
  })

/** Open or close the phone menu; while it is open the page behind it does not scroll. */
function setMenuOpen(header, open) {
  header.classList.toggle('is-open', open)
  document.documentElement.classList.toggle('menu-open', open)
  header.querySelector('.menu-toggle')?.setAttribute('aria-expanded', String(open))
}

/**
 * Close the phone menu when a link is chosen, on Escape, and when the screen becomes wide
 * enough for the full navigation. Attached once; survives re-renders of the header.
 */
export function setUpMobileMenu(header) {
  const close = () => setMenuOpen(header, false)
  header.addEventListener('click', (event) => {
    if (event.target.closest('#site-nav a')) close()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) close()
  })
  window.matchMedia(`(min-width: ${WIDE_NAV_MIN_PX}px)`).addEventListener('change', (event) => {
    if (event.matches) close()
  })
}
