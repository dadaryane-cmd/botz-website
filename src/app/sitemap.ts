import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { locales, localeTags, type Locale } from '@/i18n/config'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Raw = Record<string, any>

/** Published, indexable pages in every enabled language, with reciprocal alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as Raw
  if (settings.seo?.allowIndexing === false) return []

  const out: MetadataRoute.Sitemap = []
  const pages = await payload.find({
    collection: 'pages',
    locale: 'all',
    where: { _status: { equals: 'published' } },
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  for (const doc of pages.docs as Raw[]) {
    if (doc.meta?.noindex === true || Object.values(doc.meta?.noindex ?? {}).some(Boolean)) continue
    const enabled = (doc.enabledLocales ?? locales).filter((l: Locale) => doc.title?.[l]) as Locale[]
    const url = (l: Locale) => `${siteUrl}/${l}${doc.slug?.[l] ? `/${doc.slug[l]}` : ''}`
    const languages = Object.fromEntries(enabled.map((l) => [localeTags[l], url(l)]))
    for (const l of enabled) out.push({ url: url(l), lastModified: doc.updatedAt, alternates: { languages } })
  }

  for (const [collection, base] of [
    ['case-studies', 'work'],
    ['posts', 'blog'],
  ] as const) {
    const res = await payload.find({ collection, locale: 'all', where: { _status: { equals: 'published' } }, pagination: false, depth: 0, overrideAccess: true })
    if (!res.docs.length) continue
    for (const l of locales) out.push({ url: `${siteUrl}/${l}/${base}` })
    for (const doc of res.docs as Raw[]) {
      for (const l of locales) if (doc.title?.[l] && doc.slug?.[l]) out.push({ url: `${siteUrl}/${l}/${base}/${doc.slug[l]}`, lastModified: doc.updatedAt })
    }
  }
  return out
}
