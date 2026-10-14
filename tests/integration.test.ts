/**
 * Integration tests against a real (throwaway) SQLite database using the
 * Payload Local API and the actual HTTP endpoint handlers.
 */
import config from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload, type Payload, type PayloadRequest } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { shareEstimateEndpoint } from '@/endpoints/estimates'
import { inquiryEndpoint } from '@/endpoints/inquiry'
import { leadsExportEndpoint } from '@/endpoints/leadsExport'
import { loadCatalog } from '@/lib/pricing/fromCms'
import { resolveFeatures } from '@/lib/pricing/engine'
import { issueFormToken, resetRateLimits } from '@/lib/security'
import { translationReport } from '@/lib/translations'
import { runSeed } from '@/seed/seed'

let payload: Payload
const dbFile = (process.env.DATABASE_URL ?? '').replace(/^file:/, '')

type User = Record<string, unknown> & { id: number | string; collection: 'users' }
let admin: User, editor: User, sales: User

function fakeReq(body: unknown, extra: Partial<PayloadRequest> = {}): PayloadRequest {
  const text = JSON.stringify(body)
  return {
    payload,
    headers: new Headers({ 'content-type': 'application/json', 'content-length': String(text.length), 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}` }),
    text: async () => text,
    user: null,
    searchParams: new URLSearchParams(),
    ...extra,
  } as unknown as PayloadRequest
}

const inquiry = (over: Record<string, unknown> = {}) => ({
  submissionId: crypto.randomUUID(),
  formToken: issueFormToken(Date.now() - 10_000),
  website: '',
  name: 'Test Client',
  email: 'client@example.test',
  phone: '',
  service: 'smm',
  message: 'We would like a proposal for social media.',
  preferredContact: 'either',
  locale: 'en',
  source: '/en/smm',
  selection: { packageKey: 'smm-gold', duration: 6, addons: [{ key: 'reel', qty: 1 }] },
  ...over,
})

async function makeUser(email: string, roles: string[]) {
  return (await payload.create({
    collection: 'users',
    data: { email, password: 'correct-horse-battery', roles: roles as never },
    overrideAccess: true,
    context: { allowAdminSetup: true },
  })) as unknown as User
}

beforeAll(async () => {
  payload = await getPayload({ config })
  await runSeed(payload)
  admin = await makeUser('admin@test.local', ['admin'])
  editor = await makeUser('editor@test.local', ['editor'])
  sales = await makeUser('sales@test.local', ['sales'])
})

afterAll(async () => {
  await payload?.db?.destroy?.()
  // Best effort: Windows may keep the file locked until the process exits; vitest.setup.ts clears leftovers next run.
  for (const f of [dbFile, `${dbFile}-wal`, `${dbFile}-shm`, `${dbFile}-journal`]) {
    try {
      if (f && fs.existsSync(f)) fs.rmSync(f, { force: true })
    } catch {
      // ignore
    }
  }
})

describe('seed', () => {
  it('publishes original prices only and keeps revised scopes in a draft', async () => {
    const published = await loadCatalog(payload, 'en', false)
    const draft = await loadCatalog(payload, 'en', true)
    expect(published.packages.find((p) => p.key === 'smm-gold')?.prices.m6).toBe(140000)
    expect(published.packages.every((p) => p.features.length === 0)).toBe(true)
    expect(published.terms).toHaveLength(0)
    expect(resolveFeatures(draft, 'smm-gold').length).toBeGreaterThan(10)
    const raw = (await payload.findGlobal({ slug: 'pricing-catalog', draft: true, overrideAccess: true })) as unknown as Record<string, unknown>
    expect(raw.approvalState).toBe('proposed')
  })
  it('is repeatable and never overwrites owner edits', async () => {
    await payload.updateGlobal({ slug: 'site-settings', data: { contacts: { phoneDisplay: 'OWNER EDIT' } } as never, overrideAccess: true })
    const pagesBefore = (await payload.count({ collection: 'pages', overrideAccess: true })).totalDocs
    await runSeed(payload)
    const s = (await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })) as { contacts: { phoneDisplay: string } }
    expect(s.contacts.phoneDisplay).toBe('OWNER EDIT')
    expect((await payload.count({ collection: 'pages', overrideAccess: true })).totalDocs).toBe(pagesBefore)
  })
  it('has all pages in all three languages', async () => {
    const res = await payload.find({ collection: 'pages', locale: 'all', pagination: false, overrideAccess: true })
    expect(res.docs).toHaveLength(8)
    for (const d of res.docs as unknown as { title: Record<string, string> }[]) expect(Object.keys(d.title).sort()).toEqual(['en', 'hy', 'ru'])
  })
})

describe('publishing workflow', () => {
  it('blocks publishing commercial terms before approval', async () => {
    await expect(
      payload.updateGlobal({ slug: 'pricing-catalog', data: { _status: 'published' } as never, overrideAccess: true }),
    ).rejects.toThrow(/Approval state/)
  })
  it('drafts never leak into the published catalog', async () => {
    const draft = (await payload.findGlobal({ slug: 'pricing-catalog', draft: true, depth: 0, overrideAccess: true })) as { packages: { prices?: { m6?: number } }[] }
    draft.packages[2].prices = { ...draft.packages[2].prices, m6: 141000 }
    await payload.updateGlobal({ slug: 'pricing-catalog', draft: true, data: { packages: draft.packages } as never, overrideAccess: true })
    const pub = await loadCatalog(payload, 'en', false)
    expect(pub.packages.find((p) => p.key === 'smm-gold')?.prices.m6).toBe(140000)
    const pre = await loadCatalog(payload, 'en', true)
    expect(pre.packages.find((p) => p.key === 'smm-gold')?.prices.m6).toBe(141000)
  })
  it('publishes prices, scopes and labels together once approved, and can restore', async () => {
    await payload.updateGlobal({ slug: 'pricing-catalog', data: { approvalState: 'approved', _status: 'published' } as never, overrideAccess: true })
    const pub = await loadCatalog(payload, 'en', false)
    expect(pub.packages.find((p) => p.key === 'smm-gold')?.prices.m6).toBe(141000)
    expect(resolveFeatures(pub, 'seo-authority').find((f) => f.featureKey === 'seo_articles')?.quantity).toBe(6)
    expect(pub.terms.length).toBeGreaterThan(0)

    // Restore the original published baseline as a new revision.
    const versions = await payload.findGlobalVersions({
      slug: 'pricing-catalog',
      where: { 'version._status': { equals: 'published' } },
      sort: 'createdAt',
      limit: 1,
      overrideAccess: true,
    })
    const before = (await payload.findGlobalVersions({ slug: 'pricing-catalog', limit: 0, overrideAccess: true })).totalDocs
    await payload.restoreGlobalVersion({ slug: 'pricing-catalog', id: String(versions.docs[0].id), overrideAccess: true })
    const restored = await loadCatalog(payload, 'en', false)
    expect(restored.packages.find((p) => p.key === 'smm-gold')?.prices.m6).toBe(140000)
    expect(restored.packages.every((p) => p.features.length === 0)).toBe(true)
    const after = (await payload.findGlobalVersions({ slug: 'pricing-catalog', limit: 0, overrideAccess: true })).totalDocs
    expect(after).toBeGreaterThan(before) // restoring adds a revision; history is kept
  })
})

describe('inquiries', () => {
  it('saves a genuine inquiry with a server-calculated snapshot, even when email fails', async () => {
    resetRateLimits()
    const body = inquiry()
    const res = await inquiryEndpoint.handler(fakeReq(body))
    expect(res.status).toBe(200)
    expect((await res.json()).ok).toBe(true)
    const lead = (await payload.find({ collection: 'leads', where: { submissionId: { equals: body.submissionId } }, overrideAccess: true })).docs[0] as Record<string, any>
    expect(lead.selection.snapshot.monthly).toBe(140000)
    expect(lead.selection.snapshot.combinedTotal).toBe(140000 * 6 + 25000)
    expect(lead.assignedTo).toBe('mariam') // SMM routes to Mariam
    expect(lead.notification.status).toBe('failed') // SMTP points at a closed port in tests
  })
  it('never duplicates a retried submission', async () => {
    const body = inquiry()
    await inquiryEndpoint.handler(fakeReq(body))
    const again = await (await inquiryEndpoint.handler(fakeReq(body))).json()
    expect(again.duplicate).toBe(true)
    expect((await payload.count({ collection: 'leads', where: { submissionId: { equals: body.submissionId } }, overrideAccess: true })).totalDocs).toBe(1)
  })
  it('ignores browser amounts and rejects unavailable selections', async () => {
    const res = await inquiryEndpoint.handler(fakeReq(inquiry({ selection: { packageKey: 'seo-fundamental', duration: 12 }, monthly: 1 })))
    expect(res.status).toBe(409)
  })
  it('returns field errors for invalid input', async () => {
    const res = await inquiryEndpoint.handler(fakeReq(inquiry({ email: '', phone: '' })))
    expect(res.status).toBe(400)
    expect((await res.json()).fields.email).toBe('needEmailOrPhone')
  })
  it('silently drops spam (honeypot / too fast) without saving', async () => {
    const before = (await payload.count({ collection: 'leads', overrideAccess: true })).totalDocs
    await inquiryEndpoint.handler(fakeReq(inquiry({ website: 'http://spam.example' })))
    await inquiryEndpoint.handler(fakeReq(inquiry({ formToken: issueFormToken(Date.now()) })))
    expect((await payload.count({ collection: 'leads', overrideAccess: true })).totalDocs).toBe(before)
  })
  it('rejects forged form tokens', async () => {
    const res = await inquiryEndpoint.handler(fakeReq(inquiry({ formToken: `${Date.now() - 9000}.forged-signature` })))
    expect(res.status).toBe(400)
  })
})

describe('access control', () => {
  it('leads are private: sales can read, editors and the public cannot', async () => {
    const asSales = await payload.find({ collection: 'leads', user: sales, overrideAccess: false })
    expect(asSales.totalDocs).toBeGreaterThan(0)
    await expect(payload.find({ collection: 'leads', user: editor, overrideAccess: false })).rejects.toThrow()
    await expect(payload.find({ collection: 'leads', overrideAccess: false })).rejects.toThrow()
  })
  it('only admins delete leads and export them', async () => {
    const lead = (await payload.find({ collection: 'leads', limit: 1, overrideAccess: true })).docs[0]
    await expect(payload.delete({ collection: 'leads', id: lead.id, user: sales, overrideAccess: false })).rejects.toThrow()
    const denied = await leadsExportEndpoint.handler(fakeReq({}, { user: sales as never }))
    expect(denied.status).toBe(403)
    const ok = await leadsExportEndpoint.handler(fakeReq({}, { user: admin as never, searchParams: new URLSearchParams('status=new') }))
    expect(ok.status).toBe(200)
    const csv = await ok.text()
    expect(csv).toContain('client@example.test')
  })
  it('there is no public sign-up', async () => {
    await expect(payload.create({ collection: 'users', data: { email: 'x@x.test', password: 'aaaaaaaaaaaa', roles: ['admin'] } as never })).rejects.toThrow(/npm run admin:create/)
  })
  it('the public API never exposes drafts, the catalog or settings', async () => {
    const pages = await payload.find({ collection: 'pages', draft: true, overrideAccess: false })
    expect(pages.docs.every((d) => (d as { _status?: string })._status === 'published')).toBe(true)
    await expect(payload.findGlobal({ slug: 'pricing-catalog', overrideAccess: false })).rejects.toThrow()
  })
  it('lead status changes are recorded in the history', async () => {
    const lead = (await payload.find({ collection: 'leads', limit: 1, overrideAccess: true })).docs[0]
    const updated = (await payload.update({ collection: 'leads', id: lead.id, data: { status: 'contacted', notes: [{ body: 'Called back' }] } as never, user: sales, overrideAccess: false })) as Record<string, any>
    expect(updated.activity.some((a: { change: string }) => a.change.includes('contacted'))).toBe(true)
    expect(updated.notes[0].author).toBe('sales@test.local')
  })
})

describe('content editing', () => {
  it('renaming a published page keeps the old address via a redirect', async () => {
    const page = (await payload.find({ collection: 'pages', where: { seedKey: { equals: 'about' } }, overrideAccess: true })).docs[0]
    await payload.update({ collection: 'pages', id: page.id, locale: 'en', data: { slug: 'about-us', _status: 'published' } as never, overrideAccess: true })
    const r = await payload.find({ collection: 'redirects', where: { from: { equals: '/en/about' } }, overrideAccess: true })
    expect((r.docs[0] as { to: { url: string } }).to.url).toBe('/en/about-us')
  })
  it('media in use cannot be deleted; unused media can', async () => {
    const file = fs.readFileSync(path.resolve('public/brand/icon-192.png'))
    const media = await payload.create({
      collection: 'media',
      data: { alt: 'Test image' },
      file: { data: file, mimetype: 'image/png', name: `test-${Date.now()}.png`, size: file.length },
      overrideAccess: true,
    })
    const page = (await payload.find({ collection: 'pages', where: { seedKey: { equals: 'contact' } }, depth: 0, overrideAccess: true })).docs[0] as Record<string, any>
    const layout = [...page.layout, { blockType: 'mediaBlock', media: media.id }]
    await payload.update({ collection: 'pages', id: page.id, data: { layout } as never, overrideAccess: true })
    await expect(payload.delete({ collection: 'media', id: media.id, overrideAccess: true })).rejects.toThrow(/still used/)
    await payload.update({ collection: 'pages', id: page.id, data: { layout: page.layout } as never, overrideAccess: true })
    await payload.delete({ collection: 'media', id: media.id, overrideAccess: true })
  })
  it('refuses unreadable colour combinations', async () => {
    await expect(payload.updateGlobal({ slug: 'theme', data: { light: { text: '#F0F0F0' } } as never, overrideAccess: true })).rejects.toThrow(/contrast/)
  })
  it('flags missing translations', async () => {
    const page = (await payload.find({ collection: 'pages', where: { seedKey: { equals: 'services' } }, overrideAccess: true })).docs[0]
    await payload.update({ collection: 'pages', id: page.id, locale: 'hy', data: { title: '' } as never, overrideAccess: true, draft: true }).catch(() => undefined)
    await payload.update({ collection: 'pages', id: page.id, locale: 'ru', data: { meta: { description: '' } } as never, overrideAccess: true })
    const report = await translationReport(payload)
    expect(report.some((r) => r.where.startsWith('pages') && r.missing.includes('ru'))).toBe(true)
  })
})

describe('shared estimates', () => {
  it('creates an unguessable link with a dated snapshot and no personal data', async () => {
    const res = await shareEstimateEndpoint.handler(fakeReq({ locale: 'hy', selection: { packageKey: 'ultra', duration: 12, addons: [] } }))
    const body = await res.json()
    expect(body.ok).toBe(true)
    const token = body.url.split('/').pop()
    expect(token.length).toBeGreaterThanOrEqual(40)
    const est = (await payload.find({ collection: 'estimates', where: { token: { equals: token } }, overrideAccess: true })).docs[0] as Record<string, any>
    expect(est.snapshot.recurringTotal).toBe(529000 * 12)
    expect(JSON.stringify(est)).not.toMatch(/@|client/i)
    expect(new Date(est.expiresAt).getTime()).toBeGreaterThan(Date.now() + 29 * 86_400_000)
  })
  it('refuses selections that are not available', async () => {
    const res = await shareEstimateEndpoint.handler(fakeReq({ locale: 'en', selection: { packageKey: 'seo-fundamental', duration: 9 } }))
    expect(res.status).toBe(409)
  })
})
