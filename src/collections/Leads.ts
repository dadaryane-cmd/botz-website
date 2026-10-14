import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { admins, leadManagers } from '@/access'
import { leadsExportEndpoint } from '@/endpoints/leadsExport'

export const leadStatuses = [
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Proposal sent', value: 'proposal_sent' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
]

export const serviceOptions = [
  { label: 'SMM', value: 'smm' },
  { label: 'SEO', value: 'seo' },
  { label: 'SMM + SEO', value: 'bundle' },
  { label: 'Website creation', value: 'website' },
  { label: 'Add-ons', value: 'addon' },
  { label: 'Not sure yet', value: 'other' },
]

const people = [
  { label: 'Mariam', value: 'mariam' },
  { label: 'Edgar', value: 'edgar' },
]

/** Record who changed status/assignment and when; stamp note authors. */
const trackActivity: CollectionBeforeChangeHook = ({ data, originalDoc, req, operation }) => {
  if (operation !== 'update' || !originalDoc) return data
  const who = (req.user as { email?: string } | null)?.email ?? 'system'
  const now = new Date().toISOString()
  const activity = Array.isArray(originalDoc.activity) ? [...originalDoc.activity] : []
  if (data.status && data.status !== originalDoc.status)
    activity.push({ at: now, by: who, change: `Status: ${originalDoc.status} → ${data.status}` })
  if (data.assignedTo !== undefined && data.assignedTo !== originalDoc.assignedTo)
    activity.push({ at: now, by: who, change: `Assigned: ${originalDoc.assignedTo ?? '—'} → ${data.assignedTo ?? '—'}` })
  if (Array.isArray(data.notes)) {
    const before = new Set((originalDoc.notes ?? []).map((n: { id?: string }) => n.id))
    data.notes = data.notes.map((n: { id?: string; author?: string; at?: string }) =>
      n.id && before.has(n.id) ? n : { ...n, author: n.author || who, at: n.at || now },
    )
    if (data.notes.length > (originalDoc.notes?.length ?? 0)) activity.push({ at: now, by: who, change: 'Note added' })
  }
  data.activity = activity
  return data
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'service', 'status', 'assignedTo', 'locale', 'createdAt'],
    listSearchableFields: ['name', 'email', 'phone', 'message'],
    description:
      'Inquiries saved from the website forms. WhatsApp and phone clicks are not leads; they appear only in analytics.',
    components: {
      beforeListTable: ['@/admin/components/LeadsToolbar#LeadsToolbar'],
    },
  },
  access: {
    // Public submissions go through /api/inquiry, which validates and saves server-side.
    create: () => false,
    read: leadManagers,
    update: leadManagers,
    delete: admins,
    readVersions: leadManagers,
  },
  versions: { maxPerDoc: 30 },
  endpoints: [leadsExportEndpoint],
  hooks: { beforeChange: [trackActivity] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', required: true, defaultValue: 'new', options: leadStatuses, index: true, admin: { width: '33%' } },
        { name: 'assignedTo', type: 'select', options: people, index: true, admin: { width: '33%' } },
        { name: 'service', type: 'select', options: serviceOptions, index: true, admin: { width: '33%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'email', type: 'email', admin: { width: '33%' } },
        { name: 'phone', type: 'text', admin: { width: '33%' } },
      ],
    },
    { name: 'message', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        {
          name: 'preferredContact',
          type: 'select',
          options: [...people, { label: 'Either', value: 'either' }],
          admin: { width: '33%' },
        },
        {
          name: 'locale',
          type: 'select',
          options: [
            { label: 'Armenian', value: 'hy' },
            { label: 'English', value: 'en' },
            { label: 'Russian', value: 'ru' },
          ],
          index: true,
          admin: { width: '33%' },
        },
        { name: 'source', type: 'text', admin: { width: '33%', readOnly: true, description: 'Page the form was sent from' } },
      ],
    },
    {
      name: 'selection',
      type: 'json',
      admin: {
        readOnly: true,
        description: 'Package, duration, add-ons and prices recalculated by the server at submission time.',
        components: { Field: '@/admin/components/SelectionSummary#SelectionSummary' },
      },
    },
    { name: 'estimateToken', type: 'text', admin: { readOnly: true } },
    {
      name: 'notes',
      type: 'array',
      label: 'Private notes',
      admin: { description: 'Visible to staff only.' },
      fields: [
        { name: 'body', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'author', type: 'text', admin: { readOnly: true, width: '50%' } },
            { name: 'at', type: 'date', admin: { readOnly: true, width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
          ],
        },
      ],
    },
    {
      name: 'activity',
      type: 'array',
      admin: { readOnly: true, initCollapsed: true },
      fields: [
        { name: 'at', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'by', type: 'text' },
        { name: 'change', type: 'text' },
      ],
    },
    {
      name: 'notification',
      type: 'group',
      admin: { position: 'sidebar', readOnly: true, description: 'Email notification to the team' },
      fields: [
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Sent', value: 'sent' },
            { label: 'Failed', value: 'failed' },
            { label: 'Email not configured', value: 'not_configured' },
          ],
        },
        { name: 'error', type: 'text' },
        { name: 'attemptedAt', type: 'date' },
      ],
    },
    {
      name: 'submissionId',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar', description: 'Prevents duplicate saves of the same submission.' },
      access: { update: () => false },
    },
  ],
  timestamps: true,
}
