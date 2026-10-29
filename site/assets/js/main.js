/*
 * Builds every page: header, the page's sections (from data.js), footer and the mobile contact bar.
 * Each HTML file only says which page it is: <html data-page="smm">.
 */
(function () {
  'use strict'

  const B = window.BOTZ
  const { h, tr, ui } = B
  const data = B.data

  /* ---------- theme ---------- */

  const root = document.documentElement
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
  const theme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light')

  function setTheme(next) {
    root.dataset.theme = next
    B.store.set('theme', next)
    renderHeader()
  }

  /* ---------- header ---------- */

  const header = document.getElementById('site-header')
  const page = B.currentPage()

  function renderHeader() {
    const current = data.pages[page]?.file
    const dark = theme() === 'dark'
    const nav = h(
      'nav',
      { class: 'nav', id: 'site-nav', 'aria-label': ui('common', 'menu') },
      h(
        'ul',
        null,
        data.nav.header.map((link) => {
          const href = B.href(link.path)
          return h('li', null, h('a', { href, 'aria-current': href === current ? 'page' : null }, tr(link.label)))
        }),
      ),
      h('a', { class: 'btn btn-primary btn-small nav-cta', href: B.href(data.nav.headerCta.path) }, tr(data.nav.headerCta.label)),
    )

    const langs = h(
      'div',
      { class: 'lang', role: 'group', 'aria-label': ui('common', 'language') },
      B.LANGS.map((l) =>
        h('button', { type: 'button', lang: l, 'aria-pressed': String(l === B.lang()), onclick: () => B.setLang(l) }, B.LANG_LABELS[l]),
      ),
    )

    const themeBtn = h(
      'button',
      { type: 'button', class: 'icon-btn', title: ui('trust', 'themeTooltip'), 'aria-label': dark ? ui('common', 'switchToLight') : ui('common', 'switchToDark'), onclick: () => setTheme(dark ? 'light' : 'dark') },
      dark ? '☀' : '☾',
    )

    const menuBtn = h(
      'button',
      {
        type: 'button',
        class: 'icon-btn menu-btn',
        'aria-controls': 'site-nav',
        'aria-expanded': 'false',
        'aria-label': ui('common', 'menu'),
        onclick: (e) => {
          const open = header.classList.toggle('is-open')
          e.currentTarget.setAttribute('aria-expanded', String(open))
        },
      },
      h('span', { class: 'burger', 'aria-hidden': 'true' }),
    )

    header.className = 'site-header'
    header.replaceChildren(
      h(
        'div',
        { class: 'container container-wide header-bar' },
        h(
          'a',
          { class: 'logo', href: 'index.html' },
          h('img', { src: `assets/img/botz-logo-${dark ? 'dark' : 'light'}.webp`, alt: tr(data.site.name), width: 128, height: 50 }),
        ),
        nav,
        h('div', { class: 'header-tools' }, langs, themeBtn, menuBtn),
      ),
    )
  }

  /* ---------- footer and mobile contact bar ---------- */

  function renderFooter() {
    const site = data.site
    document.getElementById('site-footer').replaceChildren(
      h(
        'div',
        { class: 'container container-wide' },
        h('p', { class: 'footer-statement' }, B.rich(data.nav.footerStatement)),
        h(
          'div',
          { class: 'footer-cols' },
          data.nav.footerColumns.map((col) =>
            h('div', null, h('h2', null, tr(col.title)), h('ul', null, col.links.map((l) => h('li', null, h('a', { href: B.href(l.path) }, tr(l.label)))))),
          ),
          h(
            'div',
            null,
            h('h2', null, ui('footer', 'contactTitle')),
            h(
              'ul',
              null,
              h('li', null, h('a', { href: 'tel:' + site.phoneE164 }, site.phoneDisplay)),
              h('li', null, h('a', { href: B.whatsappUrl(''), target: '_blank', rel: 'noopener' }, 'WhatsApp')),
              h('li', null, h('a', { href: 'mailto:' + site.email }, site.email)),
            ),
          ),
        ),
        h('p', { class: 'muted small' }, tr(data.nav.footerNote)),
        h('p', { class: 'muted small' }, `© ${new Date().getFullYear()} ${tr(site.name)}. ${ui('footer', 'rights')}`),
      ),
    )

    document.getElementById('mobile-bar')?.remove()
    document.body.append(
      h(
        'div',
        { class: 'mobile-bar', id: 'mobile-bar' },
        h('a', { href: 'tel:' + site.phoneE164 }, ui('contact', 'call')),
        h('a', { href: B.whatsappUrl(''), target: '_blank', rel: 'noopener' }, ui('contact', 'whatsapp')),
      ),
    )
  }

  /* ---------- page ---------- */

  function renderPage() {
    const pageData = data.pages[page]
    const main = document.getElementById('main')
    root.lang = B.lang()
    document.querySelector('.skip-link').textContent = ui('common', 'skipToContent')

    if (!pageData) {
      document.title = ui('errors', 'notFoundTitle') + tr(data.site.titleSuffix)
      main.replaceChildren(
        h(
          'section',
          { class: 'hero' },
          h('div', { class: 'container' }, h('h1', { class: 'heading' }, ui('errors', 'notFoundTitle')), h('p', { class: 'lead' }, ui('errors', 'notFoundText')), h('a', { class: 'btn btn-primary', href: 'index.html' }, ui('errors', 'backHome'))),
        ),
      )
      return
    }

    document.title = tr(pageData.meta.title) + tr(data.site.titleSuffix)
    document.querySelector('meta[name="description"]')?.setAttribute('content', tr(pageData.meta.description))
    main.replaceChildren(...pageData.blocks.map((block) => B.blocks[block.blockType]?.(block)).filter(Boolean))
  }

  function renderAll() {
    renderHeader()
    renderPage()
    renderFooter()
  }

  B.onLang(() => {
    const y = window.scrollY
    renderAll()
    window.scrollTo(0, y)
  })
  systemDark.addEventListener('change', () => root.dataset.theme || renderHeader())

  renderAll()

  // Sections are built by script, so jump to #anchors once they exist.
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()

  // Close the mobile menu after choosing a link.
  header.addEventListener('click', (e) => {
    if (e.target.closest('#site-nav a')) header.classList.remove('is-open')
  })
})()
