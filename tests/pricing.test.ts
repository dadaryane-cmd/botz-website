import { describe, expect, it } from 'vitest'
import { addons, featureDefs, packages, terms } from '@/seed/catalog'
import { pick } from '@/seed/helpers'
import { toPublicCatalog } from '@/lib/pricing/fromCms'
import { availableDurations, includedQuantity, maxSavings, monthlyFee, priceLine, quote, resolveBoundaries, resolveFeatures } from '@/lib/pricing/engine'
import { buildSnapshot, snapshotChanged } from '@/lib/pricing/snapshot'
import { featureValue } from '@/lib/pricing/present'
import { mergeStrings } from '@/lib/site'
import type { Catalog } from '@/lib/pricing/types'

/** Build the full proposal catalog exactly as the seed stores it (English). */
function proposalCatalog(): Catalog {
  const raw = pick<Record<string, unknown>>(
    {
      updatedAt: 'v1',
      features: featureDefs.map((f) => ({ ...f, compare: true })),
      packages: packages.map((p) => ({
        ...p,
        visible: true,
        components: (p.components ?? []).map((key) => ({ key })),
        boundaries: p.boundaries.map((text) => ({ text })),
      })),
      addons: addons.map((a) => ({ ...a, visible: true })),
      terms: terms.map((text) => ({ text })),
    },
    'en',
  )
  return toPublicCatalog(raw)
}

const table: Record<string, (number | null)[]> = {
  'smm-start': [79000, 75000, 73000, 70000, 66500],
  'smm-dominance': [119000, 115000, 110000, 105000, 103000],
  'smm-gold': [149000, 145000, 140000, 135000, 129000],
  'seo-fundamental': [179000, 175000, 165000, null, null],
  'seo-vision': [349000, 340000, 330000, 320000, 299000],
  'seo-authority': [499000, 480000, 475000, 445000, 420000],
  'business-boost': [449000, 430000, 420000, 410000, 389000],
  ultra: [630000, 615000, 610000, 559000, 529000],
}
const D = [1, 3, 6, 9, 12] as const

describe('price table (original price list, unchanged)', () => {
  const c = proposalCatalog()
  for (const [key, row] of Object.entries(table)) {
    it(`${key} monthly fees`, () => {
      const pkg = c.packages.find((p) => p.key === key)!
      expect(D.map((d) => monthlyFee(pkg, d))).toEqual(row)
    })
  }
})

describe('totals and savings are calculated from prices', () => {
  const c = proposalCatalog()
  it('total = monthly × months; savings = (1-month fee − monthly) × months', () => {
    for (const [key, row] of Object.entries(table)) {
      const pkg = c.packages.find((p) => p.key === key)!
      D.forEach((d, i) => {
        const line = priceLine(pkg, d)
        if (row[i] === null) return expect(line).toBeNull()
        expect(line!.recurringTotal).toBe(row[i]! * d)
        expect(line!.savings).toBe((row[0]! - row[i]!) * d)
      })
    }
  })
  it('matches known values from the price list', () => {
    const get = (k: string, d: (typeof D)[number]) => priceLine(c.packages.find((p) => p.key === k)!, d)!
    expect(get('smm-start', 12).savings).toBe(150000)
    expect(get('seo-vision', 12).savings).toBe(600000)
    expect(get('ultra', 12).savings).toBe(1212000)
    expect(get('ultra', 12).recurringTotal).toBe(6348000)
    expect(get('seo-fundamental', 6).savings).toBe(84000)
  })
  it('save-up-to uses the largest real saving', () => {
    expect(maxSavings(c.packages.find((p) => p.key === 'seo-authority')!)).toEqual({ duration: 12, savings: 948000 })
  })
})

describe('unavailable durations', () => {
  const c = proposalCatalog()
  it('Fundamental is unavailable for 9 and 12 months — never zero', () => {
    const f = c.packages.find((p) => p.key === 'seo-fundamental')!
    expect(availableDurations(f)).toEqual([1, 3, 6])
    expect(priceLine(f, 9)).toBeNull()
    expect(quote(c, { packageKey: 'seo-fundamental', duration: 12 }).errors).toEqual([
      { code: 'duration_unavailable', key: 'seo-fundamental', duration: 12 },
    ])
  })
  it('a zero or missing price is treated as unavailable', () => {
    const pkg = { ...c.packages[0], prices: { ...c.packages[0].prices, m3: 0 } }
    expect(monthlyFee(pkg, 3)).toBeNull()
  })
  it('rejects invalid durations', () => {
    expect(quote(c, { packageKey: 'smm-start', duration: 7 }).errors[0].code).toBe('invalid_duration')
  })
})

