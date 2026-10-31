import { DEFAULT_LANGUAGE, LANGUAGES } from '../config.js'
import { ui as strings } from '../content/index.js'
import { load, save } from './storage.js'

let current = DEFAULT_LANGUAGE
const listeners = new Set()

export const getLanguage = () => current

/**
 * The language to open in: one asked for in the link (?lang=), then the visitor's saved choice,
 * then the first of the browser's preferred languages the site has ("ru-RU" → "ru"), then the
 * default.
 */
export function pickLanguage({ fromUrl, saved, browser = [] }) {
  if (LANGUAGES.includes(fromUrl)) return fromUrl
  if (LANGUAGES.includes(saved)) return saved
  const preferred = browser
    .map((tag) => String(tag).toLowerCase().split('-')[0])
    .find((code) => LANGUAGES.includes(code))
  return preferred ?? DEFAULT_LANGUAGE
}

/** Set the starting language; a language asked for in the link is remembered as a choice. */
export function initLanguage(search = '', browser = []) {
  const fromUrl = new URLSearchParams(search).get('lang')
  current = pickLanguage({ fromUrl, saved: load('lang'), browser })
  if (current === fromUrl) save('lang', current)
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

/** Interface text from content/ui.json, e.g. `ui('pricing', 'totalFor', { n: 6 })`. */
export const ui = (group, key, vars) => interpolate(t(strings[group]?.[key]) || key, vars)
