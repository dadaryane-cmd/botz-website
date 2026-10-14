import type { Locale } from '@/i18n/config'

type Json = unknown

export const isL10n = (v: unknown): v is Record<Locale, string> =>
  Boolean(v) &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  Object.keys(v as object).length === 3 &&
  ['en', 'hy', 'ru'].every((k) => typeof (v as Record<string, unknown>)[k] === 'string')

/** Replace every {en,hy,ru} object with the string for one locale. */
export function pick<T = Json>(data: Json, locale: Locale): T {
  if (isL10n(data)) return data[locale] as T
  if (Array.isArray(data)) return data.map((d) => pick(d, locale)) as T
  if (data && typeof data === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(data)) if (v !== undefined) out[k] = pick(v, locale)
    return out as T
  }
  return data as T
}

/**
 * Copy row ids from a saved document into data for another locale, so
 * Payload updates the same array/block rows instead of replacing them.
 */
export function withIds(saved: Json, data: Json): Json {
  if (Array.isArray(data) && Array.isArray(saved)) {
    return data.map((row, i) => withIds(saved[i], row))
  }
  // Array rows and blocks carry string ids; documents use numeric ids.
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const out: Record<string, unknown> = { ...(data as Record<string, unknown>) }
    const s = (saved && typeof saved === 'object' ? saved : {}) as Record<string, unknown>
    if (typeof s.id === 'string' && out.id === undefined) out.id = s.id
    for (const [k, v] of Object.entries(out)) {
      if (k === 'id') continue
      if (v && typeof v === 'object') out[k] = withIds(s[k], v)
    }
    return out
  }
  return data
}

