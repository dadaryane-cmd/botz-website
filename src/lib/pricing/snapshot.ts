import { findAddon, findPackage, quote } from './engine'
import type { Catalog, Quote, Selection } from './types'

export type PriceSnapshot = {
  calculatedAt: string
  catalogVersion: string
  currency: 'AMD'
  packageKey?: string
  packageName?: string
  category?: string
  duration?: number
  monthly?: number
  oneMonthFee?: number
  recurringTotal?: number
  savings?: number
  oneTimePackage?: number
  addons: { key: string; name: string; qty: number; unitPrice: number; total: number; priceIsFrom: boolean }[]
  oneTimeTotal: number
  combinedTotal: number
  isMinimum: boolean
}

export function buildSnapshot(catalog: Catalog, q: Quote, now = new Date()): PriceSnapshot {
  const pkg = findPackage(catalog, q.packageKey)
  return {
    calculatedAt: now.toISOString(),
    catalogVersion: catalog.version,
    currency: 'AMD',
    packageKey: q.packageKey,
    packageName: pkg?.name,
    category: pkg?.category,
    duration: q.duration,
    monthly: q.recurring?.monthly,
    oneMonthFee: q.recurring?.oneMonthFee,
    recurringTotal: q.recurring?.recurringTotal,
    savings: q.recurring?.savings,
    oneTimePackage: q.oneTimePackage,
    addons: q.addons.map((a) => ({ ...a, name: findAddon(catalog, a.key)?.name ?? a.key })),
    oneTimeTotal: q.oneTimeTotal,
    combinedTotal: q.combinedTotal,
    isMinimum: q.isMinimum,
  }
}

/** Has anything that affects the amounts changed since the snapshot? */
export function snapshotChanged(catalog: Catalog, selection: Selection, snap: PriceSnapshot): boolean {
  const q = quote(catalog, selection)
  if (q.errors.length) return true
  return (
    (q.recurring?.monthly ?? null) !== (snap.monthly ?? null) ||
    (q.recurring?.recurringTotal ?? null) !== (snap.recurringTotal ?? null) ||
    (q.oneTimePackage ?? null) !== (snap.oneTimePackage ?? null) ||
    q.oneTimeTotal !== snap.oneTimeTotal ||
    q.combinedTotal !== snap.combinedTotal ||
    q.isMinimum !== snap.isMinimum
  )
}

export const hasSelection = (s?: Selection | null) => Boolean(s && (s.packageKey || (s.addons && s.addons.length)))
