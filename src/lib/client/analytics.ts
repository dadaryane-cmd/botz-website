'use client'

/**
 * Privacy-preserving analytics.
 * - Disabled until a provider is configured (env) AND, when required, the visitor consents.
 * - Only whitelisted, non-personal properties are ever sent.
 * - Identical events within a short window are dropped (double clicks, re-renders);
 *   view events fire at most once per page load.
 */
export type AnalyticsEvent =
  | 'service_view'
  | 'package_view'
  | 'duration_change'
  | 'package_compare'
  | 'guide_complete'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'inquiry_saved'
  | 'estimate_created'
  | 'language_select'

export type AnalyticsConfig = {
  provider: 'ga4' | 'plausible' | 'none'
  id?: string
  requireConsent: boolean
  events: string[]
}

const ALLOWED_PROPS = new Set(['service', 'package', 'packages', 'duration', 'locale', 'from_locale', 'contact', 'addons', 'category', 'result', 'page', 'value'])
const DEDUPE_MS = 1500
const CONSENT_KEY = 'botz:analytics-consent'

let config: AnalyticsConfig = { provider: 'none', requireConsent: true, events: [] }
const recent = new Map<string, number>()
const viewedOnce = new Set<string>()
type Sent = { event: AnalyticsEvent; props: Record<string, string | number> }
const sentLog: Sent[] = []

export function configureAnalytics(c: AnalyticsConfig) {
  config = c
}

export function getConsent(): 'granted' | 'denied' | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function setConsent(v: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(CONSENT_KEY, v)
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent('botz:consent', { detail: v }))
}

export const trackingAllowed = () =>
  config.provider !== 'none' && Boolean(config.id) && (!config.requireConsent || getConsent() === 'granted')

/** Remove anything not explicitly allowed; strip values that look like personal data. */
export function sanitize(props: Record<string, unknown> = {}): Record<string, string | number> {
  const out: Record<string, string | number> = {}
  for (const [k, v] of Object.entries(props)) {
    if (!ALLOWED_PROPS.has(k)) continue
    if (typeof v === 'number' && Number.isFinite(v)) out[k] = v
    else if (typeof v === 'string') {
      const s = v.slice(0, 80)
      if (/@|\+?\d[\d\s()-]{6,}/.test(s)) continue // email or phone-like
      out[k] = s
    }
  }
  return out
}

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}, opts: { oncePerPage?: boolean } = {}): boolean {
  if (config.events.length && !config.events.includes(event)) return false
  const clean = sanitize(props)
  const key = `${event}:${JSON.stringify(clean)}`
  if (opts.oncePerPage) {
    const pageKey = `${typeof window !== 'undefined' ? window.location.pathname : ''}|${key}`
    if (viewedOnce.has(pageKey)) return false
    viewedOnce.add(pageKey)
  }
  const now = Date.now()
  const last = recent.get(key)
  if (last && now - last < DEDUPE_MS) return false
  recent.set(key, now)
  if (!trackingAllowed()) return false
  sentLog.push({ event, props: clean })
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; plausible?: (e: string, o?: unknown) => void }
  if (config.provider === 'ga4') w.gtag?.('event', event, clean)
  else if (config.provider === 'plausible') w.plausible?.(event, { props: clean })
  return true
}

/** For tests and debugging. */
export const _sentEvents = () => sentLog
export const _resetAnalytics = () => {
  recent.clear()
  viewedOnce.clear()
  sentLog.length = 0
}
