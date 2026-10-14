export const locales = ['hy', 'en', 'ru'] as const
export type Locale = (typeof locales)[number]

/** Storage default for Payload. The public initial language is editable in Site settings. */
export const defaultLocale: Locale = 'hy'

export const localeLabels: Record<Locale, string> = {
  hy: 'Հայերեն',
  en: 'English',
  ru: 'Русский',
}

export const localeShort: Record<Locale, string> = { hy: 'ՀԱՅ', en: 'EN', ru: 'РУ' }

/** BCP 47 tags used for hreflang, Intl formatting and <html lang>. */
export const localeTags: Record<Locale, string> = { hy: 'hy-AM', en: 'en', ru: 'ru' }

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** A string or a per-locale map of strings, as used in seed data and code defaults. */
export type L10n = Record<Locale, string>
