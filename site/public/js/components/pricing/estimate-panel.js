/** The live estimate beside the pricing tool: line items, totals and what to do next. */
import { catalog } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { external, whatsappHref } from '../../lib/links.js'
import { sectionHref } from '../../lib/page.js'
import { quote } from '../../pricing/engine.js'
import { estimateLink, estimateSummary, packageTitle } from '../../pricing/estimate.js'
import { clearSelection } from '../../pricing/selection.js'
import { animatedAmount } from '../animated-amount.js'

export function estimatePanel(selection) {
  const totals = quote(catalog, selection)
  const title = h('h3', null, ui('pricing', 'estimateTitle'))
  if (totals.isEmpty) {
    return h(
      'aside',
      { class: 'card estimate' },
      title,
      h('p', { class: 'muted' }, ui('pricing', 'noSelection')),
    )
  }

  const status = h('p', { class: 'small', role: 'status' })
  return h(
    'aside',
    { class: 'card estimate', 'aria-live': 'polite' },
    title,
    h('dl', { class: 'estimate-rows' }, estimateRows(totals)),
    totals.isMinimum && h('p', { class: 'muted small' }, ui('pricing', 'minimumNote')),
    h('p', { class: 'muted small' }, ui('pricing', 'notContract')),
    h(
      'div',
      { class: 'estimate-actions' },
      h(
        'a',
        { class: 'btn btn-primary', href: sectionHref('contact', 'contact.html') },
        ui('pricing', 'requestProposal'),
      ),
      h(
        'a',
        { class: 'btn btn-secondary', href: whatsappHref(whatsappMessage(totals)), ...external },
        ui('pricing', 'discussWhatsapp'),
      ),
      h(
        'div',
        { class: 'btn-row' },
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn-link btn-small',
            onclick: () => shareEstimate(selection, status),
          },
          ui('pricing', 'shareEstimate'),
        ),
        h(
          'button',
          { type: 'button', class: 'btn btn-link btn-small', onclick: clearSelection },
          ui('pricing', 'clear'),
        ),
      ),
    ),
    status,
  )
}

/** Package, add-ons, subtotals and the combined total, as `<dt>` / `<dd>` rows. */
function estimateRows(totals) {
  const row = (label, value, kind) =>
    h(
      'div',
      { class: kind ? `estimate-row ${kind}` : 'estimate-row' },
      h('dt', null, label),
      h('dd', null, value),
    )
  const rows = []

  if (totals.recurring) {
    const { monthly, months, total } = totals.recurring
    const perMonth = [animatedAmount('estimate-monthly', monthly), ` × ${months}`]
    rows.push(row(packageTitle(totals.pkg), perMonth))
    rows.push(
      row(ui('pricing', 'recurringFees'), animatedAmount('estimate-recurring', total), 'subtotal'),
    )
  } else if (totals.pkg) {
    rows.push(row(packageTitle(totals.pkg), formatAmd(totals.packageOneTime)))
  }

  for (const line of totals.addons) {
    rows.push(row(`${t(line.addon.name)} ×${line.quantity}`, formatAmd(line.total)))
  }
  if (totals.oneTimeTotal) {
    const oneTime = animatedAmount('estimate-one-time', totals.oneTimeTotal)
    rows.push(row(ui('pricing', 'oneTimeFees'), oneTime, 'subtotal'))
  }

  const from = totals.isMinimum && `${ui('pricing', 'from')} `
  const total = animatedAmount('estimate-total', totals.total)
  rows.push(row(ui('pricing', 'combinedEstimate'), [from, total], 'total'))
  return rows
}

const whatsappMessage = (totals) =>
  [
    ui('whatsapp', 'greeting', { contact: 'BOTZ' }),
    estimateSummary(totals),
    ui('whatsapp', 'closing'),
  ].join('\n')

/** Copy a link that reopens this estimate; where copying is blocked, show it to copy by hand. */
async function shareEstimate(selection, status) {
  const link = estimateLink(selection)
  try {
    await navigator.clipboard.writeText(link)
    status.textContent = ui('pricing', 'shareCopied')
  } catch {
    window.prompt(ui('pricing', 'shareReady'), link)
  }
}
