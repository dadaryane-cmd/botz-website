/** One package in the pricing tool: name, price for the chosen length and a select button. */
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd, formatMonths } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { availableLengths, findPackage, isRecurring, priceFor } from '../../pricing/engine.js'
import { packageTitle } from '../../pricing/estimate.js'
import { updateSelection } from '../../pricing/selection.js'
import { animatedAmount } from '../animated-amount.js'

export function packageCard(pkg, selection) {
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
    pkg.components?.length > 0 && bundleNote(pkg),
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

/** "SMM Gold + SEO Vision" for packages that combine others. */
function bundleNote(pkg) {
  const list = pkg.components.map((key) => packageTitle(findPackage(catalog, key))).join(' + ')
  return h('p', { class: 'muted small' }, ui('pricing', 'bundleOf', { list }))
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
      animatedAmount(`${pkg.key}-monthly`, price.monthly),
      h('small', null, ` ${ui('pricing', 'perMonth')}`),
    ),
    h(
      'p',
      { class: 'small' },
      `${totalLabel}: `,
      h('strong', null, animatedAmount(`${pkg.key}-total`, price.total)),
    ),
    savingsLine(pkg, price),
  ]
}

/** "You save {amount}", with a counting amount in place of the placeholder. */
function savingsLine(pkg, price) {
  if (!price.savings) return h('p', { class: 'small muted' }, ui('pricing', 'noSavings'))
  const [before, after] = ui('pricing', 'youSave', { amount: '{amount}' }).split('{amount}')
  return h(
    'p',
    { class: 'small saving' },
    before,
    animatedAmount(`${pkg.key}-savings`, price.savings),
    after,
  )
}
