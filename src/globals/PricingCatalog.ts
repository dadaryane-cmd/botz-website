import type { Field, GlobalBeforeChangeHook, GlobalConfig } from 'payload'
import { APIError } from 'payload'
import { editors, staffField } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

const statusOptions = [
  { label: 'Included', value: 'included' },
  { label: 'Not included', value: 'not_included' },
  { label: 'Not specified', value: 'not_specified' },
  { label: 'Replaced by another item', value: 'replaced' },
]
const cadenceOptions = [
  { label: 'Every month', value: 'monthly' },
  { label: 'First month (setup)', value: 'first_month' },
  { label: 'Every 3 months', value: 'quarterly' },
  { label: 'One time', value: 'one_time' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Per project', value: 'per_project' },
]
const groupOptions = [
  { label: 'Scope & limits', value: 'scope' },
  { label: 'Setup', value: 'setup' },
  { label: 'Content', value: 'content' },
  { label: 'Platforms', value: 'platforms' },
  { label: 'Production', value: 'production' },
  { label: 'Advertising', value: 'ads' },
  { label: 'Reporting & reviews', value: 'reporting' },
  { label: 'Support & revisions', value: 'support' },
  { label: 'Delivery terms', value: 'delivery' },
]
const contactOptions = [
  { label: 'Mariam', value: 'mariam' },
  { label: 'Edgar', value: 'edgar' },
  { label: 'Either (shared coordination)', value: 'either' },
]
const keyField = (description: string): Field => ({
  name: 'key',
  type: 'text',
  required: true,
  admin: { width: '30%', description },
  validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9][a-z0-9-_]*$/.test(v) ? true : 'Lowercase letters, numbers, - or _'),
})
const amd = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'number',
  min: 1,
  admin: { width: '20%', description, step: 500 },
})

/** Cross-reference checks so prices, scopes and labels stay coherent before anything is published. */
const validateCatalog: GlobalBeforeChangeHook = ({ data, req }) => {
  const problems: string[] = []
  const dupes = (list: { key?: string }[] | undefined, label: string) => {
    const seen = new Set<string>()
    for (const r of list ?? []) {
      if (!r.key) continue
      if (seen.has(r.key)) problems.push(`Duplicate ${label} key "${r.key}"`)
      seen.add(r.key)
    }
    return seen
  }
  const featureKeys = dupes(data.features, 'feature')
  const pkgKeys = dupes(data.packages, 'package')
  dupes(data.addons, 'add-on')
  for (const p of data.packages ?? []) {
    if (p.inherits && !pkgKeys.has(p.inherits)) problems.push(`${p.key}: inherits unknown package "${p.inherits}"`)
    if (p.inherits === p.key) problems.push(`${p.key}: cannot inherit from itself`)
    for (const c of p.components ?? []) if (!pkgKeys.has(c.key)) problems.push(`${p.key}: unknown component "${c.key}"`)
    for (const f of p.features ?? []) {
      if (!featureKeys.has(f.featureKey)) problems.push(`${p.key}: unknown feature "${f.featureKey}"`)
      if (f.quantity != null && f.quantityMax != null && f.quantityMax < f.quantity)
        problems.push(`${p.key}/${f.featureKey}: maximum is lower than quantity`)
    }
    if (p.category === 'website') {
      if (!p.oneTimePrice) problems.push(`${p.key}: website packages need a one-time price`)
    } else if (!p.prices?.m1) {
      problems.push(`${p.key}: the 1-month price is required (it is the basis for savings)`)
    }
  }
  for (const a of data.addons ?? []) {
    if (a.relatedFeatureKey && !featureKeys.has(a.relatedFeatureKey))
      problems.push(`Add-on ${a.key}: unknown related feature "${a.relatedFeatureKey}"`)
  }
  if (problems.length) throw new APIError(`Please fix the catalog: ${problems.join(' • ')}`, 400)

  // Publishing gate: commercial terms go live together, and only after approval.
  const publishing = data._status === 'published' && !req.context?.skipApprovalGate
  if (publishing && data.approvalState !== 'approved') {
    throw new APIError(
      'Set “Approval state” to Approved before publishing. Until then, keep editing and use Preview to review the draft.',
      400,
    )
  }
  return data
}

