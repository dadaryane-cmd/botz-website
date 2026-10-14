import 'server-only'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { draftMode, headers } from 'next/headers'
import { cache } from 'react'
import { getPayload, type Payload } from 'payload'
import { hasRole } from '@/access'
import { themeDefaults } from '@/globals/Theme'
import { CMS_TAG } from '@/hooks/revalidate'
import type { Locale } from '@/i18n/config'
import { uiStringGlobals } from '@/globals/UiStrings'
import { contactInfoFrom, loadSettings, mergeStrings } from './site'
import { loadCatalog } from './pricing/fromCms'
import type { GuideConfig } from './guide'

type Raw = Record<string, any>

/**
 * Admin saves clear the cache immediately. This expiry is a safety net for
 * changes made outside the admin (seed, backup restore, direct database edits).
 */
const CACHE_SECONDS = 300

export const payloadClient = cache(async (): Promise<Payload> => getPayload({ config }))

/**
 * Draft content is shown only when draft mode is on AND the request carries a
 * valid staff session. A stray draft-mode cookie alone never reveals drafts.
 */
export const isPreview = cache(async (): Promise<boolean> => {
  const dm = await draftMode()
  if (!dm.isEnabled) return false
  const payload = await payloadClient()
  try {
    const { user } = await payload.auth({ headers: await headers() })
    return hasRole(user as never, 'admin', 'editor', 'sales')
  } catch {
    return false
  }
})

/** Published data is cached and invalidated on every CMS save; previews bypass the cache. */
function cached<A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) {
  const publicFn = unstable_cache(fn, [key], { tags: [CMS_TAG], revalidate: CACHE_SECONDS })
  return async (preview: boolean, ...args: A): Promise<R> => (preview ? fn(...args) : publicFn(...args))
}

const site = async (locale: Locale, draft: boolean) => {
  const payload = await payloadClient()
  const [settings, theme, nav, strings] = await Promise.all([
    loadSettings(payload, locale),
    payload.findGlobal({ slug: 'theme', depth: 1, overrideAccess: true }) as Promise<Raw>,
    payload.findGlobal({ slug: 'navigation', locale, fallbackLocale: false, depth: 1, overrideAccess: true }) as Promise<Raw>,
    Promise.all(
      uiStringGlobals.map((g) => payload.findGlobal({ slug: g.slug, locale, fallbackLocale: false, depth: 0, overrideAccess: true }) as Promise<Raw>),
    ).then((parts) => Object.assign({}, ...parts) as Raw),
  ])
  const counts = await Promise.all(
    (['case-studies', 'posts', 'testimonials'] as const).map(
      async (c) => (await payload.count({ collection: c, where: { _status: { equals: 'published' } }, overrideAccess: true })).totalDocs,
    ),
  )
  return {
    settings,
    theme: {
      ...theme,
      light: { ...themeDefaults.light, ...(theme.light ?? {}) },
      dark: { ...themeDefaults.dark, ...(theme.dark ?? {}) },
    } as Raw,
    nav,
    uiRaw: strings,
    contacts: contactInfoFrom(settings),
    has: { work: counts[0] > 0, blog: counts[1] > 0, testimonials: counts[2] > 0 },
    draft,
  }
}
const siteCached = cached('site', (locale: Locale) => site(locale, false))
export const getSite = cache(async (locale: Locale) => {
  const preview = await isPreview()
  const data = preview ? await site(locale, true) : await siteCached(false, locale)
  // Defaults are merged outside the cache so new interface text in code is never served stale.
  return { ...data, strings: mergeStrings(data.uiRaw, locale) }
})
export type SiteData = Awaited<ReturnType<typeof getSite>>

const catalogFn = cached('catalog', async (locale: Locale, draft: boolean) => loadCatalog(await payloadClient(), locale, draft))
export const getCatalog = cache(async (locale: Locale) => {
  const preview = await isPreview()
  return catalogFn(preview, locale, preview)
})

