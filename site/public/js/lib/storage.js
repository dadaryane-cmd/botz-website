import { STORAGE_PREFIX } from '../config.js'

/**
 * JSON wrapper around localStorage. Storage can be unavailable (private mode,
 * blocked site data, Node in tests), so every call falls back quietly.
 */

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    // Not persisted; the site still works for this visit.
  }
}
