import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { editors, publishedOrStaff } from '@/access'
import { allBlocks } from '@/blocks/config'
import { slugField } from '@/fields/shared'
import { revalidateAfterDelete, revalidateCollection } from '@/hooks/revalidate'
import { locales } from '@/i18n/config'

export const previewPath = (locale: string, slug?: string | null) => `/${locale}${slug ? `/${slug}` : ''}`

/** When a published page changes its address, keep the old address working with a redirect. */
const redirectOldSlug: CollectionAfterChangeHook = async ({ doc, previousDoc, req, operation }) => {
  if (operation !== 'update' || doc._status !== 'published' || previousDoc?._status !== 'published') return doc
  const locale = req.locale
  if (!locale || locale === 'all') return doc
  const before = previousDoc?.slug ?? ''
  const after = doc.slug ?? ''
  if (before === after) return doc
  const from = previewPath(locale, before)
  const to = previewPath(locale, after)
  const existing = await req.payload.find({
    collection: 'redirects',
    where: { from: { equals: from } },
    limit: 1,
    depth: 0,
    req,
  })
  const data = { from, to: { type: 'custom' as const, url: to } }
  if (existing.docs[0]) await req.payload.update({ collection: 'redirects', id: existing.docs[0].id, data, req })
  else await req.payload.create({ collection: 'redirects', data, req })
  // Remove a redirect that would now loop back to this live page.
  await req.payload.delete({ collection: 'redirects', where: { from: { equals: to } }, req })
  return doc
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Every public page. Build pages from sections; save as draft, preview, then publish.',
    preview: (doc, { locale }) => `/next/preview?path=${encodeURIComponent(previewPath(locale, doc?.slug as string))}`,
    livePreview: {
      url: ({ data, locale }) => `/next/preview?path=${encodeURIComponent(previewPath(locale.code, data?.slug))}`,
    },
  },
  access: {
    read: publishedOrStaff,
    create: editors,
    update: editors,
    delete: editors,
    readVersions: editors,
  },
  versions: {
    drafts: { autosave: { interval: 1500 }, schedulePublish: false },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [redirectOldSlug, revalidateCollection],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    slugField({
      validate: async (value: unknown, { req, id }: { req: any; id?: string | number }) => {
        if (value === undefined || value === null || value === '') return true
        if (typeof value !== 'string' || !/^[\p{Ll}\p{N}]+(-[\p{Ll}\p{N}]+)*(\/[\p{Ll}\p{N}]+(-[\p{Ll}\p{N}]+)*)*$/u.test(value))
          return 'Use lowercase letters, numbers and single hyphens.'
        if (['next', 'api', 'admin', 'estimate', 'work', 'blog'].includes(value.split('/')[0]))
          return 'This address is reserved by the website.'
        const clash = await req.payload.find({
          collection: 'pages',
          where: { and: [{ slug: { equals: value } }, ...(id ? [{ id: { not_equals: id } }] : [])] },
          locale: req.locale,
          draft: true,
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        return clash.docs.length ? 'Another page already uses this address in this language.' : true
      },
    }),
    {
      name: 'enabledLocales',
      type: 'select',
      hasMany: true,
      label: 'Published languages',
      defaultValue: [...locales],
      options: locales.map((l) => ({ label: l.toUpperCase(), value: l })),
      admin: {
        position: 'sidebar',
        description:
          'Untick a language until its translation is ready. That language then shows a “not available yet” link instead of a missing page.',
      },
    },
    {
      name: 'pageType',
      type: 'select',
      defaultValue: 'standard',
      admin: { position: 'sidebar', description: 'Used for structured data and mobile contact routing.' },
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Home', value: 'home' },
        { label: 'Service: SMM', value: 'smm' },
        { label: 'Service: SEO', value: 'seo' },
        { label: 'Service: Website creation', value: 'website' },
        { label: 'Services overview', value: 'services' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'About', value: 'about' },
        { label: 'Contact', value: 'contact' },
      ],
    },
    {
      name: 'seedKey',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: allBlocks,
              admin: { initCollapsed: true },
            },
          ],
        },
      ],
    },
  ],
}
