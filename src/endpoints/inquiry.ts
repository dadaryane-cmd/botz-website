import type { Endpoint, PayloadRequest } from 'payload'
import { isLocale, type Locale } from '@/i18n/config'
import { contactInfoFrom, loadSettings } from '@/lib/site'
import { fieldErrors, inquirySchema, looksLikeSpam, type InquiryInput } from '@/lib/inquiry'
import { quote } from '@/lib/pricing/engine'
import { loadCatalog } from '@/lib/pricing/fromCms'
import { buildSnapshot, hasSelection, type PriceSnapshot } from '@/lib/pricing/snapshot'
import { checkFormToken, clientIp, hashIp, issueFormToken, rateLimit } from '@/lib/security'
import { routeContacts } from '@/lib/contact'

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export const MAX_BODY = 20_000

export async function readJson(req: PayloadRequest): Promise<unknown> {
  const len = Number(req.headers.get('content-length') ?? 0)
  if (len > MAX_BODY) throw new Error('too_large')
  const text = typeof req.text === 'function' ? await req.text() : ''
  if (text.length > MAX_BODY) throw new Error('too_large')
  return text ? JSON.parse(text) : {}
}

export const smtpConfigured = () => Boolean(process.env.SMTP_HOST)

/** Where new-inquiry emails go when Site settings → Forms → Notify emails is empty. */
export const DEFAULT_NOTIFY_EMAIL = 'dadaryane@gmail.com'

