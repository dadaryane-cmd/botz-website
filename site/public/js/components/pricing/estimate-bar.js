/**
 * Phones only (css/components/pricing.css): a slim bar that stays at the bottom of the screen
 * while the visitor looks through the packages, with the chosen package, its price and the next
 * step. It is sticky at the end of the pricing tool, so it rests under the estimate when reached.
 */
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd } from '../../lib/format.js'
import { ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import { quote } from '../../pricing/engine.js'
import { packageTitle } from '../../pricing/estimate.js'

export function estimateBar(selection) {
  const totals = quote(catalog, selection)
  if (totals.isEmpty) return null

  const title = totals.pkg ? packageTitle(totals.pkg) : ui('pricing', 'addonsTitle')
  const from = totals.isMinimum ? `${ui('pricing', 'from')} ` : ''
  const price = totals.recurring
    ? `${formatAmd(totals.recurring.monthly)} ${ui('pricing', 'perMonth')}`
    : `${from}${formatAmd(totals.total)}`

  return h(
    'div',
    { class: 'estimate-bar' },
    h('p', { class: 'estimate-bar-text' }, h('strong', null, title), h('span', null, price)),
    h(
      'a',
      { class: 'btn btn-primary btn-small', href: sectionHref('contact', 'contact.html') },
      ui('pricing', 'requestProposal'),
    ),
  )
}
