import type { GlobalConfig } from 'payload'
import { editors } from '@/access'
import { linkFields } from '@/fields/shared'
import { revalidateGlobal } from '@/hooks/revalidate'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus & footer',
  admin: {
    group: 'Website',
    description: 'Header menu, header button and footer. Links to Work or Blog stay hidden until those sections have published content.',
  },
  access: { read: ({ req }) => Boolean(req.user), update: editors, readVersions: editors },
  versions: { max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: 'Header menu',
      maxRows: 8,
      fields: linkFields(),
    },
    { name: 'headerCta', type: 'group', label: 'Header button', fields: linkFields({ required: false }) },
    { name: 'footerStatement', type: 'textarea', localized: true, admin: { description: 'Large line in the footer. *Asterisks* = orange.' } },
    {
      name: 'footerColumns',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'links', type: 'array', fields: linkFields() },
      ],
    },
    { name: 'footerNote', type: 'text', localized: true },
  ],
}
