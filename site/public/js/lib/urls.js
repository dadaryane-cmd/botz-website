/**
 * Every page has an address per language: about.html in Armenian (the default), about-en.html
 * and about-ru.html. The address decides the language, so search engines can list each one.
 * Pure, so the browser, the dev server and the publishing step follow the same rules.
 */
import { DEFAULT_LANGUAGE, LANGUAGES } from '../config.js'

const OTHER_LANGUAGES = LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE)

/** "-en.html" or "-ru.html" at the end of an address. */
const LANGUAGE_SUFFIX = new RegExp(`-(${OTHER_LANGUAGES.join('|')})\\.html$`)

/** A link to one of the site's pages: "pricing.html", "pricing.html?cat=smm", "services.html#seo". */
const PAGE_LINK = /^([a-z0-9]+(?:-[a-z0-9]+)*\.html)((?:[?#].*)?)$/

/** The language of an address: "/botz-website/about-en.html" → "en"; "/botz-website/" → "hy". */
export const languageFromPath = (pathname) =>
  String(pathname).match(LANGUAGE_SUFFIX)?.[1] ?? DEFAULT_LANGUAGE

/** The file of an address: "/botz-website/about-en.html" → "about-en.html"; a folder → index.html. */
export const fileFromPath = (pathname) => String(pathname).split('/').pop() || 'index.html'

/** A page's file in another language: ("about-en.html", "ru") → "about-ru.html". */
export function fileInLanguage(file, language) {
  const defaultFile = file.replace(LANGUAGE_SUFFIX, '.html')
  if (language === DEFAULT_LANGUAGE) return defaultFile
  return defaultFile.replace(/\.html$/, `-${language}.html`)
}

/**
 * A link to one of the site's pages, pointed at its version in `language`
 * ("pricing.html?cat=smm" → "pricing-en.html?cat=smm"). Links that already name a language, and
 * everything else (other sites, files, #anchors), stay as they are.
 */
export function localizeHref(href, language) {
  const match = String(href).match(PAGE_LINK)
  if (!match || language === DEFAULT_LANGUAGE || LANGUAGE_SUFFIX.test(match[1])) return href
  const [, file, rest] = match
  return fileInLanguage(file, language) + rest
}
