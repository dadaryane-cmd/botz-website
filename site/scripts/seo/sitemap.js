/**
 * sitemap.xml (every page and article, in every language, with its other languages) and
 * robots.txt, written into the published site by scripts/build-site.js.
 */
import { LANGUAGES } from '../../public/js/config.js'
import { alternates, pageUrl } from './addresses.js'
import { escapeHtml } from './head-tags.js'

/**
 * `pages`: [{ file, lastModified? }] with `file` in the default language ("about.html").
 * Each language's address is listed with links to all of them, as search engines ask.
 */
export function sitemapXml(siteUrl, pages) {
  const entries = pages.flatMap((page) =>
    LANGUAGES.map((language) => {
      const links = alternates(siteUrl, page.file).map(
        ({ hreflang, href }) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" />`,
      )
      return [
        '  <url>',
        `    <loc>${escapeHtml(pageUrl(siteUrl, page.file, language))}</loc>`,
        page.lastModified && `    <lastmod>${page.lastModified}</lastmod>`,
        ...links,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    }),
  )
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
}

/**
 * Everything may be crawled except the preview copy; the sitemap's address. Search engines read
 * robots.txt only at the root of a domain, so this one counts once the site has its own domain
 * (on dadaryane-cmd.github.io/botz-website/ the sitemap is given to Search Console instead).
 */
export function robotsTxt(siteUrl) {
  const root = new URL(siteUrl).pathname
  return [
    'User-agent: *',
    'Allow: /',
    `Disallow: ${root}preview/`,
    '',
    `Sitemap: ${new URL('sitemap.xml', siteUrl).href}`,
    '',
  ].join('\n')
}
