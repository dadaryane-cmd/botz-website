/**
 * Full addresses of the published pages, from the site's address (content/site.json → url) and
 * the route table (js/lib/urls.js): what canonical links, hreflang links, the sitemap and the
 * schema point to. `entry` is a published page: { key, page } or { post } (seo/pages.js).
 */
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../public/js/config.js'
import { pagePath, postPath } from '../../public/js/lib/urls.js'

/** The page's address in `language`, relative to the site's root ("ru/uslugi/"). */
export const entryPath = (routes, entry, language) =>
  entry.post ? postPath(routes, entry.post.slug, language) : pagePath(routes, entry.key, language)

/** A page in `language` as a full address; the Armenian home page is the site's own address. */
export const pageUrl = (siteUrl, routes, entry, language) =>
  new URL(entryPath(routes, entry, language), siteUrl).href

/** The page in every language, plus x-default (the Armenian page) for everyone else. */
export function alternates(siteUrl, routes, entry) {
  const languages = LANGUAGES.map((language) => ({
    hreflang: language,
    href: pageUrl(siteUrl, routes, entry, language),
  }))
  const fallback = pageUrl(siteUrl, routes, entry, DEFAULT_LANGUAGE)
  return [...languages, { hreflang: 'x-default', href: fallback }]
}

/** A file of the site (an image) as a full address. */
export const fileUrl = (siteUrl, path) => new URL(path, siteUrl).href

/** The text of a `{ hy, en, ru }` value in `language` (English when it is missing). */
export const inLanguage = (value, language) =>
  typeof value === 'string' ? value : (value?.[language] ?? value?.en ?? '')
