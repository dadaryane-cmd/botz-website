import type { GlobalConfig } from 'payload'
import { editors } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const PackageGuide: GlobalConfig = {
  slug: 'package-guide',
  label: 'Find-my-package guide',
  admin: {
    group: 'Packages & pricing',
    description:
      'Questions and transparent scoring rules. Every matching rule adds its points to a package and its reason is shown to the visitor. Prices come from the published catalog.',
  },
  access: { read: ({ req }) => Boolean(req.user), update: editors, readVersions: editors },
  versions: { drafts: true, max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'questions',
      type: 'array',
      minRows: 1,
      admin: { components: { RowLabel: '@/admin/components/RowLabels#PackageRowLabel' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'key', type: 'text', required: true, admin: { width: '30%' } },
            {
              name: 'role',
              type: 'select',
              defaultValue: 'normal',
              admin: { width: '30%', description: 'Budget/term questions also filter prices.' },
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Monthly budget', value: 'budget' },
                { label: 'Preferred term', value: 'duration' },
              ],
            },
          ],
        },
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'help', type: 'text', localized: true },
        {
          name: 'options',
          type: 'array',
          minRows: 2,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', required: true, admin: { width: '25%' } },
                { name: 'label', type: 'text', localized: true, required: true, admin: { width: '45%' } },
                { name: 'budgetMax', type: 'number', admin: { width: '15%', description: 'AMD/month (budget)' } },
                { name: 'months', type: 'number', admin: { width: '15%', description: 'Term (duration)' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'rules',
      type: 'array',
      admin: { components: { RowLabel: '@/admin/components/RowLabels#PackageRowLabel' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'key', type: 'text', required: true, admin: { width: '30%', description: 'Internal name' } },
            { name: 'packageKey', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'points', type: 'number', required: true, defaultValue: 1, admin: { width: '30%' } },
          ],
        },
        {
          name: 'when',
          type: 'array',
          label: 'All of these answers',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'question', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'values', type: 'text', hasMany: true, required: true, admin: { width: '60%', description: 'Any of these option values' } },
              ],
            },
          ],
        },
        { name: 'reason', type: 'text', localized: true, required: true, admin: { description: 'Shown to the visitor when this rule applies.' } },
      ],
    },
  ],
}
