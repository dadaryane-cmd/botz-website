import { LANGUAGE_LABELS, LANGUAGES } from '../../config.js'
import { navigation } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { getLanguage, setLanguage, t, ui } from '../../lib/i18n.js'
import { external, phoneHref, whatsappHref } from '../../lib/links.js'
import { currentFile } from '../../lib/page.js'
import { renderBulbToggle } from '../bulb/bulb-toggle.js'
import { logoImages } from '../logo.js'

/** From this width the full navigation shows and the phone menu is not used (header.css). */
const WIDE_NAV_MIN_PX = 960

const isWideScreen = () => window.matchMedia(`(min-width: ${WIDE_NAV_MIN_PX}px)`).matches

/**
 * Logo, navigation (with a "Services" submenu), language switch, the bulb theme toggle and the
 * phone menu button. On phones the menu fills the screen and also holds the languages and
 * call / WhatsApp buttons.
 */
export function renderHeader(header) {
  const nav = h(
    'nav',
    { class: 'nav', id: 'site-nav', 'aria-label': ui('common', 'menu') },
    h('ul', { class: 'nav-links' }, navigation.header.map(navItem)),
    h(
      'a',
      { class: 'btn btn-primary btn-small', href: navigation.cta.href },
      t(navigation.cta.label),
    ),
    // Phone menu only (header.css): languages and direct contact at the bottom.
    h(
      'div',
      { class: 'nav-extras' },
      languageSwitch(),
      h(
        'div',
        { class: 'nav-contact' },
        h('a', { class: 'btn btn-secondary', href: phoneHref }, ui('contact', 'call')),
        h(
          'a',
          { class: 'btn btn-secondary', href: whatsappHref(), ...external },
          ui('contact', 'whatsapp'),
        ),
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
      h('a', { class: 'logo', href: 'index.html' }, logoImages()),
      nav,
      h('div', { class: 'header-tools' }, languageSwitch(), renderBulbToggle(), menuToggle),
    ),
  )
}

function languageSwitch() {
  return h(
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
}

/* ---------- menu items ---------- */

const navLink = (link) =>
  h(
    'a',
    { href: link.href, 'aria-current': link.href === currentFile() ? 'page' : null },
    t(link.label),
  )

/** A link, or a group with a submenu when the item has `children`. */
function navItem(item, index) {
  if (item.children?.length) return navGroup(item, `nav-group-${index}`)
  return h('li', null, navLink(item))
}

/**
 * Wide screens: a button that opens a small dropdown. Phone menu: the group's name as a label
 * with its links always listed under it (header.css shows one or the other).
 */
function navGroup(item, id) {
  const isCurrent = item.children.some((child) => child.href === currentFile())

  // A mouse opens it on hover; touch and keyboard use the button. One state for both.
  let openedByHover = false
  const hover = (open) => (event) => {
    if (event.pointerType !== 'mouse' || !isWideScreen()) return
    openedByHover = open
    setGroupOpen(group, open)
  }
  // The click that usually follows a hover-open keeps it open instead of closing it.
  const toggle = () => {
    const isOpen = group.classList.contains('is-open')
    const keepOpen = openedByHover && isOpen
    openedByHover = false
    if (!keepOpen) setGroupOpen(group, !isOpen)
  }

  const group = h(
    'li',
    { class: 'nav-group', onpointerenter: hover(true), onpointerleave: hover(false) },
    h(
      'button',
      {
        type: 'button',
        class: isCurrent ? 'nav-group-toggle is-current' : 'nav-group-toggle',
        'aria-expanded': 'false',
        'aria-controls': id,
        onclick: toggle,
      },
      t(item.label),
    ),
    h('span', { class: 'nav-group-label' }, t(item.label)),
    h(
      'ul',
      { class: 'nav-submenu', id },
      item.children.map((child) => h('li', null, navLink(child))),
    ),
  )
  return group
}

function setGroupOpen(group, open) {
  group.classList.toggle('is-open', open)
  group.querySelector('.nav-group-toggle').setAttribute('aria-expanded', String(open))
}

/* ---------- open and close ---------- */

/** Open or close the phone menu; while it is open the page behind it does not scroll. */
function setMenuOpen(header, open) {
  header.classList.toggle('is-open', open)
  document.documentElement.classList.toggle('menu-open', open)
  header.querySelector('.menu-toggle')?.setAttribute('aria-expanded', String(open))
}

function closeGroups(header, except = null) {
  for (const group of header.querySelectorAll('.nav-group.is-open')) {
    if (group !== except) setGroupOpen(group, false)
  }
}

/** Escape: close every submenu and keep keyboard focus on its button. */
function dismissGroups(header) {
  for (const group of header.querySelectorAll('.nav-group.is-open')) {
    if (group.contains(document.activeElement)) group.querySelector('.nav-group-toggle').focus()
  }
  closeGroups(header)
}

/**
 * Close the phone menu when a link is chosen, on Escape, and when the screen becomes wide
 * enough for the full navigation; close open submenus on Escape or a click elsewhere.
 * Attached once; survives re-renders of the header.
 */
export function setUpMobileMenu(header) {
  const closeMenu = () => setMenuOpen(header, false)
  header.addEventListener('click', (event) => {
    if (event.target.closest('#site-nav a')) closeMenu()
  })
  document.addEventListener('click', (event) => {
    closeGroups(header, event.target.closest('.nav-group'))
  })
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    dismissGroups(header)
    if (header.classList.contains('is-open')) closeMenu()
  })
  window.matchMedia(`(min-width: ${WIDE_NAV_MIN_PX}px)`).addEventListener('change', (event) => {
    if (event.matches) closeMenu()
  })
}
