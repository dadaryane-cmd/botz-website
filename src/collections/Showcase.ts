import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { editors, publishedOrStaff } from '@/access'
import { slugField } from '@/fields/shared'
import { revalidateAfterDelete, revalidateCollection } from '@/hooks/revalidate'

const services = [
  { label: 'SMM', value: 'smm' },
  { label: 'SEO', value: 'seo' },
  { label: 'Website creation', value: 'website' },
]

/** Real client work only: publishing requires a recorded permission. */
const requirePermission: CollectionBeforeValidateHook = ({ data }) => {
  if (data?._status === 'published' && !data?.permissionConfirmed) {
    throw new APIError('Publishing requires confirmation that the client gave permission to display this work.', 400)
  }
  return data
}

const permissionFields = [
  {
    name: 'permissionConfirmed',
    type: 'checkbox' as const,
    label: 'Client permission to display this is confirmed',
    admin: { position: 'sidebar' as const },
  },
  {
    name: 'permissionNote',
    type: 'textarea' as const,
    label: 'Permission record (private)',
    admin: { position: 'sidebar' as const, description: 'Who approved, when and how. Not shown publicly.' },
  },
]

const versions = { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 }
const hooks = {
  beforeValidate: [requirePermission],
  afterChange: [revalidateCollection],
  afterDelete: [revalidateAfterDelete],
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case study', plural: 'Portfolio & case studies' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', '_status', 'updatedAt'],
    description: 'Hidden on the website until at least one case study is published.',
    preview: (doc, { locale }) => `/next/preview?path=${encodeURIComponent(`/${locale}/work/${doc?.slug ?? ''}`)}`,
  },
  access: { read: publishedOrStaff, create: editors, update: editors, delete: editors, readVersions: editors },
  versions,
  hooks,
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField({ required: true }),
    { name: 'client', type: 'text', required: true },
    ...permissionFields,
    { name: 'services', type: 'select', hasMany: true, options: services },
    { name: 'summary', type: 'textarea', localized: true, admin: { description: 'One or two sentences for cards.' } },
    { name: 'cover', type: 'upload', relationTo: 'media', required: true },
    { name: 'previewVideo', type: 'upload', relationTo: 'media', admin: { description: 'Optional short muted clip shown on hover/touch.' } },
    { name: 'challenge', type: 'richText', localized: true },
    { name: 'work', label: 'Work performed', type: 'richText', localized: true },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'media', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', localized: true },
      ],
    },
    {
      name: 'results',
      type: 'array',
      label: 'Verified results',
      admin: { description: 'Only verified results. Each needs a timeframe and context.' },
      fields: [
        { name: 'metric', type: 'text', localized: true, required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'timeframe', type: 'text', localized: true, required: true },
        { name: 'context', type: 'textarea', localized: true, required: true },
        { name: 'verified', type: 'checkbox', required: true, label: 'I have verified this result with source data' },
      ],
      validate: (rows: unknown) =>
        !Array.isArray(rows) || rows.every((r) => (r as { verified?: boolean }).verified)
          ? true
          : 'Only verified results can be saved.',
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Content',
    useAsTitle: 'author',
    defaultColumns: ['author', 'company', '_status'],
    description: 'Real client testimonials only. Hidden on the website until one is published.',
  },
  access: { read: publishedOrStaff, create: editors, update: editors, delete: editors, readVersions: editors },
  versions,
  hooks,
  fields: [
    { name: 'quote', type: 'textarea', localized: true, required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'role', type: 'text', localized: true },
    { name: 'company', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'source', type: 'text', admin: { description: 'Where/when the testimonial was given (private).' } },
    ...permissionFields,
  ],
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Blog post', plural: 'Blog' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status'],
    description: 'The blog is hidden until at least one post is published.',
    preview: (doc, { locale }) => `/next/preview?path=${encodeURIComponent(`/${locale}/blog/${doc?.slug ?? ''}`)}`,
  },
  access: { read: publishedOrStaff, create: editors, update: editors, delete: editors, readVersions: editors },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 30 },
  hooks: { afterChange: [revalidateCollection], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField({ required: true }),
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'author', type: 'text' },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
  ],
}
