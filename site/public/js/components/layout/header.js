import { LANGUAGE_LABELS, LANGUAGE_NAMES, LANGUAGES } from '../../config.js'
import { navigation, site } from '../../content/index.js'
import { fromMarkup, h } from '../../lib/dom.js'
import { getLanguage, rememberLanguage, t, ui } from '../../lib/i18n.js'
import { external, phoneHref, whatsappHref } from '../../lib/links.js'
import { currentFile, currentPageIn } from '../../lib/page.js'
import { renderBulbToggle } from '../bulb/bulb-toggle.js'
import { logoImages } from '../logo.js'
import { button } from '../sections/section.js'

/** A speech bubble with a handset (static, trusted markup), drawn with the text colour. */
const WHATSAPP_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true"><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.4 3.3Z" /><path
  d="M9.2 8.6c-.3 2.4 1.8 5.4 5 6.2.6.1 1.2-.3 1.4-.9l.2-.7-1.9-.9-.8.8a4.6 4.6 0 0 1-2.3-2.3l.8-.8-.9-1.9-.7.2c-.5.2-.8.6-.8 1.1Z"
  /></svg>`

/** From this width the full navigation shows and the phone menu is not used (header.css). */
const WIDE_NAV_MIN_PX = 1120

const isWideScreen = () => window.matchMedia(`(min-width: ${WIDE_NAV_MIN_PX}px)`).matches

/**
 * Logo, navigation (with a "Services" submenu), WhatsApp, the offer button (a free audit), the
 * language menu, the bulb theme toggle and the phone menu button. On phones the menu fills the
 * screen and also holds the languages and call / WhatsApp buttons.
 */
export function renderHeader(header) {
  const nav = h(
    'nav',
    { class: 'nav', id: 'site-nav', 'aria-label': ui('common', 'menu') },
    h('ul', { class: 'nav-links' }, navigation.header.map(navItem)),
    whatsappLink(),
    // The offer (a free audit): its note prefills the contact form's message.
    button(navigation.cta, { size: 'small' }),
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
      h('div', { class: 'header-tools' }, languageMenu(), renderBulbToggle(), menuToggle),
    ),
  )
}

/** Wide screens: WhatsApp at a glance beside the offer (phones have it in the bottom bar). */
const whatsappLink = () =>
  h(
    'a',
    {
      class: 'icon-button header-whatsapp',
      href: whatsappHref(),
      ...external,
      'aria-label': `${ui('contact', 'whatsapp')} ${site.phoneDisplay}`,
      title: `${ui('contact', 'whatsapp')} ${site.phoneDisplay}`,
    },
    fromMarkup(WHATSAPP_ICON),
  )

/**
 * Wide screens: the language as one small button ("Eng ▾") that opens the three, each named
 * in its own language. A language is picked once, so it need not take the header's room.
 */
function languageMenu() {
  return h(
    'details',
    { class: 'language-menu' },
    h(
      'summary',
      { 'aria-label': `${ui('common', 'language')}: ${LANGUAGE_NAMES[getLanguage()]}` },
      LANGUAGE_LABELS[getLanguage()],
    ),
    h(
      'div',
      { class: 'language-menu-list' },
      LANGUAGES.map((language) => languageLink(language, LANGUAGE_NAMES[language])),
    ),
  )
}

/**
 * This page in `language` (mer-masin/, en/about/, ru/o-nas/): a real link, so search engines
 * find every language too. The choice is remembered for the next visit.
 */
const languageLink = (language, label) =>
  h(
    'a',
    {
      href: currentPageIn(language) + location.search + location.hash,
      hreflang: language,
      lang: language,
      'aria-current': language === getLanguage() ? 'true' : null,
      onclick: () => rememberLanguage(language),
    },
    label,
  )

/** Phone menu: the three languages side by side (there is room for them there). */
const languageSwitch = () =>
  h(
    'div',
    { class: 'language-switch', role: 'group', 'aria-label': ui('common', 'language') },
    LANGUAGES.map((language) => languageLink(language, LANGUAGE_LABELS[language])),
  )

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

/** Close the language menu, unless the click was inside it (`except`). */
function closeLanguageMenu(header, except = null) {
  const menu = header.querySelector('.language-menu[open]')
  if (menu && menu !== except) menu.open = false
}

/** Escape: close the language menu and keep keyboard focus on its button. */
function dismissLanguageMenu(header) {
  const menu = header.querySelector('.language-menu[open]')
  if (!menu) return
  if (menu.contains(document.activeElement)) menu.querySelector('summary').focus()
  menu.open = false
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
    closeLanguageMenu(header, event.target.closest('.language-menu'))
  })
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    dismissGroups(header)
    dismissLanguageMenu(header)
    if (header.classList.contains('is-open')) closeMenu()
  })
  window.matchMedia(`(min-width: ${WIDE_NAV_MIN_PX}px)`).addEventListener('change', (event) => {
    if (event.matches) closeMenu()
  })
}