export function notifyRecipients(setting?: string | null): string[] {
  const list = (value?: string | null) => (value ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const fromSettings = list(setting)
  if (fromSettings.length) return fromSettings
  const fromEnv = list(process.env.INQUIRY_NOTIFY_TO)
  return fromEnv.length ? fromEnv : [DEFAULT_NOTIFY_EMAIL]
}

function emailBody(lead: InquiryInput, snap: PriceSnapshot | null, assigned: string, adminUrl: string | null) {
  const lines = [
    `New website inquiry (${lead.locale.toUpperCase()})`,
    '',
    `Name: ${lead.name}`,
    `Email: ${lead.email || '—'}`,
    `Phone: ${lead.phone || '—'}`,
    `Service: ${lead.service}`,
    `Preferred contact: ${lead.preferredContact} → assigned: ${assigned}`,
    `Page: ${lead.source || '—'}`,
    '',
    lead.message,
  ]
  if (snap) {
    lines.push('', 'Estimate (recalculated by the server):')
    if (snap.packageName) lines.push(`Package: ${snap.packageName}${snap.duration ? `, ${snap.duration} months` : ''}`)
    if (snap.monthly) lines.push(`Monthly: AMD ${snap.monthly.toLocaleString('en-US')} · Recurring total: AMD ${snap.recurringTotal?.toLocaleString('en-US')}`)
    for (const a of snap.addons) lines.push(`Add-on: ${a.name} ×${a.qty} = AMD ${a.total.toLocaleString('en-US')}`)
    lines.push(`Combined estimate: AMD ${snap.combinedTotal.toLocaleString('en-US')}${snap.isMinimum ? ' (minimum)' : ''}`)
  }
  lines.push('', adminUrl ? `Open in admin: ${adminUrl}` : 'Note: this inquiry could not be saved to the admin panel. Reply directly from this email.')
  return lines.join('\n')
}

export const inquiryTokenEndpoint: Endpoint = {
  path: '/inquiry/token',
  method: 'get',
  handler: async () => json({ token: issueFormToken() }),
}

export const inquiryEndpoint: Endpoint = {
  path: '/inquiry',
  method: 'post',
  handler: async (req) => {
    const { payload } = req
    let body: unknown
    try {
      body = await readJson(req)
    } catch {
      return json({ ok: false, code: 'bad_request' }, 400)
    }

    const localeGuess = (body as { locale?: string })?.locale
    const locale: Locale = isLocale(localeGuess) ? localeGuess : 'hy'
    const settings = await loadSettings(payload, locale)
    const perHour = Number(settings?.forms?.rateLimitPerHour ?? 6)
    if (!rateLimit(`inq:${hashIp(clientIp(req.headers))}`, perHour, 60 * 60 * 1000)) {
      return json({ ok: false, code: 'rate_limited' }, 429)
    }

    const parsed = inquirySchema.safeParse(body)
    if (!parsed.success) return json({ ok: false, code: 'validation', fields: fieldErrors(parsed.error) }, 400)
    const input = parsed.data

    // Bots: answer like a success but store nothing.
    if (input.website) return json({ ok: true })
    const tokenState = checkFormToken(input.formToken)
    if (tokenState === 'too_fast') return json({ ok: true })
    if (tokenState !== 'ok') return json({ ok: false, code: 'token' }, 400)
    if (looksLikeSpam(input)) return json({ ok: true })

    const contacts = contactInfoFrom(settings)
    const nameFor = (key?: string | null) => contacts.people.find((p) => p.key === key)?.name

    // Idempotency: a retried submission returns the original result.
    const existing = await payload.find({
      collection: 'leads',
      where: { submissionId: { equals: input.submissionId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      return json({ ok: true, contactName: nameFor(existing.docs[0].assignedTo) ?? null, duplicate: true })
    }

    // Never trust browser amounts: recalculate against the published catalog.
    let snapshot: PriceSnapshot | null = null
    if (hasSelection(input.selection)) {
      const catalog = await loadCatalog(payload, locale, false)
      const q = quote(catalog, {
        packageKey: input.selection?.packageKey ?? null,
        duration: input.selection?.duration ?? null,
        addons: input.selection?.addons ?? [],
      })
      if (q.errors.length) return json({ ok: false, code: 'selection', errors: q.errors }, 409)
      snapshot = buildSnapshot(catalog, q)
    }

    const category = (snapshot?.category ?? input.service) as never
    let assignedTo: 'mariam' | 'edgar' | null = null
    if (input.preferredContact !== 'either') assignedTo = input.preferredContact
    else {
      const routed = routeContacts(contacts, category)
      assignedTo = routed.length === 1 ? routed[0].key : null
    }

    type Notification = { status: 'sent' | 'failed' | 'not_configured'; error?: string }
    const notify = async (leadId: number | string | null): Promise<Notification> => {
      if (!smtpConfigured()) return { status: 'not_configured' }
      try {
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
        await payload.sendEmail({
          to: notifyRecipients(settings?.forms?.notifyEmails as string | undefined),
          subject: `New inquiry: ${input.name} · ${snapshot?.packageName ?? input.service}`,
          text: emailBody(input, snapshot, nameFor(assignedTo) ?? 'unassigned', leadId == null ? null : `${base}/admin/collections/leads/${leadId}`),
          replyTo: input.email || undefined,
        })
        return { status: 'sent' }
      } catch (err) {
        payload.logger.error({ err }, 'Inquiry notification email failed')
        return { status: 'failed', error: err instanceof Error ? err.message.slice(0, 200) : 'unknown error' }
      }
    }

    let lead
    try {
      lead = await payload.create({
        collection: 'leads',
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: {
          status: 'new',
          name: input.name,
          email: input.email || undefined,
          phone: input.phone || undefined,
          service: input.service,
          message: input.message,
          preferredContact: input.preferredContact,
          assignedTo,
          locale,
          source: input.source?.slice(0, 300),
          selection: snapshot ? { selection: input.selection, snapshot } : null,
          estimateToken: input.estimateToken,
          submissionId: input.submissionId,
          notification: { status: 'pending' },
        },
      })
    } catch (err) {
      // A concurrent retry may have saved it first (unique submissionId).
      const again = await payload.find({
        collection: 'leads',
        where: { submissionId: { equals: input.submissionId } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (again.docs[0]) return json({ ok: true, contactName: nameFor(again.docs[0].assignedTo) ?? null, duplicate: true })
      payload.logger.error({ err }, 'Failed to save inquiry')
      // The message must still reach the team: if the email goes out, the visitor's inquiry is delivered.
      const emailed = await notify(null)
      if (emailed.status === 'sent') return json({ ok: true, contactName: nameFor(assignedTo) ?? null })
      return json({ ok: false, code: 'save_failed' }, 500)
    }

    // The inquiry is saved. Notification problems are recorded, never reported as delivered.
    const notification = await notify(lead.id)
    try {
      await payload.update({
        collection: 'leads',
        id: lead.id,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data: { notification: { ...notification, attemptedAt: new Date().toISOString() } },
      })
    } catch (err) {
      payload.logger.error({ err }, 'Could not record notification status')
    }

    return json({ ok: true, contactName: nameFor(assignedTo) ?? null })
  },
}
