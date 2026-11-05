import { FORMSUBMIT_ENDPOINT } from '../config.js'
import { postJson } from './post-json.js'

/**
 * FormSubmit's format (https://formsubmit.co/documentation): keys starting with `_` set up the
 * email, every other key is a row of its table.
 */
export const formSubmitBody = ({ subject, replyTo, fields }) => ({
  _subject: subject,
  _template: 'table',
  _captcha: 'false',
  ...(replyTo && { _replyto: replyTo }),
  ...fields,
})

/**
 * Email `email` (js/forms/inquiry.js inquiryEmail) to `recipient`. The first message to a new
 * address triggers an activation email; until it is confirmed, sending fails.
 */
export async function sendFormSubmit(recipient, email) {
  const { ok, status, result } = await postJson(
    FORMSUBMIT_ENDPOINT + encodeURIComponent(recipient),
    formSubmitBody(email),
  )
  if (!ok || String(result.success) !== 'true') {
    throw new Error(result.message || `FormSubmit responded ${status}`)
  }
}
