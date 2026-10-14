import type { Strings } from '@/lib/site'
import type { Catalog, ResolvedFeature } from './types'

export type PricingStrings = Strings['pricing']

const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m))

export const durationLabel = (s: PricingStrings, n: number) => (n === 1 ? s.month1 : fill(s.monthsN, { n }))

/** Short value used in comparison cells and card lists. Never relies on colour alone. */
export function featureValue(f: ResolvedFeature, s: PricingStrings, catalog?: Catalog): { text: string; kind: 'yes' | 'no' | 'unspec' | 'replaced' } {
  if (f.status === 'not_included') return { text: s.notIncluded, kind: 'no' }
  if (f.status === 'not_specified') return { text: s.notSpecified, kind: 'unspec' }
  if (f.status === 'replaced') {
    const by = catalog?.features.find((d) => d.key === f.replacedBy)?.label ?? f.replacedBy ?? ''
    return { text: fill(s.replacedBy, { item: by }), kind: 'replaced' }
  }
  const unit = f.unit || f.def?.unit || ''
  if (f.quantity != null) {
    const q = f.quantityMax != null ? fill(s.range, { min: f.quantity, max: f.quantityMax }) : String(f.quantity)
    return { text: `${q}${unit ? ` ${unit}` : ''}`, kind: 'yes' }
  }
  const cadence = f.cadence && f.cadence !== 'ongoing' ? (s as Record<string, string>)[`cadence_${f.cadence}`] : ''
  return { text: cadence ? `${s.included} · ${cadence}` : s.included, kind: 'yes' }
}

export const groupLabel = (s: PricingStrings, group: string) => (s as Record<string, string>)[`group_${group}`] ?? group
