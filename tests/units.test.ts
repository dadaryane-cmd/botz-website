// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { addons, featureDefs, packages } from '@/seed/catalog'
import { guide as guideSeed } from '@/seed/content'
import { pick } from '@/seed/helpers'
import { recommend, type GuideConfig } from '@/lib/guide'
import { toPublicCatalog } from '@/lib/pricing/fromCms'
import { _resetAnalytics, _sentEvents, configureAnalytics, sanitize, setConsent, track } from '@/lib/client/analytics'
import { whatsappMessage } from '@/lib/whatsapp'
import { routeContacts, type ContactInfo } from '@/lib/contact'
import { checkFormToken, issueFormToken, rateLimit, resetRateLimits } from '@/lib/security'
import { csvCell } from '@/endpoints/leadsExport'
import { contrast } from '@/lib/color'
import { themeDefaults } from '@/globals/Theme'
import { mergeStrings } from '@/lib/site'
import { inquirySchema } from '@/lib/inquiry'
import { notifyRecipients } from '@/endpoints/inquiry'

const catalog = toPublicCatalog(
  pick({
    updatedAt: 'v',
    features: featureDefs,
    packages: packages.map((p) => ({ ...p, visible: true, components: (p.components ?? []).map((key) => ({ key })), boundaries: [] })),
    addons: addons.map((a) => ({ ...a, visible: true })),
  }, 'en'),
)
const guide = pick<GuideConfig>(guideSeed, 'en')

describe('package guide', () => {
  const base = { website: 'yes', social: 'active', production: 'none', budget: 'unsure', term: 'm12' }
  it('recommends a bundle for social + search and explains why', () => {
    const r = recommend(guide, catalog, { ...base, goal: 'both' })
    expect(r.best?.pkg.key).toBe('business-boost')
    expect(r.best?.reasons.length).toBeGreaterThan(0)
    expect(r.best?.total).toBe(389000 * 12)
  })
  it('missing website does not exclude SEO', () => {
    const r = recommend(guide, catalog, { ...base, goal: 'search', website: 'no' })
    const keys = [r.best?.pkg.key, ...r.alternatives.map((a) => a.pkg.key)]
    expect(keys).toContain('website-creation')
    expect(keys.some((k) => k?.startsWith('seo-'))).toBe(true)
  })
  it('respects the budget and shows the true cost', () => {
    const r = recommend(guide, catalog, { ...base, goal: 'social', budget: 'b100', term: 'm12' })
    expect(r.best?.pkg.key).toBe('smm-start')
    expect(r.best?.monthly).toBe(66500)
    expect(r.alternatives.every((a) => !a.withinBudget || a.monthly! <= 100000)).toBe(true)
  })
  it('suggests a custom discussion when nothing fits the budget', () => {
    const r = recommend(guide, catalog, { ...base, goal: 'both', budget: 'b100' })
    expect(r.suggestCustom).toBe(true)
  })
  it('handles terms a package does not offer', () => {
    const only: GuideConfig = { ...guide, rules: [{ key: 'f', packageKey: 'seo-fundamental', points: 1, when: [{ question: 'goal', values: ['search'] }], reason: 'x' }] }
    const r = recommend(only, catalog, { ...base, goal: 'search', term: 'm12' })
    const fund = [r.best, ...r.alternatives].find((c) => c?.pkg.key === 'seo-fundamental')
    expect(r.best).toBeNull() // not offered for 12 months, so it is shown as an alternative with its real term
    expect(r.suggestCustom).toBe(true)
    expect(fund?.durationAvailable).toBe(false)
    expect(fund?.duration).toBe(6)
  })
})

describe('analytics', () => {
  beforeEach(() => {
    _resetAnalytics()
    localStorage.clear()
  })
  it('is off until a provider is configured', () => {
    configureAnalytics({ provider: 'none', requireConsent: false, events: [] })
    expect(track('phone_click', {})).toBe(false)
  })
  it('waits for consent when required', () => {
    configureAnalytics({ provider: 'plausible', id: 'botz.test', requireConsent: true, events: [] })
    expect(track('phone_click', { contact: 'mariam' })).toBe(false)
    setConsent('granted')
    expect(track('email_click', { contact: 'mariam' })).toBe(true)
  })
  it('never sends personal data', () => {
    expect(sanitize({ name: 'Ann', email: 'a@b.c', message: 'hi', contact: 'edgar', package: 'ultra', phone: '+37491003099', page: '+374 91 003099' })).toEqual({
      contact: 'edgar',
      package: 'ultra',
    })
  })
  it('deduplicates repeated events and fires views once per page', () => {
    configureAnalytics({ provider: 'plausible', id: 'botz.test', requireConsent: false, events: [] })
    expect(track('whatsapp_click', { contact: 'edgar' })).toBe(true)
    expect(track('whatsapp_click', { contact: 'edgar' })).toBe(false)
    expect(track('service_view', { service: 'smm' }, { oncePerPage: true })).toBe(true)
    expect(track('service_view', { service: 'smm' }, { oncePerPage: true })).toBe(false)
    expect(_sentEvents()).toHaveLength(2)
  })
  it('respects the enabled-events list from settings', () => {
    configureAnalytics({ provider: 'plausible', id: 'botz.test', requireConsent: false, events: ['inquiry_saved'] })
    expect(track('phone_click')).toBe(false)
    expect(track('inquiry_saved', { service: 'seo' })).toBe(true)
  })
})

