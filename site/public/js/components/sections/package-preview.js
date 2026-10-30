/**
 * Home page overview: every package's monthly price for one contract length, as a table to scan
 * (name left, price right), with the month-to-month rate crossed out to show the saving.
 * One-time packages (website creation) get their own line below the table.
 */
import { PACKAGE_CATEGORIES } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd, formatMonths } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import { reveal } from '../../lib/reveal.js'
import { availableLengths, isRecurring, monthToMonthPrice, priceFor } from '../../pricing/engine.js'
import { categoryLabel, estimateLink } from '../../pricing/estimate.js'
import { button, heading, lead, section } from './section.js'

export function renderPackagePreview(config) {
  const categories = config.categories?.length ? config.categories : PACKAGE_CATEGORIES
  const months = config.duration ?? 12
  const packages = catalog.packages.filter((pkg) => categories.includes(pkg.category))
  const monthly = packages.filter(isRecurring)
  const oneTime = packages.filter((pkg) => !isRecurring(pkg))
  const tableCategories = categories.filter((category) =>
    monthly.some((pkg) => pkg.category === category),
  )

  return section(
    config,
    heading(config.heading),
    lead(config.intro),
    h(
      'div',
      { class: 'preview-grid' },
      tableCategories.map((category, index) =>
        categoryColumn(
          category,
          monthly.filter((pkg) => pkg.category === category),
          months,
          index,
        ),
      ),
    ),
    oneTime.length > 0 && h('ul', { class: 'preview-one-time' }, oneTime.map(oneTimeRow)),
    h(
      'div',
      { class: 'btn-row' },
      config.link?.href && button(config.link),
      config.showGuideLink &&
        h(
          'a',
          { class: 'btn btn-link', href: sectionHref('guide', 'pricing.html') },
          `${ui('trust', 'finderLink')} →`,
        ),
    ),
  )
}

function categoryColumn(category, packages, months, index) {
  return h(
    'div',
    { class: 'preview-group', ...reveal(index) },
    h('h3', null, categoryLabel(category)),
    h(
      'ul',
      { class: 'preview-list' },
      packages.map((pkg) => previewRow(pkg, months)),
    ),
  )
}

/** One package: name (and notes) on the left, the monthly price on the right. */
function previewRow(pkg, months) {
  const offered = priceFor(pkg, months)
  // Not sold for this long (e.g. SEO Fundamental): show the longest term it is sold for, and say so.
  const term = offered ? months : availableLengths(pkg).at(-1)
  const { monthly } = offered ?? priceFor(pkg, term)

  return h(
    'li',
    null,
    h(
      'a',
      {
        class: 'preview-row',
        href: estimateLink({ packageKey: pkg.key, months: term, addons: {} }),
      },
      h(
        'span',
        { class: 'preview-name' },
        h('strong', null, t(pkg.name)),
        pkg.recommended && h('span', { class: 'preview-tag' }, ui('pricing', 'recommended')),
        !offered &&
          h(
            'span',
            { class: 'preview-note' },
            ui('pricing', 'upToTerm', { term: formatMonths(term) }),
          ),
      ),
      h('span', { class: 'preview-price' }, wasPrice(pkg, monthly), formatAmd(monthly)),
    ),
  )
}

/** The month-to-month rate, crossed out, when the longer term costs less. */
function wasPrice(pkg, monthly) {
  const rate = monthToMonthPrice(pkg)
  if (!rate || rate <= monthly) return null
  return h(
    's',
    { class: 'preview-was' },
    h('span', { class: 'sr-only' }, `${ui('pricing', 'monthToMonth')}: `),
    formatAmd(rate),
  )
}

/** "Website Creation  299,000 ֏ · one-time" */
function oneTimeRow(pkg) {
  return h(
    'li',
    null,
    h(
      'a',
      { class: 'preview-row', href: estimateLink({ packageKey: pkg.key, months: 1, addons: {} }) },
      h('span', { class: 'preview-name' }, h('strong', null, t(pkg.name))),
      h(
        'span',
        { class: 'preview-price' },
        formatAmd(pkg.oneTimePrice),
        h('small', null, ` · ${ui('pricing', 'oneTime')}`),
      ),
    ),
  )
}
