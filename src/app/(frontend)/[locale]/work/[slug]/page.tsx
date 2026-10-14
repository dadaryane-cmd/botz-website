import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Media } from '@/components/Media'
import { SiteHeader } from '@/components/SiteHeader'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { getItemBySlug, getSite } from '@/lib/data'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type P = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const doc = await getItemBySlug('case-studies', locale, slug)
  if (!doc) return {}
  const site = await getSite(locale)
  return buildMetadata({
    site,
    locale,
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || doc.summary,
    image: doc.meta?.image?.url ?? doc.cover?.url,
    slugs: { [locale]: `work/${slug}` },
    noindex: doc.meta?.noindex,
    type: 'article',
  })
}

export default async function CaseStudy({ params }: P) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const doc = await getItemBySlug('case-studies', locale, slug)
  if (!doc || !doc.title) notFound()
  const site = await getSite(locale)
  const s = site.strings.work
  const alternates = Object.fromEntries(locales.map((l) => [l, l === locale ? `/${l}/work/${slug}` : null])) as Record<Locale, string | null>
  return (
    <>
      <SiteHeader site={site} locale={locale} alternates={alternates} currentPath="" />
      <main id="main">
        <article className="section pt-lg pb-lg">
          <div className="container">
            <p className="muted small">
              <Link href={`/${locale}/work`}>{s.title}</Link> · {doc.client}
            </p>
            <h1 className="display h1" style={{ maxWidth: '18ch' }}>
              {doc.title}
            </h1>
            {doc.summary && <p className="lead">{doc.summary}</p>}
            {doc.services?.length > 0 && (
              <p className="muted">
                {s.services}: {doc.services.map((x: string) => site.strings.services[x as 'smm']).join(', ')}
              </p>
            )}
            <div className="media-figure" style={{ margin: '40px 0' }}>
              <Media media={doc.cover} priority />
            </div>
            <div className="split-grid" style={{ alignItems: 'start' }}>
              {doc.challenge && (
                <section className="prose">
                  <h2>{s.challenge}</h2>
                  <RichText data={doc.challenge} />
                </section>
              )}
              {doc.work && (
                <section className="prose">
                  <h2>{s.workDone}</h2>
                  <RichText data={doc.work} />
                </section>
              )}
            </div>
            {doc.results?.length > 0 && (
              <section style={{ marginTop: 48 }}>
                <h2 className="display h2">{s.results}</h2>
                <div className="points" style={{ ['--cols' as string]: Math.min(doc.results.length, 3) }}>
                  {doc.results.map((r: Record<string, string>, i: number) => (
                    <div className="point" key={i}>
                      <p className="display" style={{ fontSize: '2.4rem', margin: 0 }}>
                        {r.value}
                      </p>
                      <h3>{r.metric}</h3>
                      <p>
                        {r.timeframe} — {r.context}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {doc.gallery?.length > 0 && (
              <div className="card-grid" style={{ marginTop: 48 }}>
                {doc.gallery.map((g: Record<string, any>, i: number) => (
                  <figure className="media-figure" key={i} style={{ margin: 0 }}>
                    <Media media={g.media} sizes="(min-width: 1080px) 33vw, 100vw" />
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
    </>
  )
}
