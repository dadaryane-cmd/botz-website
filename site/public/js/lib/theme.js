import { load, save } from './storage.js'

/**
 * Light/dark theme. An explicit choice is stored and set as <html data-theme>;
 * without one the system setting applies. theme-init.js applies the saved choice before first paint.
 */
const root = document.documentElement
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set()

export const getTheme = () => root.dataset.theme ?? (systemDark.matches ? 'dark' : 'light')

export function setTheme(theme) {
  root.dataset.theme = theme
  save('theme', theme)
  listeners.forEach((listener) => listener(theme))
}

export function onThemeChange(listener) {
  listeners.add(listener)
  systemDark.addEventListener('change', () => load('theme') ?? listener(getTheme()))
}