export const PricingCatalog: GlobalConfig = {
  slug: 'pricing-catalog',
  label: 'Packages & prices',
  admin: {
    group: 'Packages & pricing',
    description:
      'All packages, prices, inclusions and add-ons are published together as one revision, so pricing, comparison, the package guide and shared estimates always agree.',
    preview: (_doc, { locale }) => `/next/preview?path=${encodeURIComponent(`/${locale}/pricing`)}`,
  },
  access: {
    // Read through the website only (server side, published revision). Never via the public API.
    read: ({ req }) => Boolean(req.user),
    update: editors,
    readVersions: editors,
  },
  versions: { drafts: true, max: 100 },
  hooks: { beforeChange: [validateCatalog], afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'approvalState',
          type: 'select',
          required: true,
          defaultValue: 'proposed',
          admin: { width: '50%', description: 'Must be Approved to publish.' },
          options: [
            { label: 'Proposed (draft for review)', value: 'proposed' },
            { label: 'In review', value: 'in_review' },
            { label: 'Approved for publishing', value: 'approved' },
          ],
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'AMD',
          options: [{ label: 'AMD (֏)', value: 'AMD' }],
          admin: { width: '50%', readOnly: true },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Packages',
          fields: [
            {
              name: 'packages',
              type: 'array',
              labels: { singular: 'Package', plural: 'Packages' },
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/admin/components/RowLabels#PackageRowLabel' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    keyField('Stable id, e.g. smm-start. Do not change after publishing.'),
                    {
                      name: 'category',
                      type: 'select',
                      required: true,
                      admin: { width: '25%' },
                      options: [
                        { label: 'SMM', value: 'smm' },
                        { label: 'SEO', value: 'seo' },
                        { label: 'SMM + SEO bundle', value: 'bundle' },
                        { label: 'Website', value: 'website' },
                      ],
                    },
                    { name: 'order', type: 'number', defaultValue: 10, admin: { width: '15%' } },
                    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { width: '15%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', localized: true, required: true, admin: { width: '40%' } },
                    { name: 'tagline', type: 'text', localized: true, admin: { width: '60%' } },
                  ],
                },
                { name: 'summary', type: 'textarea', localized: true, admin: { description: 'Short client-facing summary.' } },
                {
                  name: 'prices',
                  type: 'group',
                  label: 'Monthly price by contract length (AMD). Leave empty = unavailable.',
                  admin: { condition: (_, s) => s?.category !== 'website' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        amd('m1', '1 month'),
                        amd('m3', '3 months'),
                        amd('m6', '6 months'),
                        amd('m9', '9 months'),
                        amd('m12', '12 months'),
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'oneTimePrice',
                      type: 'number',
                      min: 1,
                      admin: { width: '33%', condition: (_, s) => s?.category === 'website', description: 'One-time fee (AMD)' },
                    },
                    { name: 'priceIsFrom', type: 'checkbox', label: '“From” price (minimum estimate)', admin: { width: '33%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'recommended', type: 'checkbox', admin: { width: '25%' } },
                    { name: 'badge', type: 'text', localized: true, admin: { width: '35%', description: 'Shown on the card, e.g. “Recommended”' } },
                    {
                      name: 'contact',
                      type: 'select',
                      options: contactOptions,
                      admin: { width: '40%', description: 'Overrides the default contact routing for this package.' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'inherits', type: 'text', admin: { width: '50%', description: 'Includes everything from this package key, e.g. smm-start' } },
                    { name: 'inheritBoundaries', type: 'checkbox', label: 'Also show the inherited delivery boundaries', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'components',
                  type: 'array',
                  label: 'Bundle components',
                  admin: { description: 'For bundles: package keys included (prices are NOT added up).', initCollapsed: true },
                  fields: [{ name: 'key', type: 'text', required: true }],
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Inclusions',
                  admin: {
                    initCollapsed: true,
                    description: 'Rows replace inherited rows with the same feature key.',
                    components: { RowLabel: '@/admin/components/RowLabels#FeatureRowLabel' },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'featureKey', type: 'text', required: true, admin: { width: '30%' } },
                        { name: 'status', type: 'select', required: true, defaultValue: 'included', options: statusOptions, admin: { width: '25%' } },
                        { name: 'quantity', type: 'number', admin: { width: '15%' } },
                        { name: 'quantityMax', type: 'number', label: 'Up to (range max)', admin: { width: '15%' } },
                        { name: 'cadence', type: 'select', options: cadenceOptions, admin: { width: '15%' } },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'unit', type: 'text', localized: true, admin: { width: '30%', description: 'Overrides the unit, optional' } },
                        { name: 'replacedBy', type: 'text', admin: { width: '30%', condition: (_, s) => s?.status === 'replaced' } },
                        { name: 'order', type: 'number', admin: { width: '20%' } },
                      ],
                    },
                    { name: 'detail', type: 'textarea', localized: true, admin: { description: 'Client-facing description of this inclusion.' } },
                    { name: 'note', type: 'text', localized: true },
                  ],
                },
                {
                  name: 'boundaries',
                  type: 'array',
                  label: 'Delivery boundaries / exclusions',
                  admin: { initCollapsed: true },
                  fields: [{ name: 'text', type: 'textarea', localized: true, required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Add-ons',
          fields: [
            {
              name: 'addons',
              type: 'array',
              admin: { initCollapsed: true, components: { RowLabel: '@/admin/components/RowLabels#PackageRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    keyField('Stable id, e.g. reel'),
                    { name: 'price', type: 'number', required: true, min: 1, admin: { width: '20%', description: 'One-time AMD' } },
                    { name: 'priceIsFrom', type: 'checkbox', label: '“From” price', admin: { width: '15%' } },
                    { name: 'units', type: 'number', admin: { width: '15%', description: 'Items in a bundle (e.g. 4)' } },
                    { name: 'order', type: 'number', defaultValue: 10, admin: { width: '10%' } },
                    { name: 'visible', type: 'checkbox', defaultValue: true, admin: { width: '10%' } },
                  ],
                },
                { name: 'name', type: 'text', localized: true, required: true },
                { name: 'description', type: 'textarea', localized: true },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'relatedFeatureKey',
                      type: 'text',
                      admin: { width: '33%', description: 'If the chosen plan already includes this feature, the estimate says so.' },
                    },
                    {
                      name: 'appliesTo',
                      type: 'select',
                      hasMany: true,
                      admin: { width: '33%' },
                      options: [
                        { label: 'SMM', value: 'smm' },
                        { label: 'SEO', value: 'seo' },
                        { label: 'Bundle', value: 'bundle' },
                        { label: 'Website', value: 'website' },
                      ],
                    },
                    { name: 'contact', type: 'select', options: contactOptions, admin: { width: '33%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Feature labels',
          description: 'One row per comparable inclusion. Labels are shared by every package.',
          fields: [
            {
              name: 'features',
              type: 'array',
              admin: { initCollapsed: true, components: { RowLabel: '@/admin/components/RowLabels#PackageRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    keyField('Stable id'),
                    { name: 'group', type: 'select', required: true, options: groupOptions, admin: { width: '25%' } },
                    { name: 'order', type: 'number', admin: { width: '15%' } },
                    { name: 'compare', type: 'checkbox', defaultValue: true, label: 'Show in comparison', admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', localized: true, required: true, admin: { width: '60%' } },
                    { name: 'unit', type: 'text', localized: true, admin: { width: '40%', description: 'e.g. “posts / month”' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Terms',
          fields: [
            {
              name: 'terms',
              type: 'array',
              label: 'Terms for every package',
              fields: [{ name: 'text', type: 'textarea', localized: true, required: true }],
            },
          ],
        },
        {
          label: 'Private review',
          description: 'Only visible in the admin. Never shown on the website.',
          fields: [
            {
              name: 'reviewChecklist',
              type: 'array',
              access: { read: staffField },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'item', type: 'textarea', required: true, admin: { width: '80%' } },
                    { name: 'done', type: 'checkbox', admin: { width: '20%' } },
                  ],
                },
              ],
            },
            { name: 'reviewNotes', type: 'textarea', access: { read: staffField } },
          ],
        },
      ],
    },
  ],
}
