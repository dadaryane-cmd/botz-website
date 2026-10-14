import type { Endpoint, Where } from 'payload'
import { hasRole } from '@/access'

/** Spreadsheet-safe CSV cell: quotes, and neutralises formula injection. */
export function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return `"${s.replace(/"/g, '""')}"`
}

export const leadsExportEndpoint: Endpoint = {
  path: '/export',
  method: 'get',
  handler: async (req) => {
    if (!hasRole(req.user as never, 'admin')) return Response.json({ error: 'Forbidden' }, { status: 403 })
    const q = req.searchParams
    const and: Where[] = []
    for (const f of ['status', 'service', 'assignedTo', 'locale']) {
      const v = q.get(f)
      if (v) and.push({ [f]: { equals: v } })
    }
    if (q.get('from')) and.push({ createdAt: { greater_than_equal: q.get('from') } })
    if (q.get('to')) and.push({ createdAt: { less_than_equal: q.get('to') } })

    const res = await req.payload.find({
      collection: 'leads',
      where: and.length ? { and } : undefined,
      sort: '-createdAt',
      pagination: false,
      depth: 0,
      user: req.user,
      overrideAccess: false,
    })
    const header = ['createdAt', 'status', 'assignedTo', 'service', 'name', 'email', 'phone', 'preferredContact', 'locale', 'package', 'duration', 'monthly', 'combinedTotal', 'source', 'message', 'notes']
    const rows = res.docs.map((d: any) => {
      const snap = d.selection?.snapshot ?? {}
      return [
        d.createdAt,
        d.status,
        d.assignedTo,
        d.service,
        d.name,
        d.email,
        d.phone,
        d.preferredContact,
        d.locale,
        snap.packageName,
        snap.duration,
        snap.monthly,
        snap.combinedTotal,
        d.source,
        d.message,
        (d.notes ?? []).map((n: any) => `${n.at ?? ''} ${n.author ?? ''}: ${n.body}`).join(' | '),
      ]
        .map(csvCell)
        .join(',')
    })
    const csv = '﻿' + [header.map(csvCell).join(','), ...rows].join('\r\n')
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="botz-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  },
}
