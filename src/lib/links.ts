import type { Locale } from '@/i18n/config'
import type { ContactInfo } from './contact'
import { whatsappLink } from './contact'

export type CmsLink = {
  label?: string | null
  type?: 'page' | 'path' | 'url' | 'contact' | null
  appearance?: 'primary' | 'secondary' | 'link' | null
  page?: { slug?: string | null } | number | string | null
  path?: string | null
  url?: string | null
  contact?: 'mariam' | 'edgar' | null
  newTab?: boolean | null
}

/** Paths that only exist when published content exists. */
export const collectionPaths = { work: '/work', blog: '/blog' }

export function localizedPath(locale: Locale, path: string) {
  if (!path || path === '/') return `/${locale}`
  if (path.startsWith('#')) return path
  if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

export function resolveHref(link: CmsLink | null | undefined, locale: Locale, contacts?: ContactInfo): string | null {
  if (!link) return null
  switch (link.type) {
    case 'page': {
      const slug = link.page && typeof link.page === 'object' ? (link.page.slug ?? '') : null
      return slug === null ? null : localizedPath(locale, slug ? `/${slug}` : '/')
    }
    case 'path':
      return link.path ? localizedPath(locale, link.path) : null
    case 'url':
      return link.url || null
    case 'contact': {
      const p = contacts?.people.find((x) => x.key === link.contact)
      return p ? whatsappLink(p.whatsappNumber) : contacts ? whatsappLink(contacts.whatsappNumber) : null
    }
    default:
      return link.path ? localizedPath(locale, link.path) : null
  }
}

/** Hide links to Work/Blog until they have published content. */
export function linkVisible(link: CmsLink, has: { work: boolean; blog: boolean }) {
  if (link.type !== 'path' || !link.path) return true
  const p = link.path.replace(/\/$/, '')
  if (p === collectionPaths.work) return has.work
  if (p === collectionPaths.blog) return has.blog
  return true
}
