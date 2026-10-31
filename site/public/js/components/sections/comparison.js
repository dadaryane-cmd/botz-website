/**
 * Pricing page: every monthly package side by side, its price per month for each contract
 * length and what the longest term saves. Built only from content/catalog.json.
 */
import { CONTRACT_LENGTHS, PACKAGE_CATEGORIES } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd, formatMonths } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { isRecurring, priceFor } from '../../pricing/engine.js'
import { categoryLabel, estimateLink } from '../../pricing/estimate.js'
import { heading, lead, section } from './section.js'

export function renderComparison(config) {
  const categories = config.categories?.length ? config.categories : PACKAGE_CATEGORIES
  const tables = categories
    .map((category) => catalog.packages.filter((pkg) => pkg.category === category))
    .filter((packages) => packages.some(isRecurring))
    .map(comparisonTable)
  return section(config, heading(config.heading), lead(config.intro), tables)
}

function comparisonTable(packages) {
  const longest = CONTRACT_LENGTHS.at(-1)
  return h(
    'div',
    { class: 'comparison-scroll' },
    h(
      'table',
      { class: 'comparison' },
      h('caption', null, categoryLabel(packages[0].category)),
      h(
        'thead',
        null,
        h(
          'tr',
          null,
          // The names speak for themselves; only screen readers hear the column's title.
          h('th', { scope: 'col' }, h('span', { class: 'sr-only' }, ui('comparison', 'package'))),
          CONTRACT_LENGTHS.map((months) => h('th', { scope: 'col' }, formatMonths(months))),
          h('th', { scope: 'col' }, ui('comparison', 'saving', { term: formatMonths(longest) })),
        ),
      ),
      h(
        'tbody',
        null,
        packages.map((pkg) => packageRow(pkg, longest)),
      ),
    ),
  )
}

function packageRow(pkg, longest) {
  const longestPrice = priceFor(pkg, longest)
  return h(
    'tr',
    { class: pkg.recommended ? 'is-recommended' : null },
    h(
      'th',
      { scope: 'row' },
      h(
        'a',
        { href: estimateLink({ packageKey: pkg.key, months: longest, addons: {} }) },
        t(pkg.name),
      ),
      pkg.recommended && h('span', { class: 'preview-tag' }, ui('pricing', 'recommended')),
    ),
    CONTRACT_LENGTHS.map((months) => priceCell(pkg, months)),
    h(
      'td',
      { class: 'comparison-saving' },
      longestPrice?.savings ? formatAmd(longestPrice.savings) : '—',
    ),
  )
}

/** The monthly price for this length, or a dash where the package is not offered. */
function priceCell(pkg, months) {
  const price = priceFor(pkg, months)
  if (!price) {
    return h(
      'td',
      { class: 'is-unavailable' },
      h('span', { 'aria-label': ui('comparison', 'notOffered') }, '—'),
    )
  }
  return h('td', null, formatAmd(price.monthly))
}
