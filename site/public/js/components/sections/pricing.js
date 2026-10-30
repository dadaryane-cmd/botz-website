/** Pricing tool: category and contract-length filters, package cards, add-ons and a live estimate. */
import { catalog } from '../../content/index.js'
import { h, renderInto } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { findPackage } from '../../pricing/engine.js'
import { getSelection, subscribe, updateSelection } from '../../pricing/selection.js'
import { addonList } from '../pricing/addon-list.js'
import { estimatePanel } from '../pricing/estimate-panel.js'
import { pricingFilters } from '../pricing/filters.js'
import { packageCard } from '../pricing/package-card.js'
import { heading, section } from './section.js'

export function renderPricing(config) {
  const selected = findPackage(catalog, getSelection().packageKey)
  // Open on the selected package's group, unless this page shows one group only.
  let category = !config.lockCategory && selected ? selected.category : config.defaultCategory
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
    ])
  }

  render()
  subscribe(body, render)
  return section(config, heading(config.heading), body)
}
