import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const CMS_TAG = 'cms'

/**
 * Expire cached public data after an edit is saved. Drafts never reach the
 * public cache (public reads use `draft: false`), but expiring on every save
 * is cheap and keeps autosave previews simple. Outside a Next.js request
 * (seed scripts, tests) revalidation is unavailable and silently skipped.
 */
async function expire(context: Record<string, unknown> | undefined) {
  if (context?.disableRevalidate) return
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag(CMS_TAG, { expire: 0 })
  } catch {
    // Not running inside Next.js – nothing to revalidate.
  }
}

export const revalidateCollection: CollectionAfterChangeHook = async ({ doc, req }) => {
  await expire(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await expire(req.context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await expire(req.context)
  return doc
}
