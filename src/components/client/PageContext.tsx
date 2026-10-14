'use client'
import { useEffect } from 'react'
import { setPageCategory } from '@/lib/client/selection'
import type { Category } from '@/lib/pricing/types'
import { track } from '@/lib/client/analytics'

/** Tells site-wide widgets which service this page is about (for contact routing) and records a service view. */
export function PageContext({ category, locale }: { category: Category | null; locale: string }) {
  useEffect(() => {
    setPageCategory(category)
    if (category) track('service_view', { service: category, locale }, { oncePerPage: true })
    return () => setPageCategory(null)
  }, [category, locale])
  return null
}
