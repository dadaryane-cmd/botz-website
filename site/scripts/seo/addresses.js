/**
 * Full addresses of the published pages, from the site's address (content/site.json → url):
 * what canonical links, hreflang links, the sitemap and the schema point to.
 */
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../public/js/config.js'
import { fileInLanguage } from '../../public/js/lib/urls.js'

/** A page in `language`; the Armenian home page is the site's own address (no index.html). */
export function pageUrl(siteUrl, file, language) {
  const localFile = fileInLanguage(file, language)
  if (localFile === 'index.html') return siteUrl
  return new URL(localFile, siteUrl).href
}

/** The page in every language, plus x-default (the Armenian page) for everyone else. */
export function alternates(siteUrl, file) {
  const languages = LANGUAGES.map((language) => ({
    hreflang: language,
    href: pageUrl(siteUrl, file, language),
  }))
  return [...languages, { hreflang: 'x-default', href: pageUrl(siteUrl, file, DEFAULT_LANGUAGE) }]
}

/** A file of the site (an image) as a full address. */
export const fileUrl = (siteUrl, path) => new URL(path, siteUrl).href

/** The text of a `{ hy, en, ru }` value in `language` (English when it is missing). */
export const inLanguage = (value, language) =>
  typeof value === 'string' ? value : (value?.[language] ?? value?.en ?? '')
