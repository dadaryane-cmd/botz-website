import type {
  Addon,
  Catalog,
  Duration,
  FeatureDef,
  Pkg,
  PriceLine,
  Prices,
  Quote,
  QuoteError,
  ResolvedFeature,
  Selection,
} from './types'
import { DURATIONS } from './types'

export const isDuration = (n: unknown): n is Duration => DURATIONS.includes(n as Duration)

const priceKey = (d: Duration) => `m${d}` as keyof Prices

/** Monthly fee for a duration, or null when the duration is unavailable. Zero is never a valid price. */
export function monthlyFee(pkg: Pkg, duration: Duration): number | null {
  const v = pkg.prices?.[priceKey(duration)]
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? v : null
}

export const availableDurations = (pkg: Pkg): Duration[] => DURATIONS.filter((d) => monthlyFee(pkg, d) !== null)

export const isRecurring = (pkg: Pkg) => pkg.category !== 'website'

/**
 * Total recurring cost = monthly fee × months.
 * Savings = (one-month fee − selected monthly fee) × months.
 * Derived from prices only; never from labels.
 */
export function priceLine(pkg: Pkg, duration: Duration): PriceLine | null {
  const monthly = monthlyFee(pkg, duration)
  const oneMonthFee = monthlyFee(pkg, 1)
  if (monthly === null || oneMonthFee === null) return null
  return {
    monthly,
    oneMonthFee,
    months: duration,
    recurringTotal: monthly * duration,
    savings: Math.max(0, (oneMonthFee - monthly) * duration),
  }
}

/** Largest saving across available durations ("save up to"). */
export function maxSavings(pkg: Pkg): { duration: Duration; savings: number } | null {
  let best: { duration: Duration; savings: number } | null = null
  for (const d of availableDurations(pkg)) {
    const line = priceLine(pkg, d)
    if (line && line.savings > 0 && (!best || line.savings > best.savings)) best = { duration: d, savings: line.savings }
  }
  return best
}

export const findPackage = (catalog: Catalog, key?: string | null) => catalog.packages.find((p) => p.key === key)
export const findAddon = (catalog: Catalog, key?: string | null) => catalog.addons.find((a) => a.key === key)

/**
 * Resolve a package's full inclusion list:
 *  - `inherits`: start from the parent package's resolved features;
 *  - `components` (bundles): start from every component's resolved features;
 *  - then apply the package's own rows by featureKey. An own row REPLACES the
 *    inherited row entirely (replacement quantities, and an "included" row
 *    overrides an inherited "not included" exclusion).
 */
export function resolveFeatures(catalog: Catalog, key: string, seen: Set<string> = new Set()): ResolvedFeature[] {
  const pkg = findPackage(catalog, key)
  if (!pkg || seen.has(key)) return []
  const nextSeen = new Set(seen).add(key)
  const map = new Map<string, ResolvedFeature>()

  const bases = [...(pkg.inherits ? [pkg.inherits] : []), ...(pkg.components ?? [])]
  for (const baseKey of bases) {
    for (const f of resolveFeatures(catalog, baseKey, nextSeen)) {
      map.set(f.featureKey, { ...f, inheritedFrom: f.inheritedFrom ?? baseKey, overridesInherited: false })
    }
  }
  for (const own of pkg.features ?? []) {
    const had = map.has(own.featureKey)
    map.set(own.featureKey, { ...own, inheritedFrom: undefined, overridesInherited: had })
  }

  const defs = new Map(catalog.features.map((d) => [d.key, d]))
  return sortFeatures(
    Array.from(map.values()).map((f) => ({ ...f, def: defs.get(f.featureKey) })),
    catalog.features,
  )
}

const groupOrder = ['scope', 'setup', 'content', 'platforms', 'production', 'ads', 'reporting', 'support', 'delivery']

function sortFeatures(list: ResolvedFeature[], defs: FeatureDef[]) {
  const idx = new Map(defs.map((d, i) => [d.key, i]))
  return list.sort((a, b) => {
    const ga = groupOrder.indexOf(a.def?.group ?? 'delivery')
    const gb = groupOrder.indexOf(b.def?.group ?? 'delivery')
    if (ga !== gb) return ga - gb
    const oa = a.def?.order ?? idx.get(a.featureKey) ?? 999
    const ob = b.def?.order ?? idx.get(b.featureKey) ?? 999
    return oa - ob
  })
}

