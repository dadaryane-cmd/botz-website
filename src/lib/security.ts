import crypto from 'node:crypto'

const secret = () => {
  const s = process.env.PAYLOAD_SECRET
  if (!s) throw new Error('PAYLOAD_SECRET is not set')
  return s
}

/** Unguessable URL-safe token (256 bits). */
export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url')

const hmac = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('base64url')

/** Signed form token: proves the form was loaded from our server and when. */
export function issueFormToken(now = Date.now()) {
  const ts = String(now)
  return `${ts}.${hmac(`form:${ts}`)}`
}

export type FormTokenCheck = 'ok' | 'invalid' | 'too_fast' | 'expired'

export function checkFormToken(token: unknown, now = Date.now(), minMs = 2500, maxMs = 1000 * 60 * 60 * 6): FormTokenCheck {
  if (typeof token !== 'string') return 'invalid'
  const [ts, sig] = token.split('.')
  if (!ts || !sig) return 'invalid'
  const expected = hmac(`form:${ts}`)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'invalid'
  const age = now - Number(ts)
  if (!Number.isFinite(age) || age < 0) return 'invalid'
  if (age < minMs) return 'too_fast'
  if (age > maxMs) return 'expired'
  return 'ok'
}

/** Hash an IP so rate limiting never stores raw addresses. */
export const hashIp = (ip: string) => hmac(`ip:${ip}`).slice(0, 24)

export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Sliding-window limiter kept in memory. Good for a single server process
 * (the recommended deployment). For several instances, put the app behind a
 * proxy-level limit as well — see docs/DEPLOYMENT.md.
 */
const buckets = new Map<string, number[]>()
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const list = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (list.length >= limit) {
    buckets.set(key, list)
    return false
  }
  list.push(now)
  buckets.set(key, list)
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k)
  }
  return true
}

export const resetRateLimits = () => buckets.clear()
