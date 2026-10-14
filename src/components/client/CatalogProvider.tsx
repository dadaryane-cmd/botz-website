'use client'
import { useEffect } from 'react'
import { registerCatalog } from '@/lib/client/catalogStore'
import type { Catalog } from '@/lib/pricing/types'

export function CatalogProvider({ catalog }: { catalog: Catalog }) {
  useEffect(() => {
    registerCatalog(catalog)
  }, [catalog])
  return null
}
