import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { RenderBlocks, type BlockContext } from '@/components/blocks/RenderBlocks'
import { PageContext } from '@/components/client/PageContext'
import { SiteHeader, type Alternates } from '@/components/SiteHeader'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getCatalog, getCollectionItems, getGuide, getPage, getRedirect, getSite } from '@/lib/data'
import { localizedPath } from '@/lib/links'
import type { Category } from '@/lib/pricing/types'
import { buildMetadata, ldScript, organizationLd, pagePath, serviceLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Params = { locale: string; slug?: string[] }
type Raw = Record<string, any>

const categoryFor: Record<string, Category> = { smm: 'smm', seo: 'seo', website: 'website' }

async function load(params: Params) {
  if (!isLocale(params.locale)) return null
  const locale: Locale = params.locale
  const slug = (params.slug ?? []).map(decodeURIComponent).join('/')
  const page = await getPage(locale, slug)
  return page ? { locale, slug, ...page } : { locale, slug, doc: null, slugs: {} }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const data = await load(await params)
  if (!data?.doc) return {}
  const { locale, doc, slugs } = data
  const site = await getSite(locale)
  const meta = (doc.meta ?? {}) as Raw
  return buildMetadata({
    site,
    locale,
    title: meta.title || doc.title,
    description: meta.description,
    image: typeof meta.image === 'object' ? meta.image?.url : null,
    slugs,
    noindex: Boolean(meta.noindex),
    canonical: meta.canonical,
  })
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const p = await params
  const data = await load(p)
  if (!data) notFound()
  const { locale, slug } = data

  if (!data.doc) {
    // A renamed page keeps working through its redirect.
    const to = await getRedirect(pagePath(locale, slug))
    if (to) permanentRedirect(to)
    notFound()
  }
  const { doc, slugs } = data
  // A language that is switched off for this page is treated as missing, never shown half-translated.
  if (!(doc.enabledLocales ?? locales).includes(locale)) notFound()

  const [site, catalog, guide] = await Promise.all([getSite(locale), getCatalog(locale), getGuide(locale)])
  const layout = (doc.layout ?? []) as Raw[]
  const needs = (source: string) => layout.some((b) => b.blockType === 'collectionList' && b.source === source)
  const [caseStudies, testimonials, posts] = await Promise.all([
    needs('caseStudies') ? getCollectionItems('case-studies', locale) : [],
    needs('testimonials') ? getCollectionItems('testimonials', locale) : [],
    needs('posts') ? getCollectionItems('posts', locale) : [],
  ])

  const alternates = Object.fromEntries(locales.map((l) => [l, slugs[l] !== undefined ? pagePath(l, slugs[l]) : null])) as Alternates
  const hasContact = layout.some((b) => b.blockType === 'contact' && !b.settings?.hidden)
  const ctx: BlockContext = {
    locale,
    site,
    catalog,
    guide,
    items: { caseStudies, testimonials, posts },
    contactHref: hasContact ? '#contact' : `${localizedPath(locale, '/contact')}#contact`,
  }
  const pageType = doc.pageType as string
  const category = categoryFor[pageType] ?? null
  const ld: unknown[] = []
  if (pageType === 'home') ld.push(organizationLd(site, locale))
  if (category) ld.push(serviceLd(site, locale, doc.title, doc.meta?.description))

  return (
    <>
      <SiteHeader site={site} locale={locale} alternates={alternates} currentPath={pagePath(locale, slug)} />
      <main id="main" tabIndex={-1}>
        <RenderBlocks blocks={layout} ctx={ctx} />
      </main>
      <PageContext category={category} locale={locale} />
      {ld.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={ldScript(d)} />
      ))}
    </>
  )
}
