/**
 * Google Analytics 4, once a measurement id is set in Pages CMS (Contact details → GA4). Without
 * one nothing loads and events go nowhere. Google's script is fetched only after the page has
 * loaded and the browser is idle, so it never delays the page (Core Web Vitals).
 *
 * Events, as GA4 names them: `generate_lead` when the inquiry form is sent, and `contact` with a
 * `method` (whatsapp, phone, email, telegram) when a visitor taps one of those links anywhere on
 * the site. Mark both as key events in GA4 to count them as conversions.
 */

const GTAG_URL = 'https://www.googletagmanager.com/gtag/js'

let started = false

/** The contact method a link opens, or null: "https://wa.me/…" → "whatsapp". */
export function contactMethod(href) {
  const address = String(href)
  if (address.startsWith('tel:')) return 'phone'
  if (address.startsWith('mailto:')) return 'email'
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(address)) return 'whatsapp'
  if (/^https:\/\/t\.me\//.test(address)) return 'telegram'
  return null
}

/** A valid GA4 measurement id: "G-" and letters or digits. */
export const isMeasurementId = (id) => typeof id === 'string' && /^G-[A-Z0-9]+$/.test(id)

/** Send an event (nothing happens when analytics is not set up). */
export function trackEvent(name, params = {}) {
  if (started) window.gtag('event', name, params)
}

/** Start GA4 with this measurement id, if it is one. Call once, after the page is drawn. */
export function startAnalytics(measurementId) {
  if (started || !isMeasurementId(measurementId)) return
  started = true
  window.dataLayer = window.dataLayer ?? []
  // Google's script reads each call's `arguments` object from the queue, so gtag must push it.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', measurementId)
  document.addEventListener('click', recordContactClick, { capture: true })
  whenIdle(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = `${GTAG_URL}?id=${measurementId}`
    document.head.append(script)
  })
}

function recordContactClick(event) {
  const link = event.target.closest?.('a[href]')
  const method = link && contactMethod(link.href)
  if (method) trackEvent('contact', { method })
}

/** After the page has loaded, when the browser has nothing more urgent to do. */
function whenIdle(callback) {
  const later = () => (window.requestIdleCallback ?? setTimeout)(callback)
  if (document.readyState === 'complete') later()
  else window.addEventListener('load', later, { once: true })
}