/** Delivery boundaries: own, plus inherited/component ones when the package opts in. */
export function resolveBoundaries(catalog: Catalog, key: string, seen: Set<string> = new Set()): string[] {
  const pkg = findPackage(catalog, key)
  if (!pkg || seen.has(key)) return []
  const nextSeen = new Set(seen).add(key)
  const own = (pkg.boundaries ?? []).map((b) => b.text).filter(Boolean)
  if (!pkg.inheritBoundaries) return own
  const bases = [...(pkg.inherits ? [pkg.inherits] : []), ...(pkg.components ?? [])]
  const inherited = bases.flatMap((b) => resolveBoundaries(catalog, b, nextSeen))
  return Array.from(new Set([...inherited, ...own]))
}

/** Feature quantity included in a resolved package (used to avoid charging twice). */
export function includedQuantity(catalog: Catalog, packageKey: string | null | undefined, featureKey: string): number {
  if (!packageKey) return 0
  const f = resolveFeatures(catalog, packageKey).find((x) => x.featureKey === featureKey)
  return f && f.status === 'included' ? (f.quantityMax ?? f.quantity ?? 0) : 0
}

/** Build a quote. Used identically in the browser and, authoritatively, on the server. */
export function quote(catalog: Catalog, sel: Selection): Quote {
  const errors: QuoteError[] = []
  const out: Quote = { addons: [], oneTimeTotal: 0, combinedTotal: 0, isMinimum: false, errors }

  if (sel.packageKey) {
    const pkg = findPackage(catalog, sel.packageKey)
    if (!pkg) errors.push({ code: 'unknown_package', key: sel.packageKey })
    else if (!pkg.visible) errors.push({ code: 'hidden', key: pkg.key })
    else {
      out.packageKey = pkg.key
      if (isRecurring(pkg)) {
        const d = sel.duration
        if (!isDuration(d)) errors.push({ code: 'invalid_duration', duration: Number(d) })
        else {
          const line = priceLine(pkg, d)
          if (!line) errors.push({ code: 'duration_unavailable', key: pkg.key, duration: d })
          else {
            out.duration = d
            out.recurring = line
          }
        }
      } else if (typeof pkg.oneTimePrice === 'number' && pkg.oneTimePrice > 0) {
        out.oneTimePackage = pkg.oneTimePrice
        out.oneTimeTotal += pkg.oneTimePrice
      }
      if (pkg.priceIsFrom) out.isMinimum = true
    }
  }

  const seen = new Set<string>()
  for (const a of sel.addons ?? []) {
    if (seen.has(a.key)) continue
    seen.add(a.key)
    const addon = findAddon(catalog, a.key)
    if (!addon) {
      errors.push({ code: 'unknown_addon', key: a.key })
      continue
    }
    if (!addon.visible) {
      errors.push({ code: 'hidden', key: addon.key })
      continue
    }
    const qty = Math.floor(Number(a.qty))
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
      errors.push({ code: 'invalid_quantity', key: addon.key })
      continue
    }
    const total = addon.price * qty
    out.addons.push({ key: addon.key, qty, unitPrice: addon.price, total, priceIsFrom: Boolean(addon.priceIsFrom) })
    out.oneTimeTotal += total
    if (addon.priceIsFrom) out.isMinimum = true
  }

  out.combinedTotal = (out.recurring?.recurringTotal ?? 0) + out.oneTimeTotal
  return out
}

/** Packages visible in a category, in display order. */
export const packagesIn = (catalog: Catalog, category?: string | null) =>
  catalog.packages
    .filter((p) => p.visible && (!category || p.category === category))
    .sort((a, b) => a.order - b.order)

export const visibleAddons = (catalog: Catalog, category?: string | null) =>
  catalog.addons
    .filter((a) => a.visible && (!category || !a.appliesTo?.length || a.appliesTo.includes(category as never)))
    .sort((a, b) => a.order - b.order)

export type { Addon }
