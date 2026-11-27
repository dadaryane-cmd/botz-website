/**
 * A service page's advantages, then its packages: each named and described in plain words, with
 * a link that opens the prices page on that package. The prices themselves are shown only on
 * the prices page, so they are kept in one place.
 */
import { DEFAULT_CONTRACT_LENGTH } from '../../config.js'
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { hasText, t, ui } from '../../lib/i18n.js'
import { REVEAL } from '../../lib/reveal.js'
import { estimateLink, packageTitle } from '../../pricing/estimate.js'
import { heading, lead, section } from './section.js'

export function renderServicePackages(config) {
  const packages = catalog.packages.filter((pkg) => pkg.category === config.category)
  return section(
    config,
    heading(config.heading),
    lead(config.intro),
    config.advantages?.length > 0 &&
      h('ul', { class: 'advantages' }, config.advantages.map(advantage)),
    hasText(config.packagesHeading) &&
      h('h3', { class: 'service-packages-title' }, t(config.packagesHeading)),
    packages.length > 0 && h('ul', { class: 'service-packages' }, packages.map(packageLink)),
    // With several packages, the prices page can show them side by side.
    packages.length > 1 &&
      h(
        'p',
        { class: 'service-packages-compare' },
        h('a', { class: 'text-link', href: `pricing.html?cat=${config.category}` }, [
          ui('pricing', 'compareAll'),
          ' →',
        ]),
      ),
  )
}

const advantage = (item) =>
  h(
    'li',
    { class: 'advantage', ...REVEAL },
    h('h3', null, t(item.title)),
    h('p', { class: 'muted' }, t(item.text)),
  )

/** "SMM Pro", who it is for, and "Price and what's included →", opening the prices page on it. */
function packageLink(pkg) {
  const href = estimateLink({ packageKey: pkg.key, months: DEFAULT_CONTRACT_LENGTH, addons: {} })
  return h(
    'li',
    null,
    h(
      'a',
      { class: 'card service-package', href, ...REVEAL },
      pkg.recommended && h('span', { class: 'badge badge-accent' }, ui('pricing', 'recommended')),
      // Browser translation must not turn "Max" into "Макс" (as on the price cards).
      h('strong', { class: 'service-package-name', translate: 'no' }, packageTitle(pkg)),
      h('span', { class: 'muted' }, t(pkg.tagline)),
      h('span', { class: 'service-package-more' }, `${ui('pricing', 'seePrice')} →`),
    ),
  )
}
