import type { Payload } from 'payload'
import type { Locale } from '@/i18n/config'
import { uiStringGlobals } from '@/globals/UiStrings'
import { uiDefaults } from '@/i18n/ui-defaults'
import type { ContactInfo, Person } from './contact'

type Raw = Record<string, any>

export async function loadSettings(payload: Payload, locale: Locale) {
  return (await payload.findGlobal({
    slug: 'site-settings',
    locale,
    fallbackLocale: false,
    depth: 1,
    overrideAccess: true,
  })) as Raw
}

export function contactInfoFrom(settings: Raw): ContactInfo {
  const c = settings?.contacts ?? {}
  const shared = {
    phoneE164: c.phoneE164 ?? '+37491003099',
    whatsappNumber: c.whatsappNumber ?? '37491003099',
    email: c.email ?? 'botz.marketingagency@gmail.com',
  }
  const people: Person[] = (c.people ?? []).map((p: Raw) => ({
    key: p.key,
    name: p.name ?? (p.key === 'mariam' ? 'Mariam' : 'Edgar'),
    role: p.role ?? null,
    services: p.services ?? [],
    phoneE164: p.phoneE164 || shared.phoneE164,
    whatsappNumber: p.whatsappNumber || shared.whatsappNumber,
    email: p.email || shared.email,
  }))
  return {
    phoneDisplay: c.phoneDisplay ?? '+374 91 003099',
    ...shared,
    instagramUrl: c.instagramUrl || null,
    people,
  }
}

export type Strings = { [G in keyof typeof uiDefaults]: { [K in keyof (typeof uiDefaults)[G]]: string } }

/** Interface text for a locale: CMS value, or the built-in default when a value is empty. */
export async function loadStrings(payload: Payload, locale: Locale): Promise<Strings> {
  const parts = await Promise.all(
    uiStringGlobals.map((g) =>
      payload.findGlobal({ slug: g.slug, locale, fallbackLocale: false, depth: 0, overrideAccess: true }) as Promise<Raw>,
    ),
  )
  return mergeStrings(Object.assign({}, ...parts), locale)
}

export function mergeStrings(raw: Raw | null | undefined, locale: Locale): Strings {
  const out: Raw = {}
  for (const [group, strings] of Object.entries(uiDefaults)) {
    out[group] = {}
    for (const [key, def] of Object.entries(strings)) {
      const v = raw?.[group]?.[key]
      out[group][key] = typeof v === 'string' && v.trim() ? v : (def as Record<Locale, string>)[locale]
    }
  }
  return out as Strings
}

/** Replace {placeholders}. */
export const fill = (template: string, vars: Record<string, string | number> = {}) =>
  template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
