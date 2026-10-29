/*
 * Interactive pricing: package cards for a contract length, add-ons and a live estimate.
 * Also the short "packages at a glance" preview used on the home page.
 */
(function () {
  'use strict'

  const B = window.BOTZ
  const { h, tr, ui, amd } = B
  const CATEGORIES = ['smm', 'seo', 'bundle', 'website']

  const catLabel = (cat) => ui('pricing', 'cat_' + cat)
  const fullName = (pkg) => (pkg.category === 'website' ? tr(pkg.name) : `${catLabel(pkg.category)} ${tr(pkg.name)}`)
  const contactHref = () => (B.hasAnchor('contact') ? '#contact' : 'contact.html#contact')

  /** Re-render a container and keep keyboard focus on the same control. */
  function rerender(root, build) {
    const key = document.activeElement?.dataset?.key
    root.replaceChildren(...build())
    if (key) root.querySelector(`[data-key="${CSS.escape(key)}"]`)?.focus()
  }

  /* ---------- pricing block ---------- */

  B.blocks.pricing = (block) => {
    let category = block.defaultCategory || 'smm'
    const selected = B.selection().packageKey && B.findPackage(B.selection().packageKey)
    if (!block.lockCategory && selected) category = selected.category
    if (!B.selection().packageKey && block.defaultDuration && block.defaultDuration !== '1') {
      B.setSelection({ duration: Number(block.defaultDuration) })
    }

    const body = h('div', { class: 'pricing' })
    const build = () => {
      const sel = B.selection()
      const packages = B.data.packages.filter((p) => p.category === category)
      return [
        controls(block, category, sel, (next) => {
          category = next
          rerender(body, build)
        }),
        h(
          'div',
          { class: 'pricing-layout' },
          h(
            'div',
            { class: 'pricing-main' },
            h('div', { class: 'grid grid-3 package-grid' }, packages.map((p) => packageCard(p, sel))),
            h('p', { class: 'muted small' }, ui('pricing', 'scopeInProposal')),
            block.showAddons ? addonList(sel) : null,
          ),
          estimatePanel(sel),
        ),
      ]
    }
    body.append(...build())
    B.onSelection(body, () => rerender(body, build))
    return B.section(block, B.heading(block.heading), body)
  }

  function controls(block, category, sel, onCategory) {
    const tabs = block.lockCategory
      ? null
      : h(
          'div',
          { class: 'segmented', role: 'group', 'aria-label': ui('pricing', 'filterLabel') },
          CATEGORIES.map((cat) =>
            h(
              'button',
              { type: 'button', 'data-key': 'cat-' + cat, 'aria-pressed': String(cat === category), onclick: () => onCategory(cat) },
              catLabel(cat),
            ),
          ),
        )
    const durations =
      category === 'website'
        ? null
        : h(
            'div',
            { class: 'segmented', role: 'group', 'aria-label': ui('pricing', 'durationLabel') },
            B.DURATIONS.map((d) =>
              h(
                'button',
                { type: 'button', 'data-key': 'dur-' + d, 'aria-pressed': String(d === sel.duration), onclick: () => B.setSelection({ duration: d }) },
                B.monthsLabel(d),
              ),
            ),
          )
    return h(
      'div',
      { class: 'pricing-controls' },
      tabs ? h('div', null, h('span', { class: 'label' }, ui('pricing', 'filterLabel')), tabs) : null,
      durations ? h('div', null, h('span', { class: 'label' }, ui('pricing', 'durationLabel')), durations) : null,
    )
  }

  function packageCard(pkg, sel) {
    const isSelected = sel.packageKey === pkg.key
    const recurring = B.isRecurring(pkg)
    const line = recurring ? B.priceLine(pkg, sel.duration) : null
    const unavailable = recurring && !line

    let price
    if (!recurring) {
      price = [h('p', { class: 'price' }, amd(pkg.oneTimePrice)), h('p', { class: 'muted small' }, ui('pricing', 'oneTime'))]
    } else if (unavailable) {
      const list = B.availableDurations(pkg).map(B.monthsLabel).join(', ')
      price = [h('p', { class: 'price price-off' }, ui('pricing', 'unavailableShort')), h('p', { class: 'muted small' }, ui('pricing', 'availableFor', { list }))]
    } else {
      price = [
        h('p', { class: 'price' }, amd(line.monthly), h('small', null, ' ', ui('pricing', 'perMonth'))),
        h('p', { class: 'small' }, line.months === 1 ? ui('pricing', 'totalFor1') : ui('pricing', 'totalFor', { n: line.months }), ': ', h('strong', null, amd(line.total))),
        h('p', { class: `small ${line.savings ? 'saving' : 'muted'}` }, line.savings ? ui('pricing', 'youSave', { amount: amd(line.savings) }) : ui('pricing', 'noSavings')),
      ]
    }

    const components = pkg.components
      ? h('p', { class: 'muted small' }, ui('pricing', 'bundleOf', { list: pkg.components.map((k) => fullName(B.findPackage(k))).join(' + ') }))
      : null

    return h(
      'article',
      { class: `card package-card${isSelected ? ' is-selected' : ''}${pkg.recommended ? ' is-recommended' : ''}${unavailable ? ' is-off' : ''}` },
      pkg.recommended ? h('span', { class: 'badge badge-accent' }, ui('pricing', 'recommended')) : null,
      h('h3', null, tr(pkg.name)),
      h('p', { class: 'muted' }, tr(pkg.tagline)),
      components,
      h('div', { class: 'package-price' }, price),
      h(
        'button',
        {
          type: 'button',
          class: `btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`,
          'data-key': 'pkg-' + pkg.key,
          'aria-pressed': String(isSelected),
          disabled: unavailable,
          onclick: () => B.setSelection({ packageKey: isSelected ? null : pkg.key }),
        },
        isSelected ? '✓ ' + ui('pricing', 'selected') : ui('pricing', 'select'),
      ),
    )
  }

  function addonList(sel) {
    return h(
      'div',
      { class: 'addons' },
      h('h3', null, ui('pricing', 'addonsTitle')),
      h('p', { class: 'muted' }, ui('pricing', 'addonsIntro')),
      h(
        'ul',
        { class: 'addon-list' },
        B.data.addons.map((addon) => {
          const qty = sel.addons[addon.key] || 0
          const setQty = (n) => {
            const addons = { ...B.selection().addons }
            if (n > 0) addons[addon.key] = Math.min(20, n)
            else delete addons[addon.key]
            B.setSelection({ addons })
          }
          const priceText = `${addon.priceIsFrom ? ui('pricing', 'from') + ' ' : ''}${amd(addon.price)}`
          return h(
            'li',
            { class: `addon${qty ? ' is-selected' : ''}` },
            h(
              'div',
              null,
              h('strong', null, tr(addon.name)),
              h('span', { class: 'muted small' }, priceText, addon.units ? ` · ${ui('pricing', 'bundleUnits', { n: addon.units })}` : ''),
            ),
            qty
              ? h(
                  'div',
                  { class: 'stepper', role: 'group', 'aria-label': `${ui('pricing', 'quantity')}: ${tr(addon.name)}` },
                  h('button', { type: 'button', 'data-key': 'minus-' + addon.key, 'aria-label': ui('pricing', 'remove'), onclick: () => setQty(qty - 1) }, '−'),
                  h('output', { 'aria-live': 'polite' }, String(qty)),
                  h('button', { type: 'button', 'data-key': 'plus-' + addon.key, 'aria-label': ui('pricing', 'add'), onclick: () => setQty(qty + 1) }, '+'),
                )
              : h('button', { type: 'button', class: 'btn btn-secondary btn-small', 'data-key': 'add-' + addon.key, onclick: () => setQty(1) }, ui('pricing', 'add')),
          )
        }),
      ),
    )
  }

  function estimatePanel(sel) {
    const q = B.quote(sel)
    const panel = (...children) => h('aside', { class: 'card estimate', 'aria-live': 'polite' }, h('h3', null, ui('pricing', 'estimateTitle')), children)
    if (q.empty) return panel(h('p', { class: 'muted' }, ui('pricing', 'noSelection')))

    const rows = []
    if (q.line) {
      rows.push(row(fullName(q.pkg), `${amd(q.line.monthly)} × ${q.line.months}`))
      rows.push(row(ui('pricing', 'recurringFees'), amd(q.line.total), 'subtotal'))
    }
    if (q.pkg && !q.line) rows.push(row(fullName(q.pkg), amd(q.oneTimePackage)))
    for (const a of q.addons) rows.push(row(`${tr(a.addon.name)} ×${a.qty}`, amd(a.total)))
    if (q.oneTimeTotal) rows.push(row(ui('pricing', 'oneTimeFees'), amd(q.oneTimeTotal), 'subtotal'))
    rows.push(row(ui('pricing', 'combinedEstimate'), `${q.isMinimum ? ui('pricing', 'from') + ' ' : ''}${amd(q.combined)}`, 'total'))

    const status = h('p', { class: 'small', role: 'status' })
    const share = async () => {
      const url = B.shareUrl(sel)
      try {
        await navigator.clipboard.writeText(url)
        status.textContent = ui('pricing', 'shareCopied')
      } catch {
        window.prompt(ui('pricing', 'shareReady'), url)
      }
    }
    const waText = [ui('whatsapp', 'greeting', { contact: 'BOTZ' }), B.quoteText(q), ui('whatsapp', 'closing')].join('\n')

    return panel(
      h('dl', { class: 'estimate-rows' }, rows),
      q.isMinimum ? h('p', { class: 'muted small' }, ui('pricing', 'minimumNote')) : null,
      h('p', { class: 'muted small' }, ui('pricing', 'notContract')),
      h(
        'div',
        { class: 'estimate-actions' },
        h('a', { class: 'btn btn-primary', href: contactHref() }, ui('pricing', 'requestProposal')),
        h('a', { class: 'btn btn-secondary', href: B.whatsappUrl(waText), target: '_blank', rel: 'noopener' }, ui('pricing', 'discussWhatsapp')),
        h(
          'div',
          { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn btn-link btn-small', onclick: share }, ui('pricing', 'shareEstimate')),
          h('button', { type: 'button', class: 'btn btn-link btn-small', onclick: B.clearSelection }, ui('pricing', 'clear')),
        ),
      ),
      status,
    )
  }

  const row = (label, value, kind = '') => h('div', { class: `estimate-row ${kind}` }, h('dt', null, label), h('dd', null, value))

  /* ---------- packages at a glance (home page) ---------- */

  B.blocks.packagePreview = (block) => {
    const months = Number(block.duration) || 12
    const groups = (block.categories || CATEGORIES).map((cat) => {
      const packages = B.data.packages.filter((p) => p.category === cat)
      return h(
        'div',
        { class: 'preview-group' },
        h('h3', null, catLabel(cat)),
        h(
          'ul',
          { class: 'preview-list' },
          packages.map((pkg) => {
            const line = B.isRecurring(pkg) ? B.priceLine(pkg, months) : null
            let price
            if (!B.isRecurring(pkg)) price = `${amd(pkg.oneTimePrice)} · ${ui('pricing', 'oneTime')}`
            else if (line) price = `${amd(line.monthly)} / ${ui('pricing', 'perMonth')}`
            else price = `${ui('pricing', 'from')} ${amd(B.cheapestMonthly(pkg))} / ${ui('pricing', 'perMonth')}`
            return h(
              'li',
              null,
              h('a', { href: B.shareUrl({ packageKey: pkg.key, duration: line ? months : B.availableDurations(pkg).pop() || 1, addons: {} }) }, h('strong', null, tr(pkg.name)), pkg.recommended ? h('span', { class: 'badge badge-accent' }, ui('pricing', 'recommended')) : null),
              h('span', { class: 'price-small' }, price),
            )
          }),
        ),
      )
    })
    return B.section(
      block,
      B.heading(block.heading),
      block.intro ? h('p', { class: 'lead' }, tr(block.intro)) : null,
      h('div', { class: 'grid grid-4' }, groups),
      h(
        'div',
        { class: 'btn-row' },
        block.link ? B.button(block.link) : null,
        block.showGuideLink ? h('a', { class: 'btn btn-link', href: B.hasAnchor('guide') ? '#guide' : 'pricing.html#guide' }, ui('trust', 'finderLink'), ' →') : null,
      ),
    )
  }
})()
