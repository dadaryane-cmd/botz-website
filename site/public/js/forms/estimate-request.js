/**
 * "Send me this estimate": a phone or WhatsApp number, and the email that tells the team which
 * estimate to send there. No DOM access, so it is unit-tested.
 */
import { isPhone } from './phone.js'

/** The message key in content/ui.json (`form` group) for a number that can't be used, else null. */
export function phoneError(phone) {
  if (!phone) return 'required'
  if (!isPhone(phone)) return 'invalidPhone'
  return null
}

/**
 * The request as an email (the same shape as an inquiry's, js/forms/inquiry.js). `summary` is
 * the estimate as plain text and `link` reopens it in the pricing tool.
 */
export function estimateRequestEmail(phone, { summary, link, page, language }) {
  return {
    subject: `Send the estimate to ${phone}`,
    replyTo: null,
    fields: {
      Request: 'Send me this estimate',
      'Phone / WhatsApp': phone,
      Estimate: summary,
      'Estimate link': link,
      Page: page,
      Language: language.toUpperCase(),
    },
  }
}
