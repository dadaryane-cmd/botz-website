/** Pricing tool: category and contract-length filters, package cards, add-ons and a live estimate. */
import { CONTRACT_LENGTHS, MAX_ADDON_QUANTITY, PACKAGE_CATEGORIES } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h, renderInto } from '../../lib/dom.js'
import { formatAmd, formatMonths } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { external, whatsappHref } from '../../lib/links.js'
import { sectionHref } from '../../lib/page.js'
import {
  availableLengths,
  findPackage,
  isRecurring,
  priceFor,
  quote,
} from '../../pricing/engine.js'
import {
  categoryLabel,
  estimateLink,
  estimateSummary,
  packageTitle,
} from '../../pricing/estimate.js'
import {
  clearSelection,
  getSelection,
  subscribe,
  updateSelection,
} from '../../pricing/selection.js'
import { heading, section } from './section.js'

export function renderPricing(config) {
  const selected = findPackage(catalog, getSelection().packageKey)
  let category = !config.lockCategory && selected ? selected.category : config.defaultCategory
  if (!selected && config.defaultDuration > 1) updateSelection({ months: config.defaultDuration })

  const body = h('div', { class: 'pricing' })
  const render = () => {
    const selection = getSelection()
    renderInto(body, [
      filters(config, category, selection, (next) => {
        category = next
        render()
      }),
      h(
        'div',
        { class: 'pricing-layout' },
        h(
          'div',
          null,
          h(
            'div',
            { class: 'grid package-grid' },
            catalog.packages
              .filter((pkg) => pkg.category === category)
              .map((pkg) => packageCard(pkg, selection)),
          ),
          h('p', { class: 'muted small' }, ui('pricing', 'scopeInProposal')),
          config.showAddons && addonList(selection),
        ),
        estimatePanel(selection),
      ),
    ])
  }
  render()
  subscribe(body, render)
  return section(config, heading(config.heading), body)
}

/* ---------- filters ---------- */

function filters(config, category, selection, onCategory) {
  const group = (label, buttons) =>
    h(
      'div',
      null,
      h('span', { class: 'label' }, label),
      h('div', { class: 'segmented', role: 'group', 'aria-label': label }, buttons),
    )
  const toggle = (key, pressed, label, onclick) =>
    h(
      'button',
      { type: 'button', 'data-key': key, 'aria-pressed': String(pressed), onclick },
      label,
    )

  return h(
    'div',
    { class: 'pricing-filters' },
    !config.lockCategory &&
      group(
        ui('pricing', 'filterLabel'),
        PACKAGE_CATEGORIES.map((c) =>
          toggle(`category-${c}`, c === category, categoryLabel(c), () => onCategory(c)),
        ),
      ),
    category !== 'website' &&
      group(
        ui('pricing', 'durationLabel'),
        CONTRACT_LENGTHS.map((m) =>
          toggle(`months-${m}`, m === selection.months, formatMonths(m), () =>
            updateSelection({ months: m }),
          ),
        ),
      ),
  )
}

/* ---------- package cards ---------- */

function packageCard(pkg, selection) {
  const isSelected = selection.packageKey === pkg.key
  const price = isRecurring(pkg) ? priceFor(pkg, selection.months) : null
  const unavailable = isRecurring(pkg) && !price
  const classes = [
    'card',
    'package-card',
    isSelected && 'is-selected',
    pkg.recommended && 'is-recommended',
    unavailable && 'is-unavailable',
  ]

  return h(
    'article',
    { class: classes.filter(Boolean).join(' ') },
    pkg.recommended && h('span', { class: 'badge badge-accent' }, ui('pricing', 'recommended')),
    h('h3', null, t(pkg.name)),
    h('p', { class: 'muted' }, t(pkg.tagline)),
    pkg.components?.length > 0 &&
      h(
        'p',
        { class: 'muted small' },
        ui('pricing', 'bundleOf', {
          list: pkg.components.map((key) => packageTitle(findPackage(catalog, key))).join(' + '),
        }),
      ),
    h('div', { class: 'package-price' }, priceDetails(pkg, price)),
    h(
      'button',
      {
        type: 'button',
        class: isSelected ? 'btn btn-primary' : 'btn btn-secondary',
        'data-key': `package-${pkg.key}`,
        'aria-pressed': String(isSelected),
        disabled: unavailable,
        onclick: () => updateSelection({ packageKey: isSelected ? null : pkg.key }),
      },
      isSelected ? `✓ ${ui('pricing', 'selected')}` : ui('pricing', 'select'),
    ),
  )
}

function priceDetails(pkg, price) {
  if (!isRecurring(pkg)) {
    return [
      h('p', { class: 'price' }, formatAmd(pkg.oneTimePrice)),
      h('p', { class: 'muted small' }, ui('pricing', 'oneTime')),
    ]
  }
  if (!price) {
    const list = availableLengths(pkg).map(formatMonths).join(', ')
    return [
      h('p', { class: 'price price-unavailable' }, ui('pricing', 'unavailableShort')),
      h('p', { class: 'muted small' }, ui('pricing', 'availableFor', { list })),
    ]
  }
  const totalLabel =
    price.months === 1 ? ui('pricing', 'totalFor1') : ui('pricing', 'totalFor', { n: price.months })
  return [
    h(
      'p',
      { class: 'price' },
      formatAmd(price.monthly),
      h('small', null, ` ${ui('pricing', 'perMonth')}`),
    ),
    h('p', { class: 'small' }, `${totalLabel}: `, h('strong', null, formatAmd(price.total))),
    price.savings
      ? h(
          'p',
          { class: 'small saving' },
          ui('pricing', 'youSave', { amount: formatAmd(price.savings) }),
        )
      : h('p', { class: 'small muted' }, ui('pricing', 'noSavings')),
  ]
}

