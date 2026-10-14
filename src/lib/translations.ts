import type { Payload } from 'payload'
import { uiStringGlobals } from '@/globals/UiStrings'
import { locales } from '@/i18n/config'

export type MissingTranslation = { where: string; editUrl: string; path: string; missing: string[] }

const isLocaleMap = (v: unknown): v is Record<string, unknown> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  const keys = Object.keys(v)
  return keys.length > 0 && keys.every((k) => (locales as readonly string[]).includes(k))
}

const hasContent = (v: unknown): boolean => {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim().length > 0
  if (typeof v === 'number' || typeof v === 'boolean') return true
  if (Array.isArray(v)) return v.some(hasContent)
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if (typeof o.text === 'string') return o.text.trim().length > 0
    return Object.values(o).some(hasContent)
  }
  return false
}

/** Walk a document read with `locale: 'all'` and list localized values that are filled in some languages but not others. */
export function findMissing(doc: unknown, path: string[] = [], out: { path: string; missing: string[] }[] = []) {
  if (isLocaleMap(doc)) {
    const filled = locales.filter((l) => hasContent(doc[l]))
    if (filled.length && filled.length < locales.length) {
      out.push({ path: path.join(' › '), missing: locales.filter((l) => !filled.includes(l)) })
    }
    return out
  }
  if (Array.isArray(doc)) {
    doc.forEach((item, i) => {
      const label = item && typeof item === 'object' ? ((item as Record<string, unknown>).blockType ?? (item as Record<string, unknown>).key ?? i + 1) : i + 1
      findMissing(item, [...path, String(label)], out)
    })
    return out
  }
  if (doc && typeof doc === 'object') {
    for (const [k, v] of Object.entries(doc)) {
      if (['id', 'createdAt', 'updatedAt', '_status', 'blockName', 'globalType'].includes(k)) continue
      findMissing(v, [...path, k], out)
    }
  }
  return out
}

/** Interface-text fields that are empty in a language (the site falls back to built-in text, but editors should know). */
function emptyUiStrings(doc: Record<string, unknown>) {
  const out: { path: string; missing: string[] }[] = []
  for (const [group, strings] of Object.entries(doc)) {
    if (!strings || typeof strings !== 'object' || ['id', 'createdAt', 'updatedAt', 'globalType'].includes(group)) continue
    for (const [key, v] of Object.entries(strings as Record<string, unknown>)) {
      if (!isLocaleMap(v) && v !== null && v !== undefined) continue
      const map = (v ?? {}) as Record<string, unknown>
      const missing = locales.filter((l) => !hasContent(map[l]))
      if (missing.length) out.push({ path: `${group} › ${key}`, missing })
    }
  }
  return out
}

export async function translationReport(payload: Payload): Promise<MissingTranslation[]> {
  const report: MissingTranslation[] = []
  for (const collection of ['pages', 'posts', 'case-studies', 'testimonials', 'media'] as const) {
    const res = await payload.find({ collection, locale: 'all', draft: true, depth: 0, pagination: false, overrideAccess: true })
    for (const doc of res.docs as Record<string, any>[]) {
      const title = typeof doc.title === 'object' ? (doc.title?.en ?? doc.title?.hy ?? doc.id) : (doc.title ?? doc.filename ?? doc.author ?? doc.id)
      for (const m of findMissing(doc)) {
        report.push({ where: `${collection}: ${title}`, editUrl: `/admin/collections/${collection}/${doc.id}`, ...m })
      }
    }
  }
  for (const slug of ['pricing-catalog', 'package-guide', 'site-settings', 'navigation', 'theme'] as const) {
    const doc = await payload.findGlobal({ slug, locale: 'all', draft: true, depth: 0, overrideAccess: true })
    for (const m of findMissing(doc)) report.push({ where: `settings: ${slug}`, editUrl: `/admin/globals/${slug}`, ...m })
  }
  for (const g of uiStringGlobals) {
    const ui = await payload.findGlobal({ slug: g.slug, locale: 'all', depth: 0, overrideAccess: true })
    for (const m of emptyUiStrings(ui as unknown as Record<string, unknown>)) report.push({ where: g.label, editUrl: `/admin/globals/${g.slug}`, ...m })
  }
  return report
}
