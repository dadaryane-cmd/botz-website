import type { GlobalConfig } from 'payload'
import { editors } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { locales } from '@/i18n/config'

export const analyticsEvents = [
  'service_view',
  'package_view',
  'duration_change',
  'package_compare',
  'guide_complete',
  'whatsapp_click',
  'phone_click',
  'email_click',
  'inquiry_saved',
  'estimate_created',
  'language_select',
] as const

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Website', description: 'Contacts, routing, languages, search engines, analytics and estimates.' },
  access: { read: ({ req }) => Boolean(req.user), update: editors, readVersions: editors },
  versions: { max: 30 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', localized: true, required: true, defaultValue: 'BOTZ Marketing Agency' },
            {
              name: 'defaultLocale',
              type: 'select',
              required: true,
              defaultValue: 'hy',
              label: 'Language for first-time visitors',
              options: locales.map((l) => ({ label: l.toUpperCase(), value: l })),
              admin: { description: 'Used when someone opens the bare domain, and for the x-default search tag.' },
            },
          ],
        },
        {
          name: 'contacts',
          label: 'Contacts & routing',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phoneDisplay', type: 'text', required: true, defaultValue: '+374 91 003099', admin: { width: '33%' } },
                {
                  name: 'phoneE164',
                  type: 'text',
                  required: true,
                  defaultValue: '+37491003099',
                  admin: { width: '33%', description: 'International format for tel: links' },
                  validate: (v: unknown) => (typeof v === 'string' && /^\+\d{8,15}$/.test(v) ? true : 'Format like +37491003099'),
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  required: true,
                  defaultValue: '37491003099',
                  admin: { width: '33%', description: 'Digits only, used for wa.me links' },
                  validate: (v: unknown) => (typeof v === 'string' && /^\d{8,15}$/.test(v) ? true : 'Digits only, e.g. 37491003099'),
                },
              ],
            },
            { name: 'email', type: 'email', required: true, defaultValue: 'botz.marketingagency@gmail.com' },
            {
              name: 'instagramUrl',
              type: 'text',
              admin: { description: 'Leave empty to hide Instagram everywhere.' },
              validate: (v: unknown) => (!v || (typeof v === 'string' && /^https:\/\/(www\.)?instagram\.com\//.test(v)) ? true : 'Use a full https://instagram.com/… link'),
            },
            {
              name: 'people',
              type: 'array',
              label: 'Contact people',
              admin: { description: 'Names, roles and which inquiries go to whom. Empty phone/email = shared agency contacts.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Mariam', value: 'mariam' },
                        { label: 'Edgar', value: 'edgar' },
                      ],
                      admin: { width: '25%' },
                    },
                    { name: 'name', type: 'text', localized: true, required: true, admin: { width: '35%' } },
                    { name: 'role', type: 'text', localized: true, admin: { width: '40%' } },
                  ],
                },
                {
                  name: 'services',
                  type: 'select',
                  hasMany: true,
                  options: [
                    { label: 'SMM', value: 'smm' },
                    { label: 'SEO', value: 'seo' },
                    { label: 'SMM + SEO', value: 'bundle' },
                    { label: 'Website', value: 'website' },
                    { label: 'Add-ons', value: 'addon' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'phoneE164', type: 'text', admin: { width: '33%' } },
                    { name: 'whatsappNumber', type: 'text', admin: { width: '33%' } },
                    { name: 'email', type: 'email', admin: { width: '33%' } },
                  ],
                },
              ],
            },
            {
              name: 'mobileBar',
              type: 'group',
              label: 'Mobile sticky contact bar',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
                    { name: 'showCall', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
                    { name: 'showWhatsapp', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
                    { name: 'showEmail', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'forms',
          label: 'Forms & estimates',
          fields: [
            {
              name: 'notifyEmails',
              type: 'text',
              admin: { description: 'Comma-separated addresses that receive new-inquiry emails. Empty = INQUIRY_NOTIFY_TO, or dadaryane@gmail.com.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'rateLimitPerHour', type: 'number', defaultValue: 6, min: 1, max: 100, admin: { width: '33%', description: 'Per visitor' } },
                { name: 'shareEnabled', type: 'checkbox', defaultValue: true, label: 'Allow shareable estimates', admin: { width: '33%' } },
                { name: 'shareExpiryDays', type: 'number', defaultValue: 30, min: 1, max: 365, admin: { width: '33%' } },
              ],
            },
          ],
        },
        {
          name: 'seo',
          label: 'Search & social',
          fields: [
            { name: 'titleSuffix', type: 'text', localized: true, defaultValue: ' — BOTZ Marketing Agency' },
            { name: 'defaultDescription', type: 'textarea', localized: true },
            { name: 'defaultImage', type: 'upload', relationTo: 'media', admin: { description: 'Social sharing image (1200×630). Empty = built-in brand image.' } },
            {
              type: 'row',
              fields: [
                { name: 'allowIndexing', type: 'checkbox', defaultValue: true, label: 'Allow search engines to index the site', admin: { width: '50%' } },
                {
                  name: 'extraDisallow',
                  type: 'textarea',
                  admin: { width: '50%', description: 'Extra paths to block in robots.txt, one per line (e.g. /en/old-page)' },
                },
              ],
            },
            {
              name: 'organization',
              type: 'group',
              label: 'Organization structured data',
              admin: { description: 'Only truthful, visible facts. No address or ratings unless real.' },
              fields: [
                { name: 'legalName', type: 'text' },
                { name: 'areaServed', type: 'text', defaultValue: 'Armenia' },
                {
                  name: 'sameAs',
                  type: 'array',
                  label: 'Official profiles',
                  fields: [{ name: 'url', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
        {
          name: 'analytics',
          label: 'Analytics',
          description:
            'The provider and IDs are set by environment variables on the server; tracking stays off until they exist. Personal data is never sent.',
          fields: [
            { name: 'requireConsent', type: 'checkbox', defaultValue: true, label: 'Ask visitors for consent before tracking' },
            {
              name: 'events',
              type: 'select',
              hasMany: true,
              defaultValue: [...analyticsEvents],
              options: analyticsEvents.map((e) => ({ label: e, value: e })),
            },
          ],
        },
      ],
    },
  ],
}
