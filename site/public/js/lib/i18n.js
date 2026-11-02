import { DEFAULT_LANGUAGE, LANGUAGES } from '../config.js'
import { ui as strings } from '../content/index.js'
import { save } from './storage.js'
import { languageOfPath } from './urls.js'

let current = DEFAULT_LANGUAGE

export const getLanguage = () => current

/**
 * The page's language comes from its address relative to the site's root: "ru/uslugi/" is
 * Russian, "mer-masin/" Armenian (js/lib/urls.js). head.js has already sent a visitor who chose
 * another language to that language's address.
 */
export function initLanguage(sitePath) {
  current = languageOfPath(sitePath)
  return current
}

/**
 * Remember a language the visitor picked with the language switch: Armenian addresses then
 * open in it on later visits (head.js).
 */
export function rememberLanguage(language) {
  if (LANGUAGES.includes(language)) save('lang', language)
}

/** Pick the current language from a `{ en, hy, ru }` value (plain strings pass through). */
export function t(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return value[current] ?? value.en ?? ''
}

/** Whether a `{ en, hy, ru }` value has text in the current language. */
export const hasText = (value) => t(value).trim() !== ''

/** Replace `{name}` placeholders. Unknown names are left as they are. */
export const interpolate = (template, vars = {}) =>
  String(template).replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match))

/** Interface text from content/ui.json, e.g. `ui('pricing', 'totalFor', { n: 6 })`. */
export const ui = (group, key, vars) => interpolate(t(strings[group]?.[key]) || key, vars)

/**
 * The same interface text in every language, as `{ hy, en, ru }`, for text that must survive a
 * language change (a message prefilled in the contact form). Placeholder values may be
 * `{ hy, en, ru }` too.
 */
export function uiInEveryLanguage(group, key, vars = {}) {
  const entries = LANGUAGES.map((language) => {
    const localVars = Object.fromEntries(
      Object.entries(vars).map(([name, value]) => [name, inLanguage(value, language)]),
    )
    return [language, interpolate(inLanguage(strings[group]?.[key], language) || key, localVars)]
  })
  return Object.fromEntries(entries)
}

const inLanguage = (value, language) =>
  value && typeof value === 'object' ? (value[language] ?? value.en ?? '') : (value ?? '')
