import type { Metadata } from 'next'
import { locales, localeTags, type Locale } from '@/i18n/config'
import type { SiteData } from './data'

export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export const pagePath = (locale: Locale, slug?: string | null) => `/${locale}${slug ? `/${slug}` : ''}`

/**
 * Localized metadata: self-referencing canonical, reciprocal hreflang for
 * every language that really has this page, and x-default pointing at the
 * configured first-visit language (when available).
 */
export function buildMetadata(args: {
  site: SiteData
  locale: Locale
  title: string
  description?: string | null
  image?: string | null
  slugs: Partial<Record<Locale, string>>
  noindex?: boolean
  canonical?: string | null
  type?: 'website' | 'article'
}): Metadata {
  const { site, locale, slugs } = args
  const suffix = site.settings.seo?.titleSuffix ?? ''
  const title = args.title.includes('BOTZ') ? args.title : `${args.title}${suffix}`
  const description = args.description || site.settings.seo?.defaultDescription || undefined
  const languages: Record<string, string> = {}
  for (const l of locales) if (slugs[l] !== undefined) languages[localeTags[l]] = `${siteUrl}${pagePath(l, slugs[l])}`
  const def = (site.settings.defaultLocale ?? 'hy') as Locale
  const xDefault = slugs[def] !== undefined ? def : (locales.find((l) => slugs[l] !== undefined) ?? locale)
  languages['x-default'] = `${siteUrl}${pagePath(xDefault, slugs[xDefault])}`
  const canonical = args.canonical || `${siteUrl}${pagePath(locale, slugs[locale])}`
  const image = args.image || (site.settings.seo?.defaultImage as { url?: string } | undefined)?.url || '/brand/og-default.png'
  const indexable = site.settings.seo?.allowIndexing !== false && !args.noindex && !site.draft
  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: args.type ?? 'website',
      title,
      description,
      url: canonical,
      siteName: site.settings.siteName,
      locale: localeTags[locale].replace('-', '_'),
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

/** Truthful Organization data: only facts visible on the site. No address or ratings. */
export function organizationLd(site: SiteData, locale: Locale) {
  const c = site.contacts
  const org = site.settings.seo?.organization ?? {}
  const sameAs = [...(org.sameAs ?? []).map((s: { url: string }) => s.url), ...(c.instagramUrl ? [c.instagramUrl] : [])]
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.settings.siteName ?? 'BOTZ Marketing Agency',
    ...(org.legalName ? { legalName: org.legalName } : {}),
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/brand/botz-logo-light.png`,
    email: c.email,
    telephone: c.phoneE164,
    ...(org.areaServed ? { areaServed: org.areaServed } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer service', telephone: c.phoneE164, email: c.email, availableLanguage: ['hy', 'en', 'ru'] }],
  }
}

export function serviceLd(site: SiteData, locale: Locale, name: string, description?: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    ...(description ? { description } : {}),
    provider: { '@type': 'Organization', name: site.settings.siteName ?? 'BOTZ Marketing Agency', url: `${siteUrl}/${locale}` },
    ...(site.settings.seo?.organization?.areaServed ? { areaServed: site.settings.seo.organization.areaServed } : {}),
  }
}

export const ldScript = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })
