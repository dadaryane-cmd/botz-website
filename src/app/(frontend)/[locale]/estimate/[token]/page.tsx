import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { PackageScope } from '@/components/pricing/PackageScope'
import { isLocale, type Locale } from '@/i18n/config'
import { routeContacts, telLink } from '@/lib/contact'
import { getCatalog, getSite, payloadClient } from '@/lib/data'
import { formatAmd, formatDate } from '@/lib/format'
import { findPackage } from '@/lib/pricing/engine'
import { durationLabel } from '@/lib/pricing/present'
import { snapshotChanged, type PriceSnapshot } from '@/lib/pricing/snapshot'
import type { Selection } from '@/lib/pricing/types'
import { whatsappHref, whatsappMessage } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

// Shared estimates are private-by-link: never indexed, never cached by search engines.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const title = isLocale(locale) ? (await getSite(locale)).strings.estimate.pageTitle : 'Estimate'
  return { title: `${title} — BOTZ`, robots: { index: false, follow: false, nocache: true } }
}

const isExpired = (iso: string) => new Date(iso).getTime() < Date.now()

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m)

export default async function EstimatePage({ params }: { params: Promise<{ locale: string; token: string }> }) {
  const { locale: raw, token } = await params
  if (!isLocale(raw) || !/^[A-Za-z0-9_-]{20,100}$/.test(token)) notFound()
  const locale: Locale = raw
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'estimates', where: { token: { equals: token } }, limit: 1, depth: 0, overrideAccess: true })
  const est = res.docs[0] as Record<string, any> | undefined
  if (!est) notFound()

  const [site, catalog] = await Promise.all([getSite(locale), getCatalog(locale)])
  const s = site.strings
  const alternates = { hy: null, en: null, ru: null }
  const header = <SiteHeader site={site} locale={locale} alternates={{ ...alternates, [locale]: `/${locale}/estimate/${token}` }} currentPath="" />

  const expired = isExpired(est.expiresAt)
  if (est.revoked || expired) {
    return (
      <>
        {header}
        <main id="main" className="section pt-xl pb-xl">
          <div className="container w-narrow">
            <h1 className="display h2">{est.revoked ? s.estimate.revoked : s.estimate.expired}</h1>
            <div className="btn-row">
              <Link className="btn" href={`/${locale}/pricing`}>
                {s.estimate.startNew}
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  await payload.update({ collection: 'estimates', id: est.id, data: { views: (est.views ?? 0) + 1 }, overrideAccess: true, context: { disableRevalidate: true } })

  const snap = est.snapshot as PriceSnapshot
  const selection = est.selection as Selection
  const changed = snapshotChanged(catalog, selection, snap)
  const pkg = selection.packageKey ? findPackage(catalog, selection.packageKey) : undefined
  const amd = (n: number) => formatAmd(n, locale)
  const recalc = `/${locale}/pricing?${new URLSearchParams({
    ...(selection.packageKey ? { pkg: selection.packageKey } : {}),
    ...(selection.duration ? { d: String(selection.duration) } : {}),
    ...(selection.addons?.length ? { addons: selection.addons.map((a) => `${a.key}:${a.qty}`).join(',') } : {}),
  })}#pricing`
  const routed = routeContacts(site.contacts, (snap.category ?? null) as never, pkg?.contact ?? null)
  const person = routed.length === 1 ? routed[0] : null
  const wa = whatsappHref(
    person?.whatsappNumber ?? site.contacts.whatsappNumber,
    whatsappMessage({
      strings: { whatsapp: s.whatsapp, pricing: s.pricing, services: s.services },
      locale,
      contactName: person?.name ?? routed.map((p) => p.name).join(' / '),
      service: snap.category,
      catalog: changed ? null : catalog,
      selection,
    }),
  )

  return (
    <>
      {header}
      <main id="main" className="section pt-lg pb-xl">
        <div className="container w-narrow">
          <h1 className="display h2">{snap.packageName ?? s.pricing.addonsTitle}</h1>
          <p className="muted">
            {fill(s.estimate.createdOn, { date: formatDate(snap.calculatedAt, locale) })} · {fill(s.estimate.validUntil, { date: formatDate(est.expiresAt, locale) })}
          </p>
          {changed && (
            <div className="notice" role="status" style={{ margin: '20px 0' }}>
              {fill(s.estimate.pricesChanged, { date: formatDate(snap.calculatedAt, locale) })}{' '}
              <Link href={recalc}>{s.estimate.recalc}</Link>
            </div>
          )}
          <div className="estimate" style={{ marginTop: 24 }}>
            <div>
              <table className="est-table">
                <tbody>
                  {snap.monthly != null && (
                    <>
                      <tr className="est-section">
                        <th colSpan={2}>{s.pricing.recurringFees}</th>
                      </tr>
                      <tr>
                        <th scope="row">
                          {snap.packageName}
                          <br />
                          <span className="muted small">
                            {amd(snap.monthly)} {s.pricing.perMonth} × {snap.duration} ({durationLabel(s.pricing, snap.duration ?? 1)})
                          </span>
                        </th>
                        <td>{amd(snap.recurringTotal ?? 0)}</td>
                      </tr>
                      {(snap.savings ?? 0) > 0 && (
                        <tr>
                          <th scope="row" className="muted">
                            {fill(s.pricing.youSave, { amount: '' }).trim()}
                          </th>
                          <td className="price-save">{amd(snap.savings ?? 0)}</td>
                        </tr>
                      )}
                    </>
                  )}
                  {(snap.oneTimePackage || snap.addons.length > 0) && (
                    <tr className="est-section">
                      <th colSpan={2}>{s.pricing.oneTimeFees}</th>
                    </tr>
                  )}
                  {snap.oneTimePackage && (
                    <tr>
                      <th scope="row">{snap.packageName}</th>
                      <td>{amd(snap.oneTimePackage)}</td>
                    </tr>
                  )}
                  {snap.addons.map((a) => (
                    <tr key={a.key}>
                      <th scope="row">
                        {a.name} {a.qty > 1 ? `× ${a.qty}` : ''}
                      </th>
                      <td>
                        {a.priceIsFrom ? `${s.pricing.from} ` : ''}
                        {amd(a.total)}
                      </td>
                    </tr>
                  ))}
                  <tr className="est-total">
                    <th scope="row">{s.pricing.combinedEstimate}</th>
                    <td>
                      {snap.isMinimum ? `${s.pricing.from} ` : ''}
                      {amd(snap.combinedTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="est-actions">
              <a className="btn" href={wa} target="_blank" rel="noopener noreferrer" data-contact={person?.key ?? 'either'}>
                {person ? fill(s.contact.contactPerson, { name: person.name }) : s.pricing.discussWhatsapp}
              </a>
              <a className="btn btn-secondary" href={telLink(person?.phoneE164 ?? site.contacts.phoneE164)}>
                {s.contact.call} · {site.contacts.phoneDisplay}
              </a>
              <Link className="btn btn-secondary" href={recalc}>
                {changed ? s.estimate.recalc : s.estimate.startNew}
              </Link>
              {snap.isMinimum && <p className="est-note">{s.pricing.minimumNote}</p>}
              <p className="est-note">{s.pricing.notContract}</p>
            </div>
          </div>
          {pkg && !changed && (
            <section className="section pt-md" aria-label={s.pricing.showDetails}>
              <PackageScope catalog={catalog} pkgKey={pkg.key} s={s.pricing} />
            </section>
          )}
        </div>
      </main>
    </>
  )
}
