/*
 * Page sections. Each renderer takes a block from data.js and returns an element.
 * Pricing, the package finder and the contact form live in their own files.
 */
(function () {
  'use strict'

  const B = window.BOTZ
  const { h, tr, rich, ui } = B

  B.blocks = B.blocks || {}

  /** Outer <section> with background, anchor and width taken from the block. */
  B.section = (block, ...children) =>
    h(
      'section',
      { class: `section${block.bg ? ' bg-' + block.bg : ''}`, id: block.anchor },
      h('div', { class: `container${block.width ? ' container-' + block.width : ''}` }, children),
    )

  B.heading = (text, level = 'h2') => (text ? h(level, { class: 'heading' }, rich(text)) : null)

  B.button = (link) =>
    h('a', { class: `btn btn-${link.appearance || 'primary'}`, href: B.href(link.path) }, tr(link.label))

  const buttons = (list) => (list && list.length ? h('div', { class: 'btn-row' }, list.map(B.button)) : null)

  /* ---------- hero ---------- */

  B.blocks.hero = (block) => {
    const isHome = block.variant === 'flame'
    const text = h(
      'div',
      { class: 'hero-text' },
      B.heading(block.heading, 'h1'),
      block.subheading ? h('p', { class: 'lead' }, tr(block.subheading)) : null,
      buttons(block.buttons),
      block.proofLine ? h('p', { class: 'muted small' }, tr(block.proofLine)) : null,
    )
    const side = block.sideCard === 'offer' ? offerCard() : null

    const section = h(
      'section',
      { class: `hero${isHome ? ' hero-home' : ''}` },
      isHome ? h('div', { class: 'hero-flame', 'aria-hidden': 'true' }) : null,
      h('div', { class: 'container container-wide hero-grid' }, text, side),
      block.tickerItems ? ticker(block.tickerItems) : null,
    )
    return section
  }

  function offerCard() {
    return h(
      'aside',
      { class: 'card offer-card' },
      h('img', { src: 'assets/img/botz-mark.webp', alt: '', width: 72, height: 111, class: 'offer-mark' }),
      h('p', { class: 'badge' }, ui('trust', 'offerBadge')),
      h('ul', { class: 'check-list' }, h('li', null, ui('trust', 'auditNote')), h('li', null, ui('trust', 'trialNote'))),
      h('a', { class: 'btn btn-primary', href: '#contact' }, ui('trust', 'offerCta')),
    )
  }

  function ticker(items) {
    // The list is repeated so the scrolling loop has no gap.
    const words = items.map((i) => h('span', null, tr(i.text)))
    const copy = items.map((i) => h('span', { 'aria-hidden': 'true' }, tr(i.text)))
    return h('div', { class: 'ticker' }, h('div', { class: 'ticker-track' }, words, copy))
  }

  /* ---------- statement + points ---------- */

  B.blocks.split = (block) =>
    B.section(
      block,
      h(
        'div',
        { class: 'split' },
        h('div', null, B.heading(block.statement)),
        h(
          'div',
          null,
          block.body ? h('p', { class: 'lead' }, tr(block.body)) : null,
          block.points
            ? h(
                'ul',
                { class: 'points' },
                block.points.map((p) => h('li', null, h('strong', null, tr(p.title)), h('span', null, tr(p.text)))),
              )
            : null,
        ),
      ),
    )

  /* ---------- services ---------- */

  B.blocks.services = (block) =>
    B.section(
      block,
      B.heading(block.heading),
      h(
        'div',
        { class: 'grid services-grid' },
        block.items.map((item) =>
          h(
            'article',
            { class: 'card service-card' },
            h('span', { class: 'index' }, item.index),
            h('h3', null, tr(item.title)),
            h('p', null, tr(item.text)),
            h('ul', { class: 'chips' }, item.highlights.map((x) => h('li', null, tr(x.text)))),
            item.link ? h('a', { class: 'link-arrow', href: B.href(item.link.path) }, tr(item.link.label)) : null,
          ),
        ),
      ),
    )

  /* ---------- team ---------- */

  B.blocks.team = (block) =>
    B.section(
      block,
      B.heading(block.heading),
      block.intro ? h('p', { class: 'lead' }, tr(block.intro)) : null,
      h(
        'div',
        { class: 'grid grid-2' },
        block.founders.map((f) =>
          h(
            'article',
            { class: 'card person-card' },
            h('span', { class: 'avatar', 'aria-hidden': 'true' }, tr(f.name).charAt(0)),
            h('div', null, h('h3', null, tr(f.name)), h('p', { class: 'muted' }, tr(f.role))),
          ),
        ),
      ),
    )

  /* ---------- sample deliverables ---------- */

  B.blocks.samples = (block) =>
    B.section(
      block,
      B.heading(block.heading),
      block.intro ? h('p', { class: 'lead' }, tr(block.intro)) : null,
      h(
        'div',
        { class: 'grid grid-3' },
        block.items.map((item) =>
          h(
            'article',
            { class: 'card sample-card' },
            h('span', { class: 'badge' }, ui('trust', 'sampleLabel')),
            h('h3', null, tr(item.title)),
            h('p', null, tr(item.text)),
            h(
              'div',
              { class: 'btn-row' },
              h('a', { class: 'btn btn-secondary btn-small', href: item.filePath, target: '_blank', rel: 'noopener' }, ui('trust', 'preview')),
              h('a', { class: 'btn btn-link btn-small', href: item.filePath, download: true }, ui('trust', 'download')),
            ),
          ),
        ),
      ),
      h('p', { class: 'muted small' }, ui('trust', 'sampleNote')),
    )

  /* ---------- process ---------- */

  B.blocks.process = (block) =>
    B.section(
      block,
      B.heading(block.heading),
      h(
        'ol',
        { class: 'steps' },
        block.steps.map((s, i) =>
          h('li', { class: 'step' }, h('span', { class: 'step-no' }, String(i + 1).padStart(2, '0')), h('h3', null, tr(s.title)), h('p', null, tr(s.text))),
        ),
      ),
    )

  /* ---------- FAQ ---------- */

  B.blocks.faq = (block) =>
    B.section(
      block,
      B.heading(block.heading),
      h(
        'div',
        { class: 'faq' },
        block.items.map((item) =>
          h('details', { open: Boolean(item.openByDefault) }, h('summary', null, tr(item.question)), h('p', null, tr(item.answer))),
        ),
      ),
    )

  /* ---------- call to action ---------- */

  B.blocks.cta = (block) =>
    B.section(block, h('div', { class: 'cta' }, B.heading(block.heading), block.text ? h('p', { class: 'lead' }, tr(block.text)) : null, buttons(block.buttons)))
})()
