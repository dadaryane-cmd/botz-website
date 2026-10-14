'use client'
import { useAuth } from '@payloadcms/ui'

/** Carry the list's simple "equals" filters (status, service, person, language) into the export. */
function exportUrl() {
  const params = new URLSearchParams()
  const query = decodeURIComponent(window.location.search)
  for (const field of ['status', 'service', 'assignedTo', 'locale']) {
    const m = new RegExp(`\\[${field}\\]\\[equals\\]=([^&]+)`).exec(query)
    if (m) params.set(field, m[1])
  }
  const from = /\[createdAt\]\[greater_than(?:_equal)?\]=([^&]+)/.exec(query)
  const to = /\[createdAt\]\[less_than(?:_equal)?\]=([^&]+)/.exec(query)
  if (from) params.set('from', from[1])
  if (to) params.set('to', to[1])
  return `/api/leads/export${params.size ? `?${params}` : ''}`
}

export const LeadsToolbar = () => {
  const { user } = useAuth<{ roles?: string[] }>()
  const isAdmin = user?.roles?.includes('admin')
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '0 0 16px', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--theme-elevation-600)' }}>
        Use Filters for status, service, person, language and date. WhatsApp clicks are analytics events, not leads.
      </span>
      {isAdmin && (
        <button type="button" className="btn btn--style-secondary btn--size-small" onClick={() => (window.location.href = exportUrl())}>
          Export CSV (current filters)
        </button>
      )}
    </div>
  )
}
