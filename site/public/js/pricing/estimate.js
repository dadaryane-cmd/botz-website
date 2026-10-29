/** Human-readable estimate: package titles, a plain-text summary and a shareable link. */
import { catalog } from '../content/index.js'
import { formatAmd, formatMonths } from '../lib/format.js'
import { getLanguage, t, ui } from '../lib/i18n.js'
import { quote } from './engine.js'
import { getSelection, toParams } from './selection.js'

export const categoryLabel = (category) => ui('pricing', `cat_${category}`)

/** "SMM Gold", "SEO Vision" — website creation already has a full name. */
export const packageTitle = (pkg) =>
  pkg.category === 'website' ? t(pkg.name) : `${categoryLabel(pkg.category)} ${t(pkg.name)}`

const currentQuote = () => quote(catalog, getSelection())

/** Plain text for the inquiry email and WhatsApp messages; empty when nothing is selected. */
export function estimateSummary(totals = currentQuote()) {
  if (totals.isEmpty) return ''
  const lines = []
  if (totals.recurring) {
    const { months, monthly } = totals.recurring
    const term = formatMonths(months)
    lines.push(
      `${packageTitle(totals.pkg)}, ${term} — ${formatAmd(monthly)} ${ui('pricing', 'perMonth')}`,
    )
  } else if (totals.pkg) {
    const price = formatAmd(totals.packageOneTime)
    lines.push(`${packageTitle(totals.pkg)} — ${price} ${ui('pricing', 'oneTime')}`)
  }
  for (const line of totals.addons) {
    lines.push(`${t(line.addon.name)} ×${line.quantity} — ${formatAmd(line.total)}`)
  }
  const from = totals.isMinimum ? `${ui('pricing', 'from')} ` : ''
  lines.push(`${ui('pricing', 'combinedEstimate')}: ${from}${formatAmd(totals.total)}`)
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
