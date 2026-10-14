import type { CollectionConfig } from 'payload'
import { admins, editors, staff } from '@/access'
import { shareEstimateEndpoint } from '@/endpoints/estimates'

/**
 * Shareable, read-only price estimates. They hold no personal data:
 * only the selection and a dated price snapshot calculated on the server.
 */
export const Estimates: CollectionConfig = {
  slug: 'estimates',
  admin: {
    group: 'Leads',
    useAsTitle: 'label',
    defaultColumns: ['label', 'createdAt', 'expiresAt', 'revoked', 'views'],
    description: 'Links created with “Share estimate”. Revoke a link or shorten its expiry here.',
  },
  endpoints: [shareEstimateEndpoint],
  access: {
    create: () => false,
    read: staff,
    update: editors,
    delete: admins,
  },
  fields: [
    { name: 'label', type: 'text', admin: { readOnly: true } },
    { name: 'token', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'expiresAt', type: 'date', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'revoked', type: 'checkbox', admin: { width: '50%' } },
      ],
    },
    { name: 'locale', type: 'text', admin: { readOnly: true } },
    { name: 'selection', type: 'json', required: true, admin: { readOnly: true } },
    { name: 'snapshot', type: 'json', required: true, admin: { readOnly: true, description: 'Prices at the time the link was created.' } },
    { name: 'catalogVersion', type: 'text', admin: { readOnly: true } },
    { name: 'views', type: 'number', defaultValue: 0, admin: { readOnly: true } },
  ],
}
