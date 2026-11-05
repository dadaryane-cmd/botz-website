import { SEND_TIMEOUT_MS } from '../config.js'

/**
 * POST `body` as JSON and return the service's JSON reply ({} when it sent none). Gives up after
 * SEND_TIMEOUT_MS, so a service that does not answer never keeps the visitor waiting long.
 */
export async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout?.(SEND_TIMEOUT_MS),
  })
  const result = await response.json().catch(() => ({}))
  return { ok: response.ok, status: response.status, result }
}
