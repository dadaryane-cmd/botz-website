/**
 * Pricing page: every monthly package side by side, its price per month for each contract
 * length and what the longest term saves. Built only from content/catalog.json.
 *
 * Phones have no room for four price columns: there the tables sit folded under a button, and
 * once open they show one contract length at a time, picked with the same buttons (and the same
 * shared choice) as the pricing tool's.
 */
import { CONTRACT_LENGTHS, PACKAGE_CATEGORIES } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd, formatMonths } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { isRecurring, priceFor } from '../../pricing/engine.js'
import { categoryLabel, estimateLink } from '../../pricing/estimate.js'
import { getSelection, subscribe, updateSelection } from '../../pricing/selection.js'
import { heading, lead, section } from './section.js'

/** Below this width the tables show one contract length at a time (comparison.css). */
const PHONE_QUERY = '(max-width: 720px)'

export function renderComparison(config) {
  const categories = config.categories?.length ? config.categories : PACKAGE_CATEGORIES
  const tables = categories
    .map((category) => catalog.packages.filter((pkg) => pkg.category === category))
    .filter((packages) => packages.some(isRecurring))
    .map(comparisonTable)
  const fold = h(
    'details',
    // Open from the start where all columns fit; on phones, folded until asked for.
    { class: 'comparison-fold', open: !window.matchMedia(PHONE_QUERY).matches },
    h('summary', { class: 'btn btn-secondary' }, ui('comparison', 'show')),
    lengthPicker(),
    tables,
  )
  showLength(fold, getSelection().months)
  subscribe(fold, (selection) => showLength(fold, selection.months))
  return section(config, heading(config.heading), lead(config.intro), fold)
}

/** The contract-length buttons shown on phones; the choice is shared with the pricing tool. */
function lengthPicker() {
  const label = ui('pricing', 'durationLabel')
  return h(
    'div',
    { class: 'comparison-lengths' },
    h('span', { class: 'label' }, label),
    h(
      'div',
      { class: 'segmented', role: 'group', 'aria-label': label },
      CONTRACT_LENGTHS.map((months) =>
        h(
          'button',
          { type: 'button', 'data-months': months, onclick: () => updateSelection({ months }) },
          formatMonths(months),
        ),
      ),
    ),
  )
}

/** Marks the chosen length's buttons and price columns; on phones only those columns show. */
function showLength(root, months) {
  for (const element of root.querySelectorAll('[data-months]')) {
    const isChosen = Number(element.dataset.months) === months
    if (element.tagName === 'BUTTON') element.setAttribute('aria-pressed', String(isChosen))
    else element.classList.toggle('is-chosen', isChosen)
  }
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
          CONTRACT_LENGTHS.map((months) =>
            h('th', { scope: 'col', 'data-months': months }, formatMonths(months)),
          ),
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
        // The table's group shows the service on screen; read out of context, "Start" alone
        // says little, so screen readers and search engines get "SMM Start".
        pkg.category !== 'website' &&
          h('span', { class: 'sr-only' }, `${categoryLabel(pkg.category)} `),
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
      { class: 'is-unavailable', 'data-months': months },
      h('span', { 'aria-label': ui('comparison', 'notOffered') }, '—'),
    )
  }
  return h('td', { 'data-months': months }, formatAmd(price.monthly))
}
