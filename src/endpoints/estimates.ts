import type { Endpoint } from 'payload'
import { z } from 'zod'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { findPackage, quote } from '@/lib/pricing/engine'
import { loadCatalog } from '@/lib/pricing/fromCms'
import { buildSnapshot, hasSelection } from '@/lib/pricing/snapshot'
import { clientIp, hashIp, randomToken, rateLimit } from '@/lib/security'
import { loadSettings } from '@/lib/site'
import { readJson } from './inquiry'

const schema = z.object({
  locale: z.enum(locales),
  selection: z.object({
    packageKey: z.string().max(60).nullable().optional(),
    duration: z.number().int().nullable().optional(),
    addons: z.array(z.object({ key: z.string().max(60), qty: z.number().int().min(1).max(20) })).max(20).optional(),
  }),
})

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export const shareEstimateEndpoint: Endpoint = {
  // Mounted on the estimates collection → POST /api/estimates/share
  path: '/share',
  method: 'post',
  handler: async (req) => {
    const { payload } = req
    if (!rateLimit(`est:${hashIp(clientIp(req.headers))}`, 20, 60 * 60 * 1000)) return json({ ok: false, code: 'rate_limited' }, 429)
    let body: unknown
    try {
      body = await readJson(req)
    } catch {
      return json({ ok: false, code: 'bad_request' }, 400)
    }
    const parsed = schema.safeParse(body)
    if (!parsed.success || !hasSelection(parsed.data.selection)) return json({ ok: false, code: 'validation' }, 400)
    const locale: Locale = isLocale(parsed.data.locale) ? parsed.data.locale : 'hy'

    const settings = await loadSettings(payload, locale)
    if (settings?.forms?.shareEnabled === false) return json({ ok: false, code: 'disabled' }, 403)

    const catalog = await loadCatalog(payload, locale, false)
    const selection = {
      packageKey: parsed.data.selection.packageKey ?? null,
      duration: parsed.data.selection.duration ?? null,
      addons: parsed.data.selection.addons ?? [],
    }
    const q = quote(catalog, selection)
    if (q.errors.length) return json({ ok: false, code: 'selection', errors: q.errors }, 409)

    const days = Number(settings?.forms?.shareExpiryDays ?? 30)
    const expiresAt = new Date(Date.now() + days * 86_400_000)
    const token = randomToken()
    const snapshot = buildSnapshot(catalog, q)
    const pkg = findPackage(catalog, q.packageKey)
    await payload.create({
      collection: 'estimates',
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        token,
        label: [pkg?.name, q.duration ? `${q.duration} mo` : null, q.addons.length ? `+${q.addons.length} add-on(s)` : null]
          .filter(Boolean)
          .join(' · '),
        locale,
        selection,
        snapshot,
        catalogVersion: catalog.version,
        expiresAt: expiresAt.toISOString(),
      },
    })
    return json({ ok: true, url: `/${locale}/estimate/${token}`, expiresAt: expiresAt.toISOString() })
  },
}
