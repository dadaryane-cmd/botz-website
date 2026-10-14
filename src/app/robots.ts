import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/** Generated from Site settings. Admin, API, previews and shared estimates are never crawled. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const payload = await getPayload({ config })
  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as Record<string, any>
  if (settings.seo?.allowIndexing === false) return { rules: [{ userAgent: '*', disallow: '/' }] }
  const extra = String(settings.seo?.extraDisallow ?? '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.startsWith('/'))
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/', '/*/estimate/', ...extra] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
