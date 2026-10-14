import type { CollectionConfig, Payload } from 'payload'
import { APIError } from 'payload'
import { editors, staffField } from '@/access'
import { revalidateAfterDelete, revalidateCollection } from '@/hooks/revalidate'

/** Field names that hold uploads anywhere in content or settings. Keep in sync when adding upload fields. */
const uploadKeys = new Set(['media', 'cover', 'previewVideo', 'photo', 'image', 'logoLight', 'logoDark', 'mark', 'favicon', 'defaultImage'])

/** Walk a document (depth 0) and report every upload field that points at this file. */
function scan(value: unknown, id: string, path: string[], hits: string[]) {
  if (Array.isArray(value)) value.forEach((v, i) => scan(v, id, [...path, String((v as { blockType?: string })?.blockType ?? i + 1)], hits))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (uploadKeys.has(k) && v !== null && v !== undefined && String(typeof v === 'object' ? (v as { id?: unknown }).id : v) === id)
        hits.push([...path, k].join(' › '))
      else if (v && typeof v === 'object') scan(v, id, [...path, k], hits)
    }
  }
}

/**
 * Where a media file is used (latest drafts included). Scans documents
 * directly because block queries cannot match the same field name in
 * several block types.
 */
export async function findMediaUsage(payload: Payload, id: string | number) {
  const target = String(id)
  const hits: string[] = []
  for (const collection of ['pages', 'posts', 'case-studies', 'testimonials'] as const) {
    const res = await payload.find({ collection, draft: true, depth: 0, pagination: false, overrideAccess: true, locale: 'all' })
    for (const doc of res.docs as Record<string, any>[]) {
      const found: string[] = []
      scan(doc, target, [], found)
      const title = typeof doc.title === 'object' ? (doc.title?.en ?? doc.title?.hy ?? doc.id) : (doc.title ?? doc.author ?? doc.id)
      if (found.length) hits.push(`${collection}: ${title}`)
    }
  }
  for (const slug of ['theme', 'site-settings'] as const) {
    const g = await payload.findGlobal({ slug, depth: 0, draft: true, overrideAccess: true })
    const found: string[] = []
    scan(g, target, [], found)
    for (const p of found) hits.push(`Settings: ${slug} → ${p}`)
  }
  return Array.from(new Set(hits))
}

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'category', 'updatedAt'],
    description: 'Images and videos. Files in use cannot be deleted until they are replaced everywhere.',
  },
  folders: true,
  access: {
    read: () => true,
    create: editors,
    update: editors,
    delete: editors,
  },
  upload: {
    // SVG is excluded on purpose: uploaded SVGs can carry scripts.
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm', 'image/x-icon', 'image/vnd.microsoft.icon'],
    focalPoint: true,
    crop: true,
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'wide', width: 1920 },
    ],
    adminThumbnail: 'thumb',
  },
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        const usage = await findMediaUsage(req.payload, id)
        if (usage.length) {
          throw new APIError(`This file is still used in: ${usage.join('; ')}. Replace it there first.`, 409)
        }
      },
    ],
    afterRead: [
      async ({ doc, req, findMany }) => {
        // Only compute usage on the edit screen to keep lists fast.
        if (!findMany && req.user && doc?.id) {
          const usage = await findMediaUsage(req.payload, doc.id)
          doc.usage = usage.length ? usage.join('\n') : 'Not used anywhere'
        }
        return doc
      },
    ],
    afterChange: [revalidateCollection],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Describe the image for screen readers and search engines (in each language).' },
    },
    { name: 'caption', type: 'text', localized: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Brand', value: 'brand' },
        { label: 'Website imagery', value: 'site' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Blog', value: 'blog' },
        { label: 'People', value: 'people' },
      ],
    },
    {
      name: 'usage',
      type: 'textarea',
      virtual: true,
      access: { read: staffField },
      admin: { readOnly: true, description: 'Where this file is used (calculated).' },
    },
  ],
}
