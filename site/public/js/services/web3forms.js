import { WEB3FORMS_ENDPOINT } from '../config.js'
import { postJson } from './post-json.js'

/**
 * Web3Forms' format (https://docs.web3forms.com): the access key names the inbox, `subject`,
 * `from_name` and `replyto` set up the email, and every other key is a row of its table.
 */
export const web3FormsBody = (accessKey, { subject, replyTo, fields }) => ({
  access_key: accessKey,
  subject,
  from_name: 'BOTZ website',
  ...(replyTo && { replyto: replyTo }),
  ...fields,
})

/** Email `email` (js/forms/inquiry.js inquiryEmail) to the inbox of `accessKey`. */
export async function sendWeb3Forms(accessKey, email) {
  const { ok, status, result } = await postJson(WEB3FORMS_ENDPOINT, web3FormsBody(accessKey, email))
  if (!ok || result.success !== true) {
    throw new Error(result.message || `Web3Forms responded ${status}`)
  }
}
