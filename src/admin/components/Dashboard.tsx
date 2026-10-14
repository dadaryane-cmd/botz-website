import Link from 'next/link'
import type { Payload } from 'payload'
import { hasRole } from '@/access'

const card: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 12,
  padding: '16px 18px',
  background: 'var(--theme-elevation-0)',
}
const statuses = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['proposal_sent', 'Proposal sent'],
  ['won', 'Won'],
  ['lost', 'Lost'],
] as const

export async function Dashboard({ payload, user }: { payload: Payload; user?: unknown }) {
  const canLeads = hasRole(user as never, 'admin', 'sales')
  const canEdit = hasRole(user as never, 'admin', 'editor')

  const counts = canLeads
    ? await Promise.all(
        statuses.map(async ([value]) => {
          const r = await payload.count({ collection: 'leads', where: { status: { equals: value } }, overrideAccess: true })
          return r.totalDocs
        }),
      )
    : []
  const failed = canLeads
    ? (await payload.count({ collection: 'leads', where: { 'notification.status': { equals: 'failed' } }, overrideAccess: true })).totalDocs
    : 0

  let catalogState: { approval: string; hasDraft: boolean; published: boolean } | null = null
  if (canEdit) {
    const draft = (await payload.findGlobal({ slug: 'pricing-catalog', draft: true, depth: 0, overrideAccess: true })) as {
      approvalState?: string
      _status?: string
    }
    const published = (await payload.findGlobal({ slug: 'pricing-catalog', draft: false, depth: 0, overrideAccess: true })) as {
      _status?: string
      updatedAt?: string
    }
    catalogState = {
      approval: draft.approvalState ?? 'proposed',
      hasDraft: draft._status === 'draft',
      published: published._status === 'published',
    }
  }

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ margin: '0 0 12px' }}>BOTZ overview</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {canLeads && (
          <div style={card}>
            <strong>Leads</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
              {statuses.map(([value, label], i) => (
                <li key={value} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <Link href={`/admin/collections/leads?where[status][equals]=${value}`}>{label}</Link>
                  <span>{counts[i]}</span>
                </li>
              ))}
            </ul>
            {failed > 0 && (
              <p style={{ color: 'var(--theme-error-500)', margin: '8px 0 0' }}>
                {failed} inquiry notification(s) failed to email — the inquiries are saved; check them in Leads.
              </p>
            )}
          </div>
        )}
        {catalogState && (
          <div style={card}>
            <strong>Packages & prices</strong>
            <p style={{ margin: '8px 0' }}>
              Draft approval: <b>{catalogState.approval.replace('_', ' ')}</b>
              <br />
              {catalogState.hasDraft ? 'Unpublished changes are waiting for review.' : 'No unpublished changes.'}
            </p>
            <Link href="/admin/globals/pricing-catalog">Review packages →</Link>
          </div>
        )}
        <div style={card}>
          <strong>Help</strong>
          <p style={{ margin: '8px 0' }}>How to edit, preview, publish and restore — in plain language.</p>
          <Link href="/admin/help">Editing guide →</Link>
          <br />
          <Link href="/admin/translations">Missing translations →</Link>
        </div>
      </div>
    </section>
  )
}
