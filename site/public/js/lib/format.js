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

const DATE_LOCALES = { en: 'en-GB', ru: 'ru-RU' }

/**
 * Armenian month names (genitive, as in dates). Written out because browsers such as Chrome have
 * no Armenian date format built in and fall back to English.
 */
const ARMENIAN_MONTHS = [
  'հունվարի',
  'փետրվարի',
  'մարտի',
  'ապրիլի',
  'մայիսի',
  'հունիսի',
  'հուլիսի',
  'օգոստոսի',
  'սեպտեմբերի',
  'հոկտեմբերի',
  'նոյեմբերի',
  'դեկտեմբերի',
]

/** "2 November 2026" for "2026-11-02", in the page's language (read as a calendar day, no time zone). */
export function formatDate(isoDate, language = getLanguage()) {
  const date = new Date(`${isoDate}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return isoDate
  if (language === 'hy') {
    const month = ARMENIAN_MONTHS[date.getUTCMonth()]
    return `${date.getUTCDate()} ${month}, ${date.getUTCFullYear()} թ.`
  }
  return new Intl.DateTimeFormat(DATE_LOCALES[language] ?? 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
