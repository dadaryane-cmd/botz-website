'use client'
import { useSyncExternalStore } from 'react'
import type { Category, Selection } from '@/lib/pricing/types'

/**
 * Shared, temporary state for the visitor's estimate: written by the pricing
 * explorer and guide, read by the contact form, WhatsApp links and the mobile
 * contact bar. Kept in sessionStorage only (this tab), never sent anywhere
 * unless the visitor submits the form or creates a share link.
 */
export type SelectionState = Selection & { category?: Category | null; estimateToken?: string | null }

const KEY = 'botz:selection'
let state: SelectionState = {}
let loaded = false
const listeners = new Set<() => void>()

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (raw) state = JSON.parse(raw)
  } catch {
    // storage unavailable — keep in memory
  }
}

export function getSelection(): SelectionState {
  load()
  return state
}

export function setSelection(next: SelectionState | ((s: SelectionState) => SelectionState)) {
  load()
  state = typeof next === 'function' ? next(state) : next
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

export const clearSelection = () => setSelection({})

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const empty: SelectionState = {}

export function useSelection(): SelectionState {
  return useSyncExternalStore(subscribe, getSelection, () => empty)
}

/** The page's service context (e.g. SMM page) for contact routing when nothing is selected. */
let pageCategory: Category | null = null
const pageListeners = new Set<() => void>()
export const getPageCategory = () => pageCategory
export function setPageCategory(c: Category | null) {
  pageCategory = c
  pageListeners.forEach((l) => l())
}
export function usePageCategory() {
  return useSyncExternalStore(
    (l) => {
      pageListeners.add(l)
      return () => pageListeners.delete(l)
    },
    () => pageCategory,
    () => null,
  )
}
