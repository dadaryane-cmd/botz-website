import type { Field, GroupField, TextField } from 'payload'

/** Lowercase URL-safe slug segments separated by "/". Empty means the locale home page. */
export const slugPattern = /^([a-z0-9ա-ևа-яё]+(-[a-z0-9ա-ևа-яё]+)*)(\/[a-z0-9ա-ևа-яё]+(-[a-z0-9ա-ևа-яё]+)*)*$/

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ա-ևа-яё\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const slugField = (overrides: Record<string, unknown> = {}): TextField =>
  ({
  name: 'slug',
  type: 'text',
  localized: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Address of this page after the language, e.g. "seo" → /en/seo. Leave empty only for the home page. Lowercase letters, numbers and hyphens.',
  },
  validate: (value: unknown) => {
    if (value === undefined || value === null || value === '') return true
    if (typeof value !== 'string' || !slugPattern.test(value))
      return 'Use lowercase letters, numbers and single hyphens (segments may be separated by "/").'
    return true
  },
  hooks: {
    beforeValidate: [({ value }) => (typeof value === 'string' ? value.replace(/^\/+|\/+$/g, '') : value)],
  },
  ...overrides,
  }) as TextField

const hex = /^#([0-9a-fA-F]{6})$/
export const colorField = (name: string, label: string, defaultValue: string, description?: string): TextField => ({
  name,
  label,
  type: 'text',
  required: true,
  defaultValue,
  admin: { description: description ?? 'Hex colour, e.g. #FF4F0F', width: '33%' },
  validate: (v: unknown) => (typeof v === 'string' && hex.test(v) ? true : 'Enter a 6-digit hex colour like #FF4F0F'),
})

/** A flexible link: internal page, a path on this site, an external URL, or a section anchor. */
export const linkFields = (opts: { required?: boolean } = {}): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        localized: true,
        required: opts.required ?? true,
        admin: { width: '40%' },
      },
      {
        name: 'type',
        type: 'select',
        defaultValue: 'page',
        admin: { width: '30%' },
        options: [
          { label: 'Page on this site', value: 'page' },
          { label: 'Path / anchor', value: 'path' },
          { label: 'External URL', value: 'url' },
          { label: 'Contact person (WhatsApp)', value: 'contact' },
        ],
      },
      {
        name: 'appearance',
        type: 'select',
        defaultValue: 'primary',
        admin: { width: '30%' },
        options: [
          { label: 'Primary button', value: 'primary' },
          { label: 'Secondary button', value: 'secondary' },
          { label: 'Text link', value: 'link' },
        ],
      },
    ],
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    admin: { condition: (_, s) => s?.type === 'page' },
  },
  {
    name: 'path',
    type: 'text',
    admin: {
      condition: (_, s) => s?.type === 'path',
      description: 'Path without language, e.g. "/pricing#compare" or "#contact".',
    },
  },
  {
    name: 'url',
    type: 'text',
    admin: { condition: (_, s) => s?.type === 'url' },
    validate: (v: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
      siblingData?.type !== 'url' || (typeof v === 'string' && /^(https?:\/\/|mailto:|tel:)/.test(v))
        ? true
        : 'Start with https://, mailto: or tel:',
  },
  {
    name: 'contact',
    type: 'select',
    options: [
      { label: 'Mariam', value: 'mariam' },
      { label: 'Edgar', value: 'edgar' },
    ],
    admin: { condition: (_, s) => s?.type === 'contact' },
  },
  {
    name: 'newTab',
    type: 'checkbox',
    admin: { condition: (_, s) => s?.type === 'url' },
  },
]

export const blockSettings: GroupField = {
  name: 'settings',
  type: 'group',
  label: 'Section layout',
  admin: { description: 'Spacing, background and alignment for this section.' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'default',
          admin: { width: '25%' },
          options: [
            { label: 'Page background', value: 'default' },
            { label: 'Soft surface', value: 'surface' },
            { label: 'Inverse (dark on light theme)', value: 'inverse' },
            { label: 'Brand orange', value: 'accent' },
          ],
        },
        {
          name: 'align',
          type: 'select',
          defaultValue: 'start',
          admin: { width: '25%' },
          options: [
            { label: 'Left', value: 'start' },
            { label: 'Centre', value: 'center' },
          ],
        },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'normal',
          admin: { width: '25%' },
          options: [
            { label: 'Narrow', value: 'narrow' },
            { label: 'Normal', value: 'normal' },
            { label: 'Wide', value: 'wide' },
          ],
        },
        {
          name: 'anchor',
          type: 'text',
          admin: { width: '25%', description: 'Optional id for #links, e.g. "contact"' },
          validate: (v: unknown) =>
            !v || (typeof v === 'string' && /^[a-z][a-z0-9-]*$/.test(v)) ? true : 'Lowercase letters, numbers, hyphens',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'paddingTop',
          type: 'select',
          defaultValue: 'md',
          admin: { width: '25%' },
          options: ['none', 'sm', 'md', 'lg', 'xl'].map((v) => ({ label: v.toUpperCase(), value: v })),
        },
        {
          name: 'paddingBottom',
          type: 'select',
          defaultValue: 'md',
          admin: { width: '25%' },
          options: ['none', 'sm', 'md', 'lg', 'xl'].map((v) => ({ label: v.toUpperCase(), value: v })),
        },
        {
          name: 'hidden',
          type: 'checkbox',
          label: 'Hide this section',
          admin: { width: '25%' },
        },
      ],
    },
  ],
}
