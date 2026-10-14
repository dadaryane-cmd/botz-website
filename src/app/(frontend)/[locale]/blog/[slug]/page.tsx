import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Media } from '@/components/Media'
import { SiteHeader } from '@/components/SiteHeader'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getItemBySlug, getSite } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { buildMetadata, ldScript, siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const doc = await getItemBySlug('posts', locale, slug)
  if (!doc) return {}
  const site = await getSite(locale)
  return buildMetadata({
    site,
    locale,
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.excerpt,
    image: doc.meta?.image?.url ?? doc.cover?.url,
    slugs: { [locale]: `blog/${slug}` },
    noindex: doc.meta?.noindex,
    type: 'article',
  })
}

export default async function Post({ params }: P) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const doc = await getItemBySlug('posts', locale, slug)
  if (!doc || !doc.title) notFound()
  const site = await getSite(locale)
  const alternates = Object.fromEntries(locales.map((l) => [l, l === locale ? `/${l}/blog/${slug}` : null])) as Record<Locale, string | null>
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: doc.title,
    ...(doc.publishedAt ? { datePublished: doc.publishedAt } : {}),
    ...(doc.author ? { author: { '@type': 'Person', name: doc.author } } : {}),
    publisher: { '@type': 'Organization', name: site.settings.siteName },
    mainEntityOfPage: `${siteUrl}/${locale}/blog/${slug}`,
  }
  return (
    <>
      <SiteHeader site={site} locale={locale} alternates={alternates} currentPath="" />
      <main id="main">
        <article className="section pt-lg pb-lg">
          <div className="container w-narrow">
            <p className="muted small">
              <Link href={`/${locale}/blog`}>{site.strings.blog.title}</Link>
              {doc.publishedAt ? ` · ${formatDate(doc.publishedAt, locale)}` : ''}
            </p>
            <h1 className="display h2">{doc.title}</h1>
            {doc.excerpt && <p className="lead">{doc.excerpt}</p>}
            {doc.cover && (
              <div className="media-figure" style={{ margin: '32px 0' }}>
                <Media media={doc.cover} priority />
              </div>
            )}
            {doc.content && (
              <div className="prose">
                <RichText data={doc.content} />
              </div>
            )}
          </div>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(ld)} />
      </main>
    </>
  )
}
