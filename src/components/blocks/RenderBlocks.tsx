import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { SiteData } from '@/lib/data'
import { formatNumber } from '@/lib/format'
import type { GuideConfig } from '@/lib/guide'
import { localizedPath, type CmsLink } from '@/lib/links'
import { availableDurations, isDuration, isRecurring, packagesIn, priceLine } from '@/lib/pricing/engine'
import { durationLabel } from '@/lib/pricing/present'
import type { Catalog, Category, Duration } from '@/lib/pricing/types'
import { ContactForm } from '../client/ContactForm'
import { Comparison } from '../client/Comparison'
import { Guide } from '../client/Guide'
import { FlameBackground } from '../client/FlameBackground'
import { HeroMark } from '../client/HeroMark'
import { PeopleCards } from '../client/PeopleCards'
import { PricingExplorer } from '../client/PricingExplorer'
import { WorkCard } from '../client/WorkCard'
import { Media, type MediaDoc } from '../Media'
import { CmsButton, Eyebrow, Highlight, Icon, ServiceIcon } from '../ui'
import { Section, type BlockSettings } from './Section'
import { telLink, whatsappLink } from '@/lib/contact'

type Raw = Record<string, any>
export type BlockContext = {
  locale: Locale
  site: SiteData
  catalog: Catalog
  guide: GuideConfig
  items: { caseStudies: Raw[]; testimonials: Raw[]; posts: Raw[] }
  contactHref: string
}


function Head({ b, as = 'h2' }: { b: Raw; as?: 'h1' | 'h2' }) {
  if (!b.eyebrow && !b.heading && !b.intro) return null
  const H = as
  return (
    <div className="section-head" data-reveal>
      <Eyebrow text={b.eyebrow} />
      {b.heading && (
        <H className={`display ${as === 'h1' ? 'h1' : 'h2'}`}>
          <Highlight text={b.heading} />
        </H>
      )}
      {b.intro && <p className="lead">{b.intro}</p>}
    </div>
  )
}

function Buttons({ links, ctx }: { links?: CmsLink[] | null; ctx: BlockContext }) {
  if (!links?.length) return null
  return (
    <div className="btn-row">
      {links.map((l, i) => (
        <CmsButton key={i} link={l} locale={ctx.locale} contacts={ctx.site.contacts} />
      ))}
    </div>
  )
}

function Hero({ b, ctx, first }: { b: Raw; ctx: BlockContext; first: boolean }) {
  const variant = b.variant ?? 'title'
  const Tag = first ? 'h1' : 'h2'
  const mark = ctx.site.theme.logos?.mark?.url ?? '/brand/botz-mark.webp'
  // Dark mode uses the B as drawn in the dark logo (its gradient is made for black backgrounds).
  const markDark = ctx.site.theme.logos?.mark?.url ?? '/brand/botz-mark-dark.webp'
  const ticker = (b.tickerItems ?? []) as { text: string }[]
  const tickerEl =
    ticker.length > 0 ? (
      <div className="ticker" aria-label={ticker.map((t) => t.text).join(', ')}>
        <div className="ticker-track">
          <ul>
            {ticker.map((t, i) => (
              <li key={i}>{t.text}</li>
            ))}
          </ul>
          <ul aria-hidden="true">
            {ticker.map((t, i) => (
              <li key={i}>{t.text}</li>
            ))}
          </ul>
        </div>
      </div>
    ) : null

  if (variant === 'flame') {
    const s = (b.settings ?? {}) as BlockSettings
    return (
      <section id={s.anchor || undefined} className="section hero hero-flame-variant">
        <div className="hero-flame-stage">
          <FlameBackground
            video={{ webm: '/brand/hero-flame.webm', mp4: '/brand/hero-flame.mp4' }}
            poster={{ dark: '/brand/hero-flame-poster-dark.webp', light: '/brand/hero-flame-poster-light.webp' }}
          />
          <div className="container hero-flame-content">
            <div className="hero-copy">
              <Eyebrow text={b.eyebrow} />
              <Tag className="display h1">
                <Highlight text={b.heading} words />
              </Tag>
              {b.subheading && <p className="lead hero-sub">{b.subheading}</p>}
              <Buttons links={b.buttons} ctx={ctx} />
            </div>
          </div>
        </div>
        {tickerEl && <div className="container hero-flame-ticker">{tickerEl}</div>}
      </section>
    )
  }

  return (
    <Section settings={b.settings} className={`hero hero-${variant}-variant`}>
      <div className="hero-grid">
        <div>
          <Eyebrow text={b.eyebrow} />
          <Tag className="display h1">
            <Highlight text={b.heading} words />
          </Tag>
          {b.subheading && <p className="lead hero-sub">{b.subheading}</p>}
          <Buttons links={b.buttons} ctx={ctx} />
        </div>
        {variant === 'mark' && <HeroMark src={mark} darkSrc={markDark} alt="" />}
        {variant === 'media' && (
          <div className="hero-media">
            <Media media={b.media} priority={first} sizes="(min-width: 960px) 45vw, 100vw" />
          </div>
        )}
      </div>
      {tickerEl}
    </Section>
  )
}

