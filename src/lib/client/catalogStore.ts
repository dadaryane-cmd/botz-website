'use client'
import { useSyncExternalStore } from 'react'
import type { Catalog } from '@/lib/pricing/types'

/**
 * The published catalog for this page, registered by the CatalogProvider so
 * site-wide widgets (mobile bar, contact form) price selections with exactly
 * the same data as the pricing section.
 */
let catalog: Catalog | null = null
const listeners = new Set<() => void>()

export function registerCatalog(c: Catalog | null) {
  if (catalog === c) return
  catalog = c
  listeners.forEach((l) => l())
}

export function useCatalogForBar(): Catalog | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => catalog,
    () => null,
  )
}
