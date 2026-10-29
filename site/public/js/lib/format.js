import { getLanguage, ui } from './i18n.js'

/** `79,000 ֏` — with a non-breaking space so amounts never wrap. */
export function formatAmd(amount, language = getLanguage()) {
  const locale = language === 'ru' ? 'ru-RU' : 'en-US'
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
    Math.round(amount),
  )
  return `${number} ֏`
}

export const formatMonths = (months) =>
  months === 1 ? ui('pricing', 'month1') : ui('pricing', 'monthsN', { n: months })
