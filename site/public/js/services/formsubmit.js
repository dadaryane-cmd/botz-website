import { FORMSUBMIT_ENDPOINT } from '../config.js'

/**
 * Email form fields to `recipient` through FormSubmit. The first submission to a new
 * address triggers an activation email; until it is confirmed, sending fails.
 */
export async function sendForm(recipient, fields) {
  const response = await fetch(FORMSUBMIT_ENDPOINT + encodeURIComponent(recipient), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(fields),
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || String(result.success) !== 'true') {
    throw new Error(result.message || `FormSubmit responded ${response.status}`)
  }
}
