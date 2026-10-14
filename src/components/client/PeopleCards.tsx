'use client'
import type { Locale } from '@/i18n/config'
import { useCatalogForBar } from '@/lib/client/catalogStore'
import { usePageCategory, useSelection } from '@/lib/client/selection'
import { routeContacts, telLink, type ContactInfo } from '@/lib/contact'
import { findPackage } from '@/lib/pricing/engine'
import type { Strings } from '@/lib/site'
import { whatsappHref, whatsappMessage } from '@/lib/whatsapp'
import { Icon } from '../ui'

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m)

/** Mariam / Edgar cards. The person matching the current service or selected package is highlighted. */
export function PeopleCards({
  contacts,
  locale,
  strings,
  defaultService,
}: {
  contacts: ContactInfo
  locale: Locale
  strings: Pick<Strings, 'contact' | 'whatsapp' | 'pricing' | 'services'>
  defaultService?: string | null
}) {
  const selection = useSelection()
  const pageCategory = usePageCategory()
  const catalog = useCatalogForBar()
  const pkg = catalog && selection.packageKey ? findPackage(catalog, selection.packageKey) : undefined
  const category = (pkg?.category ?? defaultService ?? pageCategory ?? null) as never
  const routed = category ? routeContacts(contacts, category, pkg?.contact ?? null) : []
  const s = strings.contact

  return (
    <div className="people">
      {contacts.people.map((p) => {
        const msg = whatsappMessage({
          strings: { whatsapp: strings.whatsapp, pricing: strings.pricing, services: strings.services },
          locale,
          contactName: p.name,
          service: category,
          catalog,
          selection,
        })
        const isRouted = routed.length > 0 && routed.length < contacts.people.length && routed.some((r) => r.key === p.key)
        const services = p.services.filter((x) => x !== 'addon').map((x) => strings.services[x as keyof Strings['services']]).join(', ')
        return (
          <article key={p.key} className={`person${isRouted ? ' is-routed' : ''}`}>
            <h3>{p.name}</h3>
            {p.role && <p className="role">{p.role}</p>}
            {services && <p className="small muted" style={{ margin: 0 }}>{fill(s.handles, { services })}</p>}
            <div className="person-actions">
              <a className={`btn btn-sm${isRouted ? '' : ' btn-secondary'}`} href={whatsappHref(p.whatsappNumber, msg)} target="_blank" rel="noopener noreferrer" data-contact={p.key}>
                {Icon.whatsapp} {fill(s.contactPerson, { name: p.name })}
              </a>
              <a className="btn btn-sm btn-secondary" href={telLink(p.phoneE164)} data-contact={p.key}>
                {Icon.phone} {s.call}
              </a>
            </div>
          </article>
        )
      })}
      <p className="small muted" style={{ margin: 0 }}>
        {s.sharedLine} {s.eitherContact}
      </p>
    </div>
  )
}
