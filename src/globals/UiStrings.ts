import type { Field, GlobalConfig } from 'payload'
import { editors } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { uiDefaults, type UiGroup } from '@/i18n/ui-defaults'

const groupLabels: Record<UiGroup, string> = {
  common: 'General',
  services: 'Service names',
  contact: 'Contact',
  pricing: 'Pricing',
  compare: 'Comparison',
  guide: 'Package guide',
  form: 'Contact form & errors',
  estimate: 'Shared estimates',
  footer: 'Footer',
  consent: 'Analytics consent',
  errors: 'Error pages',
  work: 'Portfolio',
  blog: 'Blog',
  whatsapp: 'WhatsApp message',
  trust: 'Trust, offer & extras',
}

/**
 * Interface text is split over three globals: SQLite limits how many
 * localized columns one table can hold, and smaller screens are easier to edit.
 */
export const uiStringGlobals: { slug: 'ui-general' | 'ui-pricing' | 'ui-forms' | 'ui-trust'; label: string; groups: UiGroup[] }[] = [
  {
    slug: 'ui-general',
    label: 'Interface text: general',
    groups: ['common', 'services', 'contact', 'estimate', 'footer', 'consent', 'errors', 'work', 'blog', 'whatsapp'],
  },
  { slug: 'ui-pricing', label: 'Interface text: pricing', groups: ['pricing', 'compare'] },
  { slug: 'ui-forms', label: 'Interface text: forms & guide', groups: ['form', 'guide'] },
  { slug: 'ui-trust', label: 'Interface text: trust & offer', groups: ['trust'] },
]

const tabsFor = (groups: UiGroup[]): Field[] => [
  {
    type: 'tabs',
    tabs: groups.map((group) => ({
      name: group,
      label: groupLabels[group],
      fields: Object.entries(uiDefaults[group]).map(
        ([key, def]): Field => ({
          name: key,
          type: 'text',
          localized: true,
          admin: {
            description: `English default: ${def.en}${def.en.includes('{') ? '  — keep {placeholders} unchanged.' : ''}`,
          },
        }),
      ),
    })),
  },
]

export const UiStringsGlobals: GlobalConfig[] = uiStringGlobals.map(({ slug, label, groups }) => ({
  slug,
  label,
  admin: {
    group: 'Website',
    description: 'Buttons, labels, form messages and other small texts, in every language.',
  },
  access: { read: ({ req }) => Boolean(req.user), update: editors, readVersions: editors },
  versions: { max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: tabsFor(groups),
}))