describe('inheritance, replacements and overrides', () => {
  const c = proposalCatalog()
  const f = (pkg: string, key: string) => resolveFeatures(c, pkg).find((x) => x.featureKey === key)!
  it('Dominance replaces Start quantities instead of adding to them', () => {
    expect(f('smm-start', 'smm_feed').quantity).toBe(8)
    expect(f('smm-dominance', 'smm_feed').quantity).toBe(10)
    expect(f('smm-dominance', 'smm_feed').overridesInherited).toBe(true)
  })
  it('Gold includes videos and community management despite lower-tier exclusions', () => {
    expect(f('smm-start', 'smm_videos').status).toBe('not_included')
    expect(f('smm-dominance', 'smm_videos').status).toBe('not_included')
    expect(f('smm-gold', 'smm_videos')).toMatchObject({ status: 'included', quantity: 4 })
    expect(f('smm-gold', 'smm_community')).toMatchObject({ status: 'included', quantity: 150 })
  })
  it('inherits unchanged rows and records the origin', () => {
    expect(f('smm-gold', 'smm_corrections')).toMatchObject({ status: 'included', quantity: 2, inheritedFrom: 'smm-dominance' })
    expect(f('smm-gold', 'smm_creative').inheritedFrom).toBe('smm-start')
  })
  it('Authority has 6 articles in total, not 8', () => {
    expect(f('seo-vision', 'seo_articles').quantity).toBe(2)
    expect(f('seo-authority', 'seo_articles').quantity).toBe(6)
    expect(f('ultra', 'seo_articles').quantity).toBe(6)
  })
  it('Business Boost = Dominance + Vision; Ultra = Gold + Authority', () => {
    expect(f('business-boost', 'smm_feed').quantity).toBe(10)
    expect(f('business-boost', 'seo_articles').quantity).toBe(2)
    expect(f('ultra', 'smm_feed').quantity).toBe(16)
    expect(f('ultra', 'seo_tech').quantity).toBe(8)
  })
  it('bundles have their own price, not the sum of components', () => {
    const boost = priceLine(c.packages.find((p) => p.key === 'business-boost')!, 1)!.monthly
    expect(boost).toBe(449000)
    expect(boost).not.toBe(119000 + 349000)
  })
  it('bundle meetings and reports are not counted twice', () => {
    expect(f('ultra', 'smm_meeting')).toMatchObject({ status: 'replaced', replacedBy: 'bundle_report' })
    expect(f('ultra', 'seo_consult')).toMatchObject({ status: 'replaced', replacedBy: 'bundle_report' })
  })
  it('bundles show component boundaries; tiers show their own', () => {
    expect(resolveBoundaries(c, 'ultra').length).toBeGreaterThan(resolveBoundaries(c, 'smm-gold').length)
    expect(resolveBoundaries(c, 'smm-gold')).toHaveLength(3)
  })
  it('not included and not specified are different', () => {
    const s = mergeStrings(null, 'en').pricing
    expect(featureValue(f('seo-fundamental', 'seo_articles'), s).kind).toBe('no')
    expect(featureValue(f('seo-fundamental', 'seo_competitors'), s).kind).toBe('unspec')
  })
})

describe('add-ons and estimates', () => {
  const c = proposalCatalog()
  it('separates recurring, one-time and combined amounts', () => {
    const q = quote(c, { packageKey: 'ultra', duration: 12, addons: [{ key: 'reel-4', qty: 1 }, { key: 'article', qty: 2 }] })
    expect(q.recurring!.recurringTotal).toBe(6348000)
    expect(q.oneTimeTotal).toBe(89000 + 78000)
    expect(q.combinedTotal).toBe(6348000 + 167000)
    expect(q.isMinimum).toBe(true) // the article add-on is a "from" price
  })
  it('website creation is one-time', () => {
    const q = quote(c, { packageKey: 'website-creation', addons: [{ key: 'landing-page', qty: 2 }] })
    expect(q.recurring).toBeUndefined()
    expect(q.combinedTotal).toBe(299000 + 158000)
  })
  it('knows which deliverables a plan already includes (never charged twice)', () => {
    expect(includedQuantity(c, 'seo-authority', 'seo_articles')).toBe(6)
    expect(includedQuantity(c, 'smm-start', 'smm_videos')).toBe(0)
  })
  it('rejects unknown add-ons and silly quantities', () => {
    expect(quote(c, { addons: [{ key: 'nope', qty: 1 }] }).errors[0].code).toBe('unknown_addon')
    expect(quote(c, { addons: [{ key: 'reel', qty: 99 }] }).errors[0].code).toBe('invalid_quantity')
  })
  it('flags snapshots when prices change', () => {
    const sel = { packageKey: 'smm-gold', duration: 6 }
    const snap = buildSnapshot(c, quote(c, sel))
    expect(snapshotChanged(c, sel, snap)).toBe(false)
    const changed: Catalog = { ...c, packages: c.packages.map((p) => (p.key === 'smm-gold' ? { ...p, prices: { ...p.prices, m6: 139000 } } : p)) }
    expect(snapshotChanged(changed, sel, snap)).toBe(true)
  })
})
