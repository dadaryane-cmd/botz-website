/**
 * The first message of a WhatsApp chat opened from the site. With a package or add-ons chosen,
 * it names them with their prices, so the agency knows at once what the visitor wants and the
 * visitor need not type it; without a choice, the chat opens empty.
 */
import { ui } from '../lib/i18n.js'

/** `summary`: the estimate as plain text (estimateSummary), or '' when nothing is chosen. */
export function whatsappEstimateMessage(summary) {
  if (!summary) return ''
  return [ui('whatsapp', 'interested'), summary, ui('whatsapp', 'closing')].join('\n')
}
