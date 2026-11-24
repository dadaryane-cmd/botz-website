/**
 * Pricing tool filters: which package group to show and the contract length. Each longer contract
 * says what it saves ("save 24,000 ֏") for `savingsPackage`: the chosen package, else the
 * recommended one.
 */
import { CONTRACT_LENGTHS, PACKAGE_CATEGORIES } from '../../config.js'
import { h } from '../../lib/dom.js'
import { formatAmd, formatMonths } from '../../lib/format.js'
import { ui } from '../../lib/i18n.js'
import { priceFor } from '../../pricing/engine.js'
import { categoryName } from '../../pricing/estimate.js'
import { updateSelection } from '../../pricing/selection.js'

/** A labelled row of toggle buttons; `className` is added to the row. */
const group = (label, buttons, className = '') =>
  h(
    'div',
    null,
    h('span', { class: 'label' }, label),
    h(
      'div',
      { class: `segmented ${className}`.trim(), role: 'group', 'aria-label': label },
      buttons,
    ),
  )

/** `key` lets the focus stay on this button when the tool re-renders. */
const toggle = (key, pressed, label, onclick) =>
  h('button', { type: 'button', 'data-key': key, 'aria-pressed': String(pressed), onclick }, label)

/** "6 months" with "save 24,000 ֏" under it when that contract costs less. */
function lengthLabel(length, savingsPackage) {
  const saving = savingsPackage ? priceFor(savingsPackage, length)?.savings : 0
  if (!saving) return formatMonths(length)
  return [
    formatMonths(length),
    h(
      'small',
      { class: 'length-saving' },
      ui('pricing', 'saveShort', { amount: formatAmd(saving) }),
    ),
  ]
}

export function pricingFilters({ lockCategory, category, months, savingsPackage, onCategory }) {
  return h(
    'div',
    { class: 'pricing-filters' },
    !lockCategory &&
      group(
        ui('pricing', 'filterLabel'),
        PACKAGE_CATEGORIES.map((option) =>
          toggle(`category-${option}`, option === category, categoryName(option), () =>
            onCategory(option),
          ),
        ),
      ),
    // Website creation is a one-time price, so it has no contract length.
    category !== 'website' &&
      group(
        ui('pricing', 'durationLabel'),
        CONTRACT_LENGTHS.map((length) =>
          toggle(`months-${length}`, length === months, lengthLabel(length, savingsPackage), () =>
            updateSelection({ months: length }),
          ),
        ),
        'segmented-lengths',
      ),
  )
}
