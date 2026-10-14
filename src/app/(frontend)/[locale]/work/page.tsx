import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { SiteHeader } from '@/components/SiteHeader'
import { isLocale, type Locale } from '@/i18n/config'
import { getCatalog, getCollectionItems, getGuide, getSite } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const slugs = { hy: 'work', en: 'work', ru: 'work' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const site = await getSite(locale)
  return buildMetadata({ site, locale, title: site.strings.work.title, slugs })
}

/** Portfolio index — exists only once at least one case study is published. */
export default async function WorkIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const items = await getCollectionItems('case-studies', locale, 60)
  if (!items.length) notFound()
  const [site, catalog, guide] = await Promise.all([getSite(locale), getCatalog(locale), getGuide(locale)])
  return (
    <>
      <SiteHeader site={site} locale={locale} alternates={{ hy: '/hy/work', en: '/en/work', ru: '/ru/work' }} currentPath={`/${locale}/work`} />
      <main id="main">
        <RenderBlocks
          blocks={[
            { blockType: 'hero', variant: 'title', heading: site.strings.work.title, settings: { paddingTop: 'xl', paddingBottom: 'sm' } },
            { blockType: 'collectionList', source: 'caseStudies', limit: 60, settings: { paddingTop: 'sm' } },
          ]}
          ctx={{ locale, site, catalog, guide, items: { caseStudies: items, testimonials: [], posts: [] }, contactHref: `/${locale}/contact#contact` }}
        />
      </main>
    </>
  )
}
