import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { SiteHeader } from '@/components/SiteHeader'
import { isLocale, type Locale } from '@/i18n/config'
import { getCatalog, getCollectionItems, getGuide, getSite } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const site = await getSite(locale)
  return buildMetadata({ site, locale, title: site.strings.blog.title, slugs: { hy: 'blog', en: 'blog', ru: 'blog' } })
}

/** Blog index — exists only once at least one post is published. */
export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const posts = (await getCollectionItems('posts', locale, 60)).filter((p) => p.title)
  if (!posts.length) notFound()
  const [site, catalog, guide] = await Promise.all([getSite(locale), getCatalog(locale), getGuide(locale)])
  return (
    <>
      <SiteHeader site={site} locale={locale} alternates={{ hy: '/hy/blog', en: '/en/blog', ru: '/ru/blog' }} currentPath={`/${locale}/blog`} />
      <main id="main">
        <RenderBlocks
          blocks={[
            { blockType: 'hero', variant: 'title', heading: site.strings.blog.title, settings: { paddingTop: 'xl', paddingBottom: 'sm' } },
            { blockType: 'collectionList', source: 'posts', limit: 60, settings: { paddingTop: 'sm' } },
          ]}
          ctx={{ locale, site, catalog, guide, items: { caseStudies: [], testimonials: [], posts }, contactHref: `/${locale}/contact#contact` }}
        />
      </main>
    </>
  )
}
