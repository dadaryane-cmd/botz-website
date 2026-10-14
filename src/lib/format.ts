import { localeTags, type Locale } from '@/i18n/config'

const nf = new Map<string, Intl.NumberFormat>()

/** "79,000 ֏" style. Uses a non-breaking space so amounts never wrap. */
export function formatAmd(value: number, locale: Locale): string {
  const tag = localeTags[locale]
  if (!nf.has(tag)) nf.set(tag, new Intl.NumberFormat(tag === 'hy-AM' ? 'en-US' : tag, { maximumFractionDigits: 0 }))
  // Armenian uses comma grouping in business documents; keep it consistent with the price list.
  return `${nf.get(tag)!.format(Math.round(value))} ֏`
}

/** Number only (for large display prices where the ֏ sign is styled separately). */
export function formatNumber(value: number, locale: Locale): string {
  return formatAmd(value, locale).replace(/ ֏$/, '')
}

export function formatDate(iso: string | Date, locale: Locale): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return new Intl.DateTimeFormat(localeTags[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Yerevan' }).format(d)
}
