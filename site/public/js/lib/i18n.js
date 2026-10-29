import { DEFAULT_LANGUAGE, LANGUAGES } from '../config.js'
import { ui as strings } from '../content/index.js'
import { load, save } from './storage.js'

let current = DEFAULT_LANGUAGE
const listeners = new Set()

export const getLanguage = () => current

/** Language from ?lang=, then the saved choice, then the default. */
export function initLanguage(search = '') {
  const fromUrl = new URLSearchParams(search).get('lang')
  if (LANGUAGES.includes(fromUrl)) {
    current = fromUrl
    save('lang', current)
    return current
  }
  const saved = load('lang')
  current = LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE
  return current
}

export function setLanguage(language) {
  if (!LANGUAGES.includes(language) || language === current) return
  current = language
  save('lang', current)
  listeners.forEach((listener) => listener(current))
}

export function onLanguageChange(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
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

/** Interface text from content/ui.js, e.g. `ui('pricing', 'totalFor', { n: 6 })`. */
export const ui = (group, key, vars) => interpolate(t(strings[group]?.[key]) || key, vars)
