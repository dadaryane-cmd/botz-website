/** Home page overview: every package's monthly price for one contract length. */
import { PACKAGE_CATEGORIES } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import {
  availableLengths,
  isRecurring,
  lowestMonthlyPrice,
  priceFor,
} from '../../pricing/engine.js'
import { categoryLabel, estimateLink } from '../../pricing/estimate.js'
import { button, heading, lead, section } from './section.js'

export function renderPackagePreview(config) {
  const categories = config.categories?.length ? config.categories : PACKAGE_CATEGORIES
  const months = config.duration ?? 12
  return section(
    config,
    heading(config.heading),
    lead(config.intro),
    h(
      'div',
      { class: 'grid grid-4' },
      categories.map((category) => categoryColumn(category, months)),
    ),
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

function categoryColumn(category, months) {
  return h(
    'div',
    { class: 'preview-group' },
    h('h3', null, categoryLabel(category)),
    h(
      'ul',
      { class: 'preview-list' },
      catalog.packages
        .filter((pkg) => pkg.category === category)
        .map((pkg) => previewRow(pkg, months)),
    ),
  )
}

function previewRow(pkg, months) {
  const price = isRecurring(pkg) ? priceFor(pkg, months) : null
  let priceText
  if (!isRecurring(pkg)) priceText = `${formatAmd(pkg.oneTimePrice)} · ${ui('pricing', 'oneTime')}`
  else if (price) priceText = `${formatAmd(price.monthly)} / ${ui('pricing', 'perMonth')}`
  else
    priceText = `${ui('pricing', 'from')} ${formatAmd(lowestMonthlyPrice(pkg))} / ${ui('pricing', 'perMonth')}`

  const linkMonths = price ? months : (availableLengths(pkg).at(-1) ?? 1)
  return h(
    'li',
    null,
    h(
      'a',
      { href: estimateLink({ packageKey: pkg.key, months: linkMonths, addons: {} }) },
      h('strong', null, t(pkg.name)),
      pkg.recommended && h('span', { class: 'badge badge-accent' }, ui('pricing', 'recommended')),
    ),
    h('span', { class: 'price-small' }, priceText),
  )
}