function Split({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  const points = (b.points ?? []) as { title: string; text?: string }[]
  return (
    <Section settings={b.settings}>
      <Eyebrow text={b.eyebrow} />
      <div className="split-grid">
        <p className="display split-statement" data-reveal>
          <Highlight text={b.statement} />
        </p>
        <div data-reveal style={{ ['--d' as string]: 1 }}>
          {b.body && <p className="lead" style={{ marginTop: 0 }}>{b.body}</p>}
          <Buttons links={b.buttons} ctx={ctx} />
        </div>
      </div>
      {points.length > 0 && (
        <div className="points" style={{ ['--cols' as string]: Math.min(points.length, 3) }}>
          {points.map((p, i) => (
            <div className="point" key={i} data-reveal style={{ ['--d' as string]: i }}>
              <h3>{p.title}</h3>
              {p.text && <p>{p.text}</p>}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function Services({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <div className="service-grid">
        {(b.items ?? []).map((it: Raw, i: number) => (
          <article className="service-card" key={i} data-reveal style={{ ['--d' as string]: i }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ServiceIcon service={it.service} />
              {it.index && <span className="service-index">{it.index}</span>}
            </div>
            <h3>{it.title}</h3>
            {it.text && <p>{it.text}</p>}
            {it.highlights?.length > 0 && (
              <ul>
                {it.highlights.map((h: Raw, j: number) => (
                  <li key={j}>{h.text}</li>
                ))}
              </ul>
            )}
            {it.link?.label && <CmsButton link={{ ...it.link, appearance: 'link' }} locale={ctx.locale} contacts={ctx.site.contacts} />}
          </article>
        ))}
      </div>
    </Section>
  )
}

function PackagePreview({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  const cats: Category[] = b.categories?.length ? b.categories : ['smm', 'seo', 'bundle', 'website']
  const d = Number(b.duration ?? 12)
  const duration: Duration = isDuration(d) ? d : 12
  const s = ctx.site.strings.pricing
  const amd = (n: number) => (
    <>
      {formatNumber(n, ctx.locale)}
      <span className="cur">֏</span>
    </>
  )
  const groups = cats.map((c) => ({ c, list: packagesIn(ctx.catalog, c) })).filter((g) => g.list.length)
  if (!groups.length) return null
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <div className="pkg-groups">
        {groups.map(({ c, list }) => (
          <div key={c} data-reveal>
            <div className="pkg-group-title">
              <h3>{ctx.site.strings.services[c]}</h3>
              {c !== 'website' && <span className="muted small">{durationLabel(s, duration)}</span>}
            </div>
            <div className="pkg-grid">
              {list.map((p) => {
                const line = isRecurring(p) ? priceLine(p, duration) ?? priceLine(p, availableDurations(p).slice(-1)[0] ?? 1) : null
                return (
                  <Link
                    key={p.key}
                    href={localizedPath(ctx.locale, `/pricing?pkg=${p.key}${line ? `&d=${line.months}` : ''}#pricing`)}
                    className={`pkg-card pkg-card-link${p.recommended ? ' is-recommended' : ''}`}
                  >
                    <div className="pkg-top">
                      <span className="pkg-cat">{c === 'bundle' ? 'SMM + SEO' : c.toUpperCase()}</span>
                      {(p.badge || p.recommended) && <span className="chip">{p.badge || s.recommended}</span>}
                    </div>
                    <h4 className="display pkg-name">{p.name}</h4>
                    {p.tagline && <p className="pkg-tagline">{p.tagline}</p>}
                    <div className="price-main">
                      {isRecurring(p) ? (
                        line ? (
                          <>
                            <span className="small muted">{s.from}</span>
                            <span className="price-amount">{amd(line.monthly)}</span>
                            <span className="price-unit">{s.perMonth}</span>
                          </>
                        ) : null
                      ) : (
                        <>
                          <span className="price-amount">{p.oneTimePrice ? amd(p.oneTimePrice) : '—'}</span>
                          <span className="price-unit">{s.oneTime}</span>
                        </>
                      )}
                    </div>
                    {line && line.months !== duration && (
                      <p className="price-meta">
                        {s.availableFor.replace('{list}', availableDurations(p).map((x) => durationLabel(s, x)).join(', '))}
                      </p>
                    )}
                    <span className="btn-link pkg-more">
                      {s.seeDetails} <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {b.link?.label && (
        <div className="btn-row">
          <CmsButton link={b.link} locale={ctx.locale} contacts={ctx.site.contacts} />
        </div>
      )}
    </Section>
  )
}

function Pricing({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  const d = Number(b.defaultDuration ?? 6)
  const st = ctx.site.strings
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <PricingExplorer
        catalog={ctx.catalog}
        locale={ctx.locale}
        strings={{ pricing: st.pricing, compare: st.compare, services: st.services, contact: st.contact, whatsapp: st.whatsapp }}
        contacts={ctx.site.contacts}
        defaultCategory={(b.defaultCategory ?? 'smm') as Category}
        defaultDuration={isDuration(d) ? d : 6}
        lockCategory={Boolean(b.lockCategory)}
        showAddons={b.showAddons !== false}
        showComparison={b.showComparison !== false}
        showTerms={b.showTerms !== false}
        shareEnabled={ctx.site.settings.forms?.shareEnabled !== false}
        contactHref={ctx.contactHref}
      />
    </Section>
  )
}

function ComparisonSection({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  const keys: string[] = b.packageKeys?.length ? b.packageKeys : packagesIn(ctx.catalog, b.category ?? 'smm').slice(0, 3).map((p) => p.key)
  const d = Number(b.defaultDuration ?? 6)
  const st = ctx.site.strings
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <Comparison catalog={ctx.catalog} keys={keys} duration={isDuration(d) ? d : 6} locale={ctx.locale} s={st.pricing} c={st.compare} />
    </Section>
  )
}

function Process({ b }: { b: Raw }) {
  const steps = (b.steps ?? []) as { title: string; text?: string }[]
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <ol className="steps" style={{ ['--cols' as string]: Math.min(steps.length, 4) }}>
        {steps.map((s, i) => (
          <li className="step" key={i} data-reveal style={{ ['--d' as string]: i }}>
            <h3>{s.title}</h3>
            {s.text && <p>{s.text}</p>}
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Faq({ b }: { b: Raw }) {
  const items = (b.items ?? []) as { question: string; answer: string }[]
  const ld =
    b.structuredData !== false && items.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((i) => ({ '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.answer } })),
        }
      : null
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <div className="faq-list">
        {items.map((i, k) => (
          <details className="faq-item" key={k}>
            <summary>
              <span>{i.question}</span>
              <span className="faq-icon" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="faq-answer">
              <p>{i.answer}</p>
            </div>
          </details>
        ))}
      </div>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />}
    </Section>
  )
}

function Contact({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  const st = ctx.site.strings
  const c = ctx.site.contacts
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <div className="contact-grid">
        <div>
          {b.showPeople !== false && (
            <PeopleCards
              contacts={c}
              locale={ctx.locale}
              strings={{ contact: st.contact, whatsapp: st.whatsapp, pricing: st.pricing, services: st.services }}
              defaultService={b.defaultService}
            />
          )}
          {b.showDirect !== false && (
            <ul className="direct">
              <li>
                <a href={telLink(c.phoneE164)}>
                  {Icon.phone} {c.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappLink(c.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                  {Icon.whatsapp} WhatsApp · {c.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${c.email}`}>
                  {Icon.mail} {c.email}
                </a>
              </li>
              {c.instagramUrl && (
                <li>
                  <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer">
                    {Icon.instagram} Instagram
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
        {b.showForm !== false && (
          <ContactForm locale={ctx.locale} s={{ ...st.form, services: st.services, pricing: st.pricing }} contacts={c} defaultService={b.defaultService} />
        )}
      </div>
    </Section>
  )
}

function Cta({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  return (
    <Section settings={b.settings}>
      <div className="cta-box" data-reveal>
        <h2 className="display h2">
          <Highlight text={b.heading} />
        </h2>
        {b.text && <p className="lead">{b.text}</p>}
        <Buttons links={b.buttons} ctx={ctx} />
      </div>
    </Section>
  )
}

function RichTextSection({ b }: { b: Raw }) {
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      {b.content && (
        <div className="prose" data-reveal>
          <RichText data={b.content} />
        </div>
      )}
    </Section>
  )
}

function MediaSection({ b }: { b: Raw }) {
  return (
    <Section settings={b.settings}>
      <figure className="media-figure" data-reveal style={{ margin: 0 }}>
        <Media media={b.media} aspect={b.aspect} />
        {(b.caption || (b.media as MediaDoc & { caption?: string })?.caption) && (
          <figcaption>{b.caption || (b.media as { caption?: string }).caption}</figcaption>
        )}
      </figure>
    </Section>
  )
}

function CollectionList({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  const source = b.source as 'caseStudies' | 'testimonials' | 'posts'
  const all = ctx.items[source] ?? []
  const items = all.slice(0, Number(b.limit ?? 6))
  // Hidden until real, published content exists — never placeholders.
  if (!items.length) return null
  const st = ctx.site.strings
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <div className="card-grid">
        {source === 'testimonials' &&
          items.map((t) => (
            <figure className="quote-card" key={t.id} data-reveal>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <strong>{t.author}</strong>
                {(t.role || t.company) && <span className="muted"> · {[t.role, t.company].filter(Boolean).join(', ')}</span>}
              </figcaption>
            </figure>
          ))}
        {source === 'caseStudies' &&
          items.map((cs) => (
            <WorkCard
              key={cs.id}
              href={localizedPath(ctx.locale, `/work/${cs.slug}`)}
              video={typeof cs.previewVideo === 'object' ? cs.previewVideo?.url : null}
              image={<Media media={cs.cover} sizes="(min-width: 1080px) 33vw, (min-width: 720px) 50vw, 100vw" />}
            >
              <div className="work-body">
                <p className="pkg-cat" style={{ margin: 0 }}>
                  {cs.client}
                </p>
                <h3>{cs.title}</h3>
                {cs.summary && <p className="muted small">{cs.summary}</p>}
                <span className="btn-link">{st.work.viewCase}</span>
              </div>
            </WorkCard>
          ))}
        {source === 'posts' &&
          items.map((p) => (
            <a className="work-card" key={p.id} href={localizedPath(ctx.locale, `/blog/${p.slug}`)}>
              {p.cover && (
                <div className="work-media">
                  <Media media={p.cover} sizes="(min-width: 1080px) 33vw, 100vw" />
                </div>
              )}
              <div className="work-body">
                <h3>{p.title}</h3>
                {p.excerpt && <p className="muted small">{p.excerpt}</p>}
                <span className="btn-link">{st.blog.readMore}</span>
              </div>
            </a>
          ))}
      </div>
    </Section>
  )
}

function GuideSection({ b, ctx }: { b: Raw; ctx: BlockContext }) {
  if (!ctx.guide.questions.length) return null
  return (
    <Section settings={b.settings}>
      <Head b={b} />
      <Guide config={ctx.guide} catalog={ctx.catalog} locale={ctx.locale} s={ctx.site.strings.guide} p={ctx.site.strings.pricing} contactHref={ctx.contactHref} />
    </Section>
  )
}

export function RenderBlocks({ blocks, ctx }: { blocks: Raw[]; ctx: BlockContext }) {
  const visible = (blocks ?? []).filter((b) => !(b.settings as BlockSettings | undefined)?.hidden)
  return (
    <>
      {visible.map((b, i) => {
        const key = b.id ?? i
        switch (b.blockType) {
          case 'hero':
            return <Hero key={key} b={b} ctx={ctx} first={i === 0} />
          case 'split':
            return <Split key={key} b={b} ctx={ctx} />
          case 'richText':
            return <RichTextSection key={key} b={b} />
          case 'mediaBlock':
            return <MediaSection key={key} b={b} />
          case 'services':
            return <Services key={key} b={b} ctx={ctx} />
          case 'packagePreview':
            return <PackagePreview key={key} b={b} ctx={ctx} />
          case 'pricing':
            return <Pricing key={key} b={b} ctx={ctx} />
          case 'comparison':
            return <ComparisonSection key={key} b={b} ctx={ctx} />
          case 'guide':
            return <GuideSection key={key} b={b} ctx={ctx} />
          case 'process':
            return <Process key={key} b={b} />
          case 'faq':
            return <Faq key={key} b={b} />
          case 'contact':
            return <Contact key={key} b={b} ctx={ctx} />
          case 'cta':
            return <Cta key={key} b={b} ctx={ctx} />
          case 'collectionList':
            return <CollectionList key={key} b={b} ctx={ctx} />
          default:
            return null
        }
      })}
    </>
  )
}

