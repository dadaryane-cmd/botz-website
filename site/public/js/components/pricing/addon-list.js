/** One-time extras in the pricing tool, each with an add button or a quantity stepper. */
import { MAX_ADDON_QUANTITY } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { getSelection, updateSelection } from '../../pricing/selection.js'

export function addonList(selection) {
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

/** Store a quantity; 0 removes the add-on, and the maximum is capped. */
function setQuantity(addon, quantity) {
  const addons = { ...getSelection().addons }
  if (quantity > 0) addons[addon.key] = Math.min(MAX_ADDON_QUANTITY, quantity)
  else delete addons[addon.key]
  updateSelection({ addons })
}

function addonRow(addon, quantity) {
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
    quantity ? stepper(addon, quantity) : addButton(addon),
  )
}

function addButton(addon) {
  return h(
    'button',
    {
      type: 'button',
      class: 'btn btn-secondary btn-small',
      'data-key': `add-${addon.key}`,
      onclick: () => setQuantity(addon, 1),
    },
    ui('pricing', 'add'),
  )
}

function stepper(addon, quantity) {
  const step = (key, label, symbol, change) =>
    h(
      'button',
      {
        type: 'button',
        'data-key': `${key}-${addon.key}`,
        'aria-label': label,
        onclick: () => setQuantity(addon, quantity + change),
      },
      symbol,
    )
  return h(
    'div',
    {
      class: 'stepper',
      role: 'group',
      'aria-label': `${ui('pricing', 'quantity')}: ${t(addon.name)}`,
    },
    step('less', ui('pricing', 'remove'), '−', -1),
    h('output', null, String(quantity)),
    step('more', ui('pricing', 'add'), '+', 1),
  )
}
