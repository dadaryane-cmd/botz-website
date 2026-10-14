import type { Category, ContactKey } from './pricing/types'

export type Person = {
  key: ContactKey
  name: string
  role?: string | null
  services: string[]
  phoneE164: string
  whatsappNumber: string
  email: string
}

export type ContactInfo = {
  phoneDisplay: string
  phoneE164: string
  whatsappNumber: string
  email: string
  instagramUrl?: string | null
  people: Person[]
}

/**
 * Who handles a service. A package-level contact overrides the default.
 * Combined plans (or "either") return every person who handles any part,
 * so the visitor can choose; coordination is shared.
 */
export function routeContacts(info: ContactInfo, category?: Category | 'other' | null, override?: ContactKey | 'either' | null): Person[] {
  if (override && override !== 'either') {
    const p = info.people.find((x) => x.key === override)
    if (p) return [p]
  }
  if (!category || category === 'other' || override === 'either') return info.people
  const matches = info.people.filter((p) => p.services.includes(category))
  return matches.length ? matches : info.people
}

export const whatsappLink = (number: string, text?: string) =>
  `https://wa.me/${number.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const telLink = (e164: string) => `tel:${e164.replace(/[^+\d]/g, '')}`
