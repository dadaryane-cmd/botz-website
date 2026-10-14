'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'
import {
  configureAnalytics,
  getConsent,
  setConsent,
  track,
  type AnalyticsConfig,
  type AnalyticsEvent,
} from '@/lib/client/analytics'
import { getPageCategory, getSelection } from '@/lib/client/selection'

type Props = {
  analytics: AnalyticsConfig
  consentText: { text: string; accept: string; decline: string }
  locale: string
}

const subscribeConsent = (cb: () => void) => {
  window.addEventListener('botz:consent', cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('botz:consent', cb)
    window.removeEventListener('storage', cb)
  }
}

function loadProvider(c: AnalyticsConfig) {
  if (document.getElementById('botz-analytics') || !c.id) return
  const s = document.createElement('script')
  s.id = 'botz-analytics'
  s.async = true
  if (c.provider === 'ga4') {
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(c.id)}`
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void }
    w.dataLayer = w.dataLayer || []
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments)
    }
    w.gtag('js', new Date())
    w.gtag('config', c.id, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false })
  } else if (c.provider === 'plausible') {
    s.src = 'https://plausible.io/js/script.tagged-events.js'
    s.dataset.domain = c.id
    ;(window as unknown as { plausible: unknown }).plausible =
      (window as unknown as { plausible?: unknown }).plausible ||
      function (...args: unknown[]) {
        const w = window as unknown as { plausible: { q?: unknown[] } }
        ;(w.plausible.q = w.plausible.q || []).push(args)
      }
  } else return
  document.head.appendChild(s)
}

/**
 * One small client runtime for the whole site: scroll reveals, click
 * tracking for WhatsApp/phone/email/language links, analytics loading after
 * consent, and the consent banner. Keeps per-component JavaScript minimal.
 */
export function Runtime({ analytics, consentText, locale }: Props) {
  const consent = useSyncExternalStore(subscribeConsent, () => getConsent() ?? 'unset', () => 'pending')
  const providerEnabled = analytics.provider !== 'none' && Boolean(analytics.id)
  const askConsent = providerEnabled && analytics.requireConsent && consent === 'unset'
  const pathname = usePathname()

  useEffect(() => {
    configureAnalytics(analytics)
    if (providerEnabled && (!analytics.requireConsent || consent === 'granted')) loadProvider(analytics)
  }, [analytics, providerEnabled, consent])

  // Remember the language so the bare domain opens it next time.
  useEffect(() => {
    document.cookie = `botz-locale=${locale}; path=/; max-age=31536000; samesite=lax`
  }, [locale])

  // Keep the phone browser's address-bar colour in step with the site theme (including manual switches).
  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
      if (!bg) return
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = bg
      document.head.appendChild(meta)
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])

  // Scroll reveals (only when motion is allowed; see html.js-motion).
  useEffect(() => {
    const root = document.documentElement
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'))
    if (!root.classList.contains('js-motion') || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // Delegated click tracking. A WhatsApp click is an analytics event — never a lead.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      let event: AnalyticsEvent | null = null
      if (href.startsWith('https://wa.me/')) event = 'whatsapp_click'
      else if (href.startsWith('tel:')) event = 'phone_click'
      else if (href.startsWith('mailto:')) event = 'email_click'
      else if (a.dataset.track === 'language_select') event = 'language_select'
      if (!event) return
      const sel = getSelection()
      track(event, {
        contact: a.dataset.contact,
        service: a.dataset.service ?? sel.category ?? getPageCategory() ?? undefined,
        package: sel.packageKey ?? undefined,
        locale: a.dataset.locale ?? locale,
        from_locale: event === 'language_select' ? locale : undefined,
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [locale])

  if (!askConsent) return null
  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Analytics">
      <p style={{ margin: 0 }}>{consentText.text}</p>
      <div className="btn-row">
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setConsent('granted')}
        >
          {consentText.accept}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => setConsent('denied')}
        >
          {consentText.decline}
        </button>
      </div>
    </div>
  )
}
