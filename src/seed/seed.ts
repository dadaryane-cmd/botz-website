/**
 * Repeatable seed logic (run with `npm run seed`, see src/seed/run.ts).
 *
 * Safe to run again at any time: it only creates what is missing and never
 * overwrites content an editor has saved. (Delete the database file for a
 * clean local reset.)
 */
import type { Payload } from 'payload'
import { locales, type Locale } from '@/i18n/config'
import { uiStringGlobals } from '@/globals/UiStrings'
import { uiDefaults } from '@/i18n/ui-defaults'
import { addons, featureDefs, packages, reviewChecklist, terms } from './catalog'
import { growthOffer, guide, navigation, pages, people, seoDefaults } from './content'
import { pick, withIds } from './helpers'

const ctx = { disableRevalidate: true, skipApprovalGate: false }
const other = (first: Locale) => locales.filter((l) => l !== first)
const log = (...a: unknown[]) => console.log('[seed]', ...a)

async function hasVersions(payload: Payload, slug: string) {
  const v = await payload.findGlobalVersions({ slug: slug as 'theme', limit: 1, overrideAccess: true })
  return v.totalDocs > 0
}

/** Save a global in every locale (ids carried across locales). */
async function seedGlobal(payload: Payload, slug: string, data: unknown, opts: { draft?: boolean; status?: 'published' | 'draft' } = {}) {
  const statusField = opts.status ? { _status: opts.status } : {}
  const first: Locale = 'en'
  const saved = await payload.updateGlobal({
    slug: slug as 'theme',
    locale: first,
    data: { ...(pick(data, first) as object), ...statusField } as never,
    draft: opts.draft,
    overrideAccess: true,
    context: ctx,
    depth: 0,
  })
  let current: unknown = saved
  for (const l of other(first)) {
    current = await payload.updateGlobal({
      slug: slug as 'theme',
      locale: l,
      data: { ...(withIds(current, pick(data, l)) as object), ...statusField } as never,
      draft: opts.draft,
      overrideAccess: true,
      context: ctx,
      depth: 0,
    })
  }
  return current
}

function catalogData(kind: 'baseline' | 'proposal') {
  const full = kind === 'proposal'
  return {
    approvalState: full ? 'proposed' : 'approved',
    currency: 'AMD',
    features: featureDefs.map((f) => ({ key: f.key, group: f.group, order: f.order, compare: f.compare ?? true, name: f.name, unit: f.unit })),
    packages: packages.map((p) => ({
      key: p.key,
      category: p.category,
      order: p.order,
      visible: true,
      name: p.name,
      tagline: p.tagline,
      summary: full ? p.summary : undefined,
      prices: p.prices ?? undefined,
      oneTimePrice: p.oneTimePrice,
      priceIsFrom: false,
      recommended: Boolean(p.recommended),
      badge: p.badge,
      inherits: p.inherits,
      inheritBoundaries: Boolean(p.inheritBoundaries),
      contact: p.contact,
      components: (p.components ?? []).map((key) => ({ key })),
      features: full
        ? p.features.map((f, i) => ({
            featureKey: f.featureKey,
            status: f.status,
            quantity: f.quantity,
            quantityMax: f.quantityMax,
            cadence: f.cadence,
            unit: f.unit,
            replacedBy: f.replacedBy,
            order: i,
            detail: f.detail,
          }))
        : [],
      boundaries: full ? p.boundaries.map((text) => ({ text })) : [],
    })),
    addons: addons.map((a) => ({
      key: a.key,
      price: a.price,
      priceIsFrom: Boolean(a.priceIsFrom),
      units: a.units,
      order: a.order,
      visible: true,
      name: a.name,
      description: full ? a.description : undefined,
      relatedFeatureKey: a.relatedFeatureKey,
      contact: a.contact,
    })),
    terms: full ? terms.map((text) => ({ text })) : [],
    reviewChecklist: full ? reviewChecklist.map((item) => ({ item, done: false })) : [],
    reviewNotes: full
      ? 'Seeded from the revised service proposal. All scopes are PROPOSED. Prices are the original price list (unchanged). Approve and publish only after the review checklist is complete.'
      : 'Published baseline: original prices and package names only. Detailed scopes are in the draft.',
  }
}

