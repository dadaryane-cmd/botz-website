import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { CatalogProvider } from '@/components/client/CatalogProvider'
import { LivePreviewRefresh } from '@/components/client/LivePreviewRefresh'
import { MobileBar } from '@/components/client/MobileBar'
import { Runtime } from '@/components/client/Runtime'
import { SiteFooter } from '@/components/SiteFooter'
import { isLocale, localeTags, locales, type Locale } from '@/i18n/config'
import type { AnalyticsConfig } from '@/lib/client/analytics'
import { getCatalog, getSite, isPreview } from '@/lib/data'
import { themeCss } from '@/lib/themeCss'
import { fontStack, fontVariables } from '../fonts'
import '../styles.css'
import '../bulb.css'
import '../flame.css'
import '../trust.css'

export const dynamicParams = false

// Content comes from the CMS at request time (and from the data cache), never at build time.
export const dynamic = 'force-dynamic'
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const site = await getSite(locale)
  const fav = site.theme.logos?.favicon?.url
  return {
    metadataBase: new URL(siteUrl),
    applicationName: site.settings.siteName,
    icons: fav
      ? { icon: [{ url: fav }], apple: [{ url: fav }] }
      : {
          icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/brand/icon-192.png', type: 'image/png', sizes: '192x192' }],
          apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
        },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDF6EC' },
    { media: '(prefers-color-scheme: dark)', color: '#0E0E0F' },
  ],
}

/** Runs before paint: saved theme (or CMS default / device), and motion permission. */
const headScript = `(function(){try{var d=document.documentElement,s=null;try{s=localStorage.getItem('botz:theme')}catch(e){}var def=d.getAttribute('data-theme-default')||'system';var t=s==='light'||s==='dark'?s:def==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):def;d.setAttribute('data-theme',t);var m=d.getAttribute('data-motion-setting')||'subtle';if(matchMedia('(prefers-reduced-motion: reduce)').matches)m='off';d.setAttribute('data-motion',m);if(m!=='off')d.classList.add('js-motion')}catch(e){}})();`

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const [site, catalog, preview] = await Promise.all([getSite(locale), getCatalog(locale), isPreview()])
  const theme = site.theme
  const css = themeCss(theme, {
    display: fontStack(theme.type?.displayFont, 'unbounded'),
    body: fontStack(theme.type?.bodyFont, 'manrope'),
  })
  const defaultMode = ['light', 'dark', 'system'].includes(theme.defaultMode) ? theme.defaultMode : 'system'
  const motion = ['off', 'subtle', 'expressive'].includes(theme.motion?.intensity) ? theme.motion.intensity : 'expressive'

  const provider = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? 'none') as AnalyticsConfig['provider']
  const analytics: AnalyticsConfig = {
    provider: ['ga4', 'plausible'].includes(provider) ? provider : 'none',
    id: provider === 'ga4' ? process.env.NEXT_PUBLIC_GA_ID : provider === 'plausible' ? process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN : undefined,
    requireConsent: site.settings.analytics?.requireConsent !== false,
    events: site.settings.analytics?.events ?? [],
  }
  const bar = site.settings.contacts?.mobileBar ?? {}

  return (
    <html
      lang={localeTags[locale]}
      className={fontVariables}
      data-theme={defaultMode === 'dark' ? 'dark' : 'light'}
      data-theme-default={defaultMode}
      data-motion-setting={motion}
      data-motion={motion}
      data-buttons={theme.type?.buttonStyle === 'contrast' ? 'contrast' : 'solid'}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {site.strings.common.skipToContent}
        </a>
        {preview && (
          <div className="preview-banner" role="status">
            <span>{site.strings.common.draftBanner}</span>
            <a href={`/next/exit-preview?path=/${locale}`}>{site.strings.common.exitPreview}</a>
            <LivePreviewRefresh serverURL={siteUrl} />
          </div>
        )}
        {children}
        <SiteFooter site={site} locale={locale} />
        <CatalogProvider catalog={catalog} />
        {bar.enabled !== false && (
          <MobileBar
            contacts={site.contacts}
            locale={locale}
            strings={{ whatsapp: site.strings.whatsapp, pricing: site.strings.pricing, services: site.strings.services, contact: site.strings.contact }}
            show={{ call: bar.showCall !== false, whatsapp: bar.showWhatsapp !== false, email: Boolean(bar.showEmail) }}
          />
        )}
        <Runtime analytics={analytics} consentText={site.strings.consent} locale={locale} />
      </body>
    </html>
  )
}
