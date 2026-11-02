/**
 * The tags search engines and link previews read in a page's <head>: title, description,
 * canonical address, the page in the other languages (hreflang), Open Graph and the schema.org
 * description (JSON-LD). Written into every published page by scripts/build-site.js, between
 * the page's seo:start and seo:end markers.
 */

const START = '<!-- seo:start'
const END = '<!-- seo:end -->'

/** Open Graph locales (language_TERRITORY). */
const LOCALES = { hy: 'hy_AM', en: 'en_US', ru: 'ru_RU' }

/** Text for HTML: `&`, `<`, `>` and `"` written as entities. */
export const escapeHtml = (text) =>
  String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

/** JSON for a <script> element: "<" escaped, so no text can close the element. */
export const scriptJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')

const meta = (attribute, name, content) =>
  `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`

/** The meta tag name each search engine's site verification uses. */
const VERIFICATION_TAGS = {
  google: 'google-site-verification',
  yandex: 'yandex-verification',
  bing: 'msvalidate.01',
}

/** The verification tags for the codes that are set ({ google, yandex, bing }). */
export const verificationTags = (codes = {}) =>
  Object.entries(VERIFICATION_TAGS)
    .filter(([engine]) => codes[engine])
    .map(([engine, name]) => meta('name', name, codes[engine]))

/**
 * The tags for one page in one language.
 * `page`: { language, title (the full tab title), heading (without the agency name),
 * description, url, alternates [{ hreflang, href }], image, siteName, type ('website' or
 * 'article'), published (articles), schema, verification ({ google, yandex, bing } codes) }.
 */
export function seoTags(page) {
  const otherLocales = Object.entries(LOCALES).filter(([language]) => language !== page.language)
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    meta('name', 'description', page.description),
    // On every page: each language's folder can be verified on its own (Search Console, Yandex).
    ...verificationTags(page.verification),
    `<link rel="canonical" href="${escapeHtml(page.url)}" />`,
    ...page.alternates.map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" />`,
    ),
    meta('property', 'og:type', page.type),
    meta('property', 'og:site_name', page.siteName),
    meta('property', 'og:title', page.heading),
    meta('property', 'og:description', page.description),
    meta('property', 'og:url', page.url),
    meta('property', 'og:image', page.image),
    meta('property', 'og:locale', LOCALES[page.language]),
    ...otherLocales.map(([, locale]) => meta('property', 'og:locale:alternate', locale)),
    page.published && meta('property', 'article:published_time', page.published),
    meta('name', 'twitter:card', 'summary_large_image'),
    `<script type="application/ld+json">${scriptJson(page.schema)}</script>`,
  ].filter(Boolean)
}

/** The page with its search-engine tags and language: the block between the markers replaced. */
export function withSeoTags(html, page) {
  const start = html.indexOf(START)
  const end = html.indexOf(END)
  if (start === -1 || end === -1) throw new Error(`no ${START} … ${END} block`)
  const block = [`${START} (written when publishing) -->`, ...seoTags(page), END].join('\n    ')
  return (html.slice(0, start) + block + html.slice(end + END.length)).replace(
    /<html lang="[a-z]+"/,
    `<html lang="${page.language}"`,
  )
}