const guideFn = cached('guide', async (locale: Locale, draft: boolean): Promise<GuideConfig> => {
  const payload = await payloadClient()
  const raw = (await payload.findGlobal({ slug: 'package-guide', locale, fallbackLocale: false, draft, depth: 0, overrideAccess: true })) as Raw
  if (!draft && raw._status !== 'published') return { questions: [], rules: [] }
  return {
    questions: (raw.questions ?? []).map((q: Raw) => ({
      key: q.key,
      role: q.role ?? 'normal',
      label: q.label ?? '',
      help: q.help ?? null,
      options: (q.options ?? []).map((o: Raw) => ({ value: o.value, label: o.label ?? o.value, budgetMax: o.budgetMax ?? null, months: o.months ?? null })),
    })),
    rules: (raw.rules ?? []).map((r: Raw) => ({
      key: r.key,
      packageKey: r.packageKey,
      points: Number(r.points ?? 0),
      when: (r.when ?? []).map((w: Raw) => ({ question: w.question, values: w.values ?? [] })),
      reason: r.reason ?? '',
    })),
  }
})
export const getGuide = cache(async (locale: Locale) => {
  const preview = await isPreview()
  return guideFn(preview, locale, preview)
})

const pageFn = cached('page', async (locale: Locale, slug: string, draft: boolean) => {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'pages',
    locale,
    fallbackLocale: false,
    draft,
    depth: 2,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        slug ? { slug: { equals: slug } } : { or: [{ slug: { equals: '' } }, { slug: { exists: false } }, { pageType: { equals: 'home' } }] },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    sort: slug ? undefined : 'createdAt',
  })
  const doc = res.docs[0] as Raw | undefined
  if (!doc) return null
  // Equivalent pages in other languages (for the switcher and hreflang).
  const all = (await payload.findByID({ collection: 'pages', id: doc.id, locale: 'all', draft, depth: 0, overrideAccess: true })) as Raw
  const slugs: Partial<Record<Locale, string>> = {}
  for (const l of ['hy', 'en', 'ru'] as Locale[]) {
    const s = all.slug?.[l]
    const hasTitle = Boolean(all.title?.[l])
    if (hasTitle && (doc.enabledLocales ?? []).includes(l)) slugs[l] = s ?? ''
  }
  return { doc, slugs }
})
export const getPage = cache(async (locale: Locale, slug: string) => {
  const preview = await isPreview()
  return pageFn(preview, locale, slug, preview)
})

const redirectFn = cached('redirect', async (from: string) => {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'redirects', where: { from: { equals: from } }, limit: 1, depth: 1, overrideAccess: true })
  const r = res.docs[0] as Raw | undefined
  if (!r) return null
  if (r.to?.type === 'custom') return r.to.url as string
  const ref = r.to?.reference?.value
  if (ref && typeof ref === 'object') return `/${from.split('/')[1]}/${ref.slug ?? ''}`
  return null
})
export const getRedirect = (from: string) => redirectFn(false, from)

export const getCollectionItems = cache(async (collection: 'case-studies' | 'posts' | 'testimonials', locale: Locale, limit = 12) => {
  const preview = await isPreview()
  const fn = async () => {
    const payload = await payloadClient()
    const res = await payload.find({
      collection,
      locale,
      fallbackLocale: false,
      draft: preview,
      depth: 1,
      limit,
      overrideAccess: true,
      where: preview ? undefined : { _status: { equals: 'published' } },
      sort: collection === 'testimonials' ? '-createdAt' : '-publishedAt',
    })
    return res.docs as Raw[]
  }
  return preview ? fn() : unstable_cache(fn, ['items', collection, locale, String(limit)], { tags: [CMS_TAG], revalidate: CACHE_SECONDS })()
})

export const getItemBySlug = cache(async (collection: 'case-studies' | 'posts', locale: Locale, slug: string) => {
  const preview = await isPreview()
  const fn = async () => {
    const payload = await payloadClient()
    const res = await payload.find({
      collection,
      locale,
      fallbackLocale: false,
      draft: preview,
      depth: 2,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    })
    return (res.docs[0] as Raw | undefined) ?? null
  }
  return preview ? fn() : unstable_cache(fn, ['item', collection, locale, slug], { tags: [CMS_TAG], revalidate: CACHE_SECONDS })()
})
