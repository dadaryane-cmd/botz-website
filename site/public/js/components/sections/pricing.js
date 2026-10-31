/** Pricing tool: category and contract-length filters, package cards, add-ons and a live estimate. */
import { catalog } from '../../content/index.js'
import { h, renderInto } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { findPackage } from '../../pricing/engine.js'
import {
  categoryFromSearch,
  getSelection,
  subscribe,
  updateSelection,
} from '../../pricing/selection.js'
import { addonList } from '../pricing/addon-list.js'
import { estimateBar } from '../pricing/estimate-bar.js'
import { estimatePanel } from '../pricing/estimate-panel.js'
import { pricingFilters } from '../pricing/filters.js'
import { packageCard } from '../pricing/package-card.js'
import { heading, section } from './section.js'

export function renderPricing(config) {
  const selected = findPackage(catalog, getSelection().packageKey)
  let category = startCategory(config, selected)
  // Nothing chosen yet: start at the contract length this page suggests.
  if (!selected && config.defaultDuration > 1) {
    updateSelection({ months: config.defaultDuration })
  }

  const body = h('div', { class: 'pricing' })
  const showCategory = (next) => {
    category = next
    render()
  }

  function render() {
    const selection = getSelection()
    const packages = catalog.packages.filter((pkg) => pkg.category === category)
    renderInto(body, [
      pricingFilters({
        lockCategory: config.lockCategory,
        category,
        months: selection.months,
        onCategory: showCategory,
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
            packages.map((pkg) => packageCard(pkg, selection)),
          ),
          h('p', { class: 'muted small' }, ui('pricing', 'scopeInProposal')),
          config.showAddons && addonList(selection),
        ),
        estimatePanel(selection),
      ),
      estimateBar(selection),
    ])
  }

  render()
  subscribe(body, render)
  return section(config, heading(config.heading), body)
}

/**
 * The group shown first: the page's own when it shows one group only; otherwise the one a link
 * asks for (`?cat=seo`), then the selected package's, then the page's default.
 */
function startCategory(config, selected) {
  if (config.lockCategory) return config.defaultCategory
  return categoryFromSearch(location.search) ?? selected?.category ?? config.defaultCategory
}
