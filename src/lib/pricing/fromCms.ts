import type { Payload } from 'payload'
import type { Locale } from '@/i18n/config'
import type { Addon, Catalog, FeatureDef, Pkg } from './types'

type Raw = Record<string, any>

/**
 * Convert the stored global (one locale) into the public catalog shape.
 * Private fields (approval state, review notes, checklist) are dropped here,
 * so nothing private can reach the browser.
 */
export function toPublicCatalog(raw: Raw, isDraft = false): Catalog {
  const features: FeatureDef[] = (raw.features ?? []).map((f: Raw, i: number) => ({
    key: f.key,
    label: f.name ?? f.key,
    group: f.group ?? 'delivery',
    unit: f.unit ?? null,
    order: typeof f.order === 'number' ? f.order : i,
    compare: f.compare !== false,
  }))
  const packages: Pkg[] = (raw.packages ?? []).map((p: Raw, i: number) => ({
    key: p.key,
    category: p.category,
    name: p.name ?? p.key,
    tagline: p.tagline ?? null,
    summary: p.summary ?? null,
    prices: {
      m1: p.prices?.m1 ?? null,
      m3: p.prices?.m3 ?? null,
      m6: p.prices?.m6 ?? null,
      m9: p.prices?.m9 ?? null,
      m12: p.prices?.m12 ?? null,
    },
    oneTimePrice: p.oneTimePrice ?? null,
    priceIsFrom: Boolean(p.priceIsFrom),
    recommended: Boolean(p.recommended),
    badge: p.badge ?? null,
    visible: p.visible !== false,
    order: typeof p.order === 'number' ? p.order : i,
    inherits: p.inherits || null,
    components: (p.components ?? []).map((c: Raw) => c.key).filter(Boolean),
    contact: p.contact ?? null,
    inheritBoundaries: Boolean(p.inheritBoundaries),
    features: (p.features ?? []).map((f: Raw) => ({
      featureKey: f.featureKey,
      status: f.status ?? 'included',
      quantity: f.quantity ?? null,
      quantityMax: f.quantityMax ?? null,
      unit: f.unit ?? null,
      cadence: f.cadence ?? null,
      detail: f.detail ?? null,
      note: f.note ?? null,
      replacedBy: f.replacedBy ?? null,
      order: f.order ?? null,
    })),
    boundaries: (p.boundaries ?? []).filter((b: Raw) => b.text).map((b: Raw) => ({ text: b.text })),
  }))
  const addons: Addon[] = (raw.addons ?? []).map((a: Raw, i: number) => ({
    key: a.key,
    name: a.name ?? a.key,
    description: a.description ?? null,
    price: a.price,
    priceIsFrom: Boolean(a.priceIsFrom),
    units: a.units ?? null,
    relatedFeatureKey: a.relatedFeatureKey || null,
    appliesTo: a.appliesTo ?? [],
    contact: a.contact ?? null,
    visible: a.visible !== false,
    order: typeof a.order === 'number' ? a.order : i,
  }))
  return {
    version: String(raw.updatedAt ?? ''),
    currency: 'AMD',
    features,
    packages,
    addons,
    terms: (raw.terms ?? []).filter((t: Raw) => t.text).map((t: Raw) => ({ text: t.text })),
    isDraft,
  }
}

/** Load the catalog for a locale. `draft: true` must only be used for verified staff previews. */
export async function loadCatalog(payload: Payload, locale: Locale, draft = false): Promise<Catalog> {
  const raw = await payload.findGlobal({
    slug: 'pricing-catalog',
    locale,
    fallbackLocale: false,
    draft,
    depth: 0,
    overrideAccess: true,
  })
  // A global that was never published returns its draft fields with _status "draft" – treat as empty publicly.
  if (!draft && (raw as Raw)._status !== 'published') return toPublicCatalog({ packages: [], addons: [], features: [] })
  return toPublicCatalog(raw as Raw, draft)
}
