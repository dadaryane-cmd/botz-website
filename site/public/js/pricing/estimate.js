/** Human-readable estimate: package titles, a plain-text summary and a shareable link. */
import { catalog } from '../content/catalog.js'
import { formatAmd, formatMonths } from '../lib/format.js'
import { getLanguage, t, ui } from '../lib/i18n.js'
import { quote } from './engine.js'
import { getSelection, toParams } from './selection.js'

export const categoryLabel = (category) => ui('pricing', `cat_${category}`)

/** "SMM Gold", "SEO Vision" — website creation already has a full name. */
export const packageTitle = (pkg) =>
  pkg.category === 'website' ? t(pkg.name) : `${categoryLabel(pkg.category)} ${t(pkg.name)}`

export const currentQuote = () => quote(catalog, getSelection())

/** Plain text for the inquiry email and WhatsApp messages; empty when nothing is selected. */
export function estimateSummary(q = currentQuote()) {
  if (q.isEmpty) return ''
  const lines = []
  if (q.recurring) {
    lines.push(
      `${packageTitle(q.pkg)}, ${formatMonths(q.recurring.months)} — ${formatAmd(q.recurring.monthly)} ${ui('pricing', 'perMonth')}`,
    )
  } else if (q.pkg) {
    lines.push(
      `${packageTitle(q.pkg)} — ${formatAmd(q.packageOneTime)} ${ui('pricing', 'oneTime')}`,
    )
  }
  for (const line of q.addons)
    lines.push(`${t(line.addon.name)} ×${line.quantity} — ${formatAmd(line.total)}`)
  const from = q.isMinimum ? `${ui('pricing', 'from')} ` : ''
  lines.push(`${ui('pricing', 'combinedEstimate')}: ${from}${formatAmd(q.total)}`)
  return lines.join('\n')
}

/** Absolute link that reopens the pricing tool with this selection. */
export function estimateLink(selection = getSelection()) {
  const url = new URL('pricing.html', location.href)
  url.search = toParams(selection)
  url.searchParams.set('lang', getLanguage())
  url.hash = 'pricing'
  return url.href
}
