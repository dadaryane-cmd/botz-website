/**
 * The visitor's chosen package, contract length and add-ons. Shared by the pricing tool,
 * the package finder and the inquiry form, and kept across pages in localStorage.
 */
import { CONTRACT_LENGTHS, DEFAULT_CONTRACT_LENGTH, MAX_ADDON_QUANTITY } from '../config.js'
import { catalog } from '../content/catalog.js'
import { load, save } from '../lib/storage.js'
import { findAddon, findPackage } from './engine.js'

const empty = () => ({ packageKey: null, months: DEFAULT_CONTRACT_LENGTH, addons: {}, note: null })

let selection = empty()
const listeners = new Set()

/** Saved selection, replaced by a shared estimate link (?pkg=…&months=…&addons=…) when present. */
export function initSelection(search = '') {
  const params = new URLSearchParams(search)
  selection =
    params.has('pkg') || params.has('addons')
      ? fromParams(params)
      : { ...empty(), ...load('selection') }
  return selection
}

export const getSelection = () => selection

export function updateSelection(changes) {
  selection = { ...selection, ...changes }
  save('selection', selection)
  listeners.forEach((listener) => listener(selection))
}

export const clearSelection = () => updateSelection(empty())

/** Call `listener` on every change while `element` is on the page. */
export function subscribe(element, listener) {
  const wrapped = (value) => (element.isConnected ? listener(value) : listeners.delete(wrapped))
  listeners.add(wrapped)
}

/* ---------- shareable links ---------- */

export function toParams(value) {
  const params = new URLSearchParams()
  if (value.packageKey) params.set('pkg', value.packageKey)
  params.set('months', value.months)
  const addons = Object.entries(value.addons ?? {}).map(([key, quantity]) => `${key}:${quantity}`)
  if (addons.length) params.set('addons', addons.join(','))
  return params
}

export function fromParams(params) {
  const pkg = findPackage(catalog, params.get('pkg'))
  const months = Number(params.get('months'))
  const addons = {}
  for (const pair of (params.get('addons') ?? '').split(',')) {
    const [key, quantity] = pair.split(':')
    if (findAddon(catalog, key) && Number(quantity) >= 1) {
      addons[key] = Math.min(MAX_ADDON_QUANTITY, Math.floor(Number(quantity)))
    }
  }
  return {
    ...empty(),
    packageKey: pkg?.key ?? null,
    months: CONTRACT_LENGTHS.includes(months) ? months : DEFAULT_CONTRACT_LENGTH,
    addons,
  }
}
