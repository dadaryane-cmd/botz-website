/** Pricing tool filters: which package group to show and the contract length. */
import { CONTRACT_LENGTHS, PACKAGE_CATEGORIES } from '../../config.js'
import { h } from '../../lib/dom.js'
import { formatMonths } from '../../lib/format.js'
import { ui } from '../../lib/i18n.js'
import { categoryLabel } from '../../pricing/estimate.js'
import { updateSelection } from '../../pricing/selection.js'

/** A labelled row of toggle buttons. */
const group = (label, buttons) =>
  h(
    'div',
    null,
    h('span', { class: 'label' }, label),
    h('div', { class: 'segmented', role: 'group', 'aria-label': label }, buttons),
  )

/** `key` lets the focus stay on this button when the tool re-renders. */
const toggle = (key, pressed, label, onclick) =>
  h('button', { type: 'button', 'data-key': key, 'aria-pressed': String(pressed), onclick }, label)

export function pricingFilters({ lockCategory, category, months, onCategory }) {
  return h(
    'div',
    { class: 'pricing-filters' },
    !lockCategory &&
      group(
        ui('pricing', 'filterLabel'),
        PACKAGE_CATEGORIES.map((option) =>
          toggle(`category-${option}`, option === category, categoryLabel(option), () =>
            onCategory(option),
          ),
        ),
      ),
    // Website creation is a one-time price, so it has no contract length.
    category !== 'website' &&
      group(
        ui('pricing', 'durationLabel'),
        CONTRACT_LENGTHS.map((length) =>
          toggle(`months-${length}`, length === months, formatMonths(length), () =>
            updateSelection({ months: length }),
          ),
        ),
      ),
  )
}
