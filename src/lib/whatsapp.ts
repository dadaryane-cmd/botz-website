import type { Locale } from '@/i18n/config'
import { whatsappLink } from './contact'
import { formatAmd } from './format'
import { findAddon, findPackage, quote } from './pricing/engine'
import type { Catalog, Selection } from './pricing/types'

type WaStrings = {
  whatsapp: { greeting: string; interest: string; package: string; addons: string; estimate: string; closing: string }
  pricing: { month1: string; monthsN: string }
  services: Record<string, string>
}

const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m))

/**
 * Build a localized, prefilled WhatsApp message: contact, service, package,
 * duration, add-ons and the estimate total. Amounts come from the same
 * pricing engine as the page; the link is URL-encoded by whatsappLink().
 */
export function whatsappMessage(args: {
  strings: WaStrings
  locale: Locale
  contactName: string
  service?: string | null
  catalog?: Catalog | null
  selection?: Selection | null
}): string {
  const { strings: s, locale, contactName, service, catalog, selection } = args
  const parts = [fill(s.whatsapp.greeting, { contact: contactName })]
  const pkg = catalog && selection?.packageKey ? findPackage(catalog, selection.packageKey) : undefined
  const serviceKey = pkg?.category ?? service
  if (serviceKey && s.services[serviceKey]) parts.push(fill(s.whatsapp.interest, { service: s.services[serviceKey] }))
  if (catalog && selection && (selection.packageKey || selection.addons?.length)) {
    const q = quote(catalog, selection)
    if (pkg && !q.errors.some((e) => 'key' in e && e.key === pkg.key)) {
      const duration = q.duration ? (q.duration === 1 ? s.pricing.month1 : fill(s.pricing.monthsN, { n: q.duration })) : ''
      parts.push(fill(s.whatsapp.package, { package: pkg.name, duration }).replace(/,\s*\./, '.').replace(/,\s*։/, '։'))
    }
    if (q.addons.length) {
      const list = q.addons.map((a) => `${findAddon(catalog, a.key)?.name ?? a.key}${a.qty > 1 ? ` ×${a.qty}` : ''}`).join(', ')
      parts.push(fill(s.whatsapp.addons, { addons: list }))
    }
    if (q.combinedTotal > 0) parts.push(fill(s.whatsapp.estimate, { total: `${q.isMinimum ? '≥ ' : ''}${formatAmd(q.combinedTotal, locale)}` }))
  }
  parts.push(s.whatsapp.closing)
  return parts.join(' ')
}

export const whatsappHref = (number: string, message: string) => whatsappLink(number, message)