async function seedCatalog(payload: Payload) {
  if (await hasVersions(payload, 'pricing-catalog')) return log('pricing catalog exists — skipped (owner edits preserved)')
  await seedGlobal(payload, 'pricing-catalog', catalogData('baseline'), { status: 'published' })
  log('pricing catalog: published baseline (original prices)')
  await seedGlobal(payload, 'pricing-catalog', catalogData('proposal'), { draft: true, status: 'draft' })
  log('pricing catalog: revised scopes saved as an unpublished draft (approval: proposed)')
}

async function seedPages(payload: Payload) {
  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      where: { seedKey: { equals: page.seedKey } },
      draft: true,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      log(`page "${page.seedKey}" exists — skipped`)
      continue
    }
    const data = {
      title: page.title,
      slug: page.slug,
      seedKey: page.seedKey,
      pageType: page.pageType,
      enabledLocales: [...locales],
      layout: page.layout,
      meta: page.meta,
    }
    const created = await payload.create({
      collection: 'pages',
      locale: 'en',
      data: { ...(pick(data, 'en') as object), _status: 'published' } as never,
      overrideAccess: true,
      context: ctx,
      depth: 0,
    })
    let current: unknown = created
    for (const l of other('en')) {
      current = await payload.update({
        collection: 'pages',
        id: created.id,
        locale: l,
        data: { ...(withIds(current, pick(data, l)) as object), _status: 'published' } as never,
        overrideAccess: true,
        context: ctx,
        depth: 0,
      })
    }
    log(`page "${page.seedKey}" created and published`)
  }
}

/** Create whatever is missing. Never overwrites saved content. */
export async function runSeed(payload: Payload) {

  if (!(await hasVersions(payload, 'site-settings'))) {
    await seedGlobal(payload, 'site-settings', {
      siteName: seoDefaults.siteName,
      defaultLocale: 'hy',
      contacts: {
        phoneDisplay: '+374 91 003099',
        phoneE164: '+37491003099',
        whatsappNumber: '37491003099',
        email: 'botz.marketingagency@gmail.com',
        instagramUrl: '',
        people,
        mobileBar: { enabled: true, showCall: true, showWhatsapp: true, showEmail: false },
      },
      forms: { notifyEmails: '', rateLimitPerHour: 6, shareEnabled: true, shareExpiryDays: 30 },
      seo: {
        titleSuffix: seoDefaults.titleSuffix,
        defaultDescription: seoDefaults.defaultDescription,
        allowIndexing: true,
        organization: { areaServed: 'Armenia', sameAs: [] },
      },
      analytics: { requireConsent: true },
    })
    log('site settings seeded')
  } else log('site settings exist — skipped')

  if (!(await hasVersions(payload, 'theme'))) {
    await payload.updateGlobal({ slug: 'theme', data: {}, overrideAccess: true, context: ctx })
    log('theme defaults saved')
  } else log('theme exists — skipped')

  if (!(await hasVersions(payload, 'navigation'))) {
    await seedGlobal(payload, 'navigation', navigation)
    log('navigation seeded')
  } else log('navigation exists — skipped')

  for (const g of uiStringGlobals) {
    if (await hasVersions(payload, g.slug)) {
      log(`${g.slug} exists — skipped`)
      continue
    }
    await seedGlobal(payload, g.slug, Object.fromEntries(g.groups.map((group) => [group, uiDefaults[group]])))
    log(`${g.slug} seeded`)
  }

  if (!(await hasVersions(payload, 'package-guide'))) {
    await seedGlobal(payload, 'package-guide', guide, { status: 'published' })
    log('package guide seeded and published')
  } else log('package guide exists — skipped')

  if (!(await hasVersions(payload, 'growth-offer'))) {
    await seedGlobal(payload, 'growth-offer', growthOffer)
    log('growth & offer seeded (placeholders)')
  } else log('growth & offer exists — skipped')

  await seedCatalog(payload)
  await seedPages(payload)
  log('done')
}

