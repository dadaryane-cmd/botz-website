import { sendFormSubmit } from './formsubmit.js'
import { sendWeb3Forms } from './web3forms.js'

/**
 * Run `attempts` ([name, send]) in order until one succeeds. The reason each failed is logged
 * for whoever looks after the site; the last one is thrown when none succeeded.
 */
export async function firstToSucceed(attempts) {
  let lastError = new Error('No delivery service is set up')
  for (const [name, send] of attempts) {
    try {
      await send()
      return name
    } catch (error) {
      console.warn(`Inquiry not sent through ${name}:`, error.message)
      lastError = error
    }
  }
  throw lastError
}

/**
 * Deliver an inquiry email: through Web3Forms (site.web3formsKey) and, should that fail, through
 * FormSubmit (site.formEmail), so one service being down does not stop inquiries. Returns the
 * service that delivered it; throws when none did.
 */
export function sendInquiry(site, email) {
  const attempts = [
    site.web3formsKey && ['Web3Forms', () => sendWeb3Forms(site.web3formsKey, email)],
    site.formEmail && ['FormSubmit', () => sendFormSubmit(site.formEmail, email)],
  ].filter(Boolean)
  return firstToSucceed(attempts)
}