describe('contacts and WhatsApp', () => {
  const info: ContactInfo = {
    phoneDisplay: '+374 91 003099',
    phoneE164: '+37491003099',
    whatsappNumber: '37491003099',
    email: 'botz.marketingagency@gmail.com',
    people: [
      { key: 'mariam', name: 'Mariam', services: ['smm', 'bundle', 'addon'], phoneE164: '+37491003099', whatsappNumber: '37491003099', email: 'x' },
      { key: 'edgar', name: 'Edgar', services: ['seo', 'website', 'bundle', 'addon'], phoneE164: '+37491003099', whatsappNumber: '37491003099', email: 'x' },
    ],
  }
  it('routes SMM to Mariam, SEO/website to Edgar, bundles to either', () => {
    expect(routeContacts(info, 'smm').map((p) => p.key)).toEqual(['mariam'])
    expect(routeContacts(info, 'seo').map((p) => p.key)).toEqual(['edgar'])
    expect(routeContacts(info, 'website').map((p) => p.key)).toEqual(['edgar'])
    expect(routeContacts(info, 'bundle').map((p) => p.key)).toEqual(['mariam', 'edgar'])
  })
  it('builds a localized, encodable message with package, duration and add-ons', () => {
    const s = mergeStrings(null, 'hy')
    const msg = whatsappMessage({
      strings: { whatsapp: s.whatsapp, pricing: s.pricing, services: s.services },
      locale: 'hy',
      contactName: 'Մարիամ',
      catalog,
      selection: { packageKey: 'smm-gold', duration: 6, addons: [{ key: 'reel', qty: 2 }] },
    })
    expect(msg).toContain('Մարիամ')
    expect(msg).toContain('Gold')
    expect(msg).toContain('6 ամիս')
    expect(msg).toContain('×2')
    expect(msg).toContain('890,000')
    const url = `https://wa.me/37491003099?text=${encodeURIComponent(msg)}`
    expect(decodeURIComponent(new URL(url).searchParams.get('text')!)).toBe(msg)
  })
})

describe('security helpers', () => {
  it('form tokens are signed and time-boxed', () => {
    const t = issueFormToken(1_000_000)
    expect(checkFormToken(t, 1_000_500)).toBe('too_fast')
    expect(checkFormToken(t, 1_010_000)).toBe('ok')
    expect(checkFormToken(t, 1_000_000 + 7 * 3600_000)).toBe('expired')
    expect(checkFormToken(t.replace(/.$/, (c) => (c === 'a' ? 'b' : 'a')), 1_010_000)).toBe('invalid')
  })
  it('rate limits per key', () => {
    resetRateLimits()
    expect([1, 2, 3].map(() => rateLimit('k', 2, 1000, 5000))).toEqual([true, true, false])
    expect(rateLimit('k', 2, 1000, 7000)).toBe(true)
  })
  it('CSV export neutralises spreadsheet formulas', () => {
    expect(csvCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`)
    expect(csvCell('Hello')).toBe('"Hello"')
  })
  it('inquiry emails go to the admin setting, then INQUIRY_NOTIFY_TO, then the default address', () => {
    const prev = process.env.INQUIRY_NOTIFY_TO
    delete process.env.INQUIRY_NOTIFY_TO
    expect(notifyRecipients('')).toEqual(['dadaryane@gmail.com'])
    process.env.INQUIRY_NOTIFY_TO = 'a@example.com, b@example.com'
    expect(notifyRecipients(null)).toEqual(['a@example.com', 'b@example.com'])
    expect(notifyRecipients(' sales@example.com ')).toEqual(['sales@example.com'])
    if (prev === undefined) delete process.env.INQUIRY_NOTIFY_TO
    else process.env.INQUIRY_NOTIFY_TO = prev
  })
  it('inquiry validation needs an email or a phone', () => {
    const base = { submissionId: crypto.randomUUID(), formToken: 'x'.repeat(20), name: 'Ann', service: 'seo', message: 'Hello there', preferredContact: 'edgar', locale: 'en' }
    expect(inquirySchema.safeParse(base).success).toBe(false)
    expect(inquirySchema.safeParse({ ...base, phone: '+374 91 003099' }).success).toBe(true)
    expect(inquirySchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false)
  })
})

describe('accessible defaults', () => {
  it('default theme colours meet WCAG AA', () => {
    for (const p of [themeDefaults.light, themeDefaults.dark]) {
      expect(contrast(p.text, p.bg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(p.muted, p.bg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(p.onAccent, p.accent)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(p.inverseText, p.inverseBg)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(p.accentText, p.bg)).toBeGreaterThanOrEqual(3)
    }
  })
  it('every interface string exists in all three languages', () => {
    for (const l of ['hy', 'en', 'ru'] as const) {
      const s = mergeStrings(null, l) as unknown as Record<string, Record<string, string>>
      for (const g of Object.values(s)) for (const v of Object.values(g)) expect(v.trim().length).toBeGreaterThan(0)
    }
  })
})