/* ---------- add-ons ---------- */

function addonList(selection) {
  return h(
    'div',
    { class: 'addons' },
    h('h3', null, ui('pricing', 'addonsTitle')),
    h('p', { class: 'muted' }, ui('pricing', 'addonsIntro')),
    h(
      'ul',
      { class: 'addon-list' },
      catalog.addons.map((addon) => addonRow(addon, selection.addons[addon.key] ?? 0)),
    ),
  )
}

function addonRow(addon, quantity) {
  const setQuantity = (next) => {
    const addons = { ...getSelection().addons }
    if (next > 0) addons[addon.key] = Math.min(MAX_ADDON_QUANTITY, next)
    else delete addons[addon.key]
    updateSelection({ addons })
  }
  const from = addon.priceIsFrom ? `${ui('pricing', 'from')} ` : ''
  const units = addon.units ? ` · ${ui('pricing', 'bundleUnits', { n: addon.units })}` : ''

  return h(
    'li',
    { class: quantity ? 'addon is-selected' : 'addon' },
    h(
      'div',
      null,
      h('strong', null, t(addon.name)),
      h('span', { class: 'muted small' }, from, formatAmd(addon.price), units),
    ),
    quantity
      ? h(
          'div',
          {
            class: 'stepper',
            role: 'group',
            'aria-label': `${ui('pricing', 'quantity')}: ${t(addon.name)}`,
          },
          h(
            'button',
            {
              type: 'button',
              'data-key': `less-${addon.key}`,
              'aria-label': ui('pricing', 'remove'),
              onclick: () => setQuantity(quantity - 1),
            },
            '−',
          ),
          h('output', null, String(quantity)),
          h(
            'button',
            {
              type: 'button',
              'data-key': `more-${addon.key}`,
              'aria-label': ui('pricing', 'add'),
              onclick: () => setQuantity(quantity + 1),
            },
            '+',
          ),
        )
      : h(
          'button',
          {
            type: 'button',
            class: 'btn btn-secondary btn-small',
            'data-key': `add-${addon.key}`,
            onclick: () => setQuantity(1),
          },
          ui('pricing', 'add'),
        ),
  )
}

/* ---------- estimate ---------- */

function estimatePanel(selection) {
  const q = quote(catalog, selection)
  const title = h('h3', null, ui('pricing', 'estimateTitle'))
  if (q.isEmpty)
    return h(
      'aside',
      { class: 'card estimate' },
      title,
      h('p', { class: 'muted' }, ui('pricing', 'noSelection')),
    )

  const row = (label, value, kind) =>
    h(
      'div',
      { class: kind ? `estimate-row ${kind}` : 'estimate-row' },
      h('dt', null, label),
      h('dd', null, value),
    )
  const rows = []
  if (q.recurring) {
    rows.push(row(packageTitle(q.pkg), `${formatAmd(q.recurring.monthly)} × ${q.recurring.months}`))
    rows.push(row(ui('pricing', 'recurringFees'), formatAmd(q.recurring.total), 'subtotal'))
  } else if (q.pkg) {
    rows.push(row(packageTitle(q.pkg), formatAmd(q.packageOneTime)))
  }
  for (const line of q.addons)
    rows.push(row(`${t(line.addon.name)} ×${line.quantity}`, formatAmd(line.total)))
  if (q.oneTimeTotal)
    rows.push(row(ui('pricing', 'oneTimeFees'), formatAmd(q.oneTimeTotal), 'subtotal'))
  rows.push(
    row(
      ui('pricing', 'combinedEstimate'),
      `${q.isMinimum ? `${ui('pricing', 'from')} ` : ''}${formatAmd(q.total)}`,
      'total',
    ),
  )

  const status = h('p', { class: 'small', role: 'status' })
  const share = async () => {
    const link = estimateLink(selection)
    try {
      await navigator.clipboard.writeText(link)
      status.textContent = ui('pricing', 'shareCopied')
    } catch {
      window.prompt(ui('pricing', 'shareReady'), link)
    }
  }
  const whatsappMessage = [
    ui('whatsapp', 'greeting', { contact: 'BOTZ' }),
    estimateSummary(q),
    ui('whatsapp', 'closing'),
  ].join('\n')

  return h(
    'aside',
    { class: 'card estimate', 'aria-live': 'polite' },
    title,
    h('dl', { class: 'estimate-rows' }, rows),
    q.isMinimum && h('p', { class: 'muted small' }, ui('pricing', 'minimumNote')),
    h('p', { class: 'muted small' }, ui('pricing', 'notContract')),
    h(
      'div',
      { class: 'estimate-actions' },
      h(
        'a',
        { class: 'btn btn-primary', href: sectionHref('contact', 'contact.html') },
        ui('pricing', 'requestProposal'),
      ),
      h(
        'a',
        { class: 'btn btn-secondary', href: whatsappHref(whatsappMessage), ...external },
        ui('pricing', 'discussWhatsapp'),
      ),
      h(
        'div',
        { class: 'btn-row' },
        h(
          'button',
          { type: 'button', class: 'btn btn-link btn-small', onclick: share },
          ui('pricing', 'shareEstimate'),
        ),
        h(
          'button',
          { type: 'button', class: 'btn btn-link btn-small', onclick: clearSelection },
          ui('pricing', 'clear'),
        ),
      ),
    ),
    status,
  )
}
