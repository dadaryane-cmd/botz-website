/**
 * The publishing step (`npm run build`, run by .github/workflows/pages.yml): copies public/ to
 * dist/ and adds what is written from the content:
 *
 * - every page and published article at its address in each language (js/lib/urls.js:
 *   mer-masin/index.html, ru/o-nas/index.html, en/blog/<slug>/index.html …), with the site's root
 *   as <base href> and its title, description, canonical and hreflang links, link-preview tags
 *   and schema.org description in the <head> (scripts/seo), so search engines read them without
 *   running the page's script. Articles are copies of post.html that name the article and fetch
 *   its file up front;
 * - content/routes.json (every address) and content/posts/index.json (the blog's list);
 * - sitemap.xml and robots.txt;
 * - a redirect at every earlier address (about.html, about-en.html, smm.html …), so old links and
 *   bookmarks still lead to the page. The page shells themselves are not published.
 *
 * Articles dated in the future are left out until a later publish (the workflow also runs daily).
 * With --preview the site is built for /preview/ under the site's address, with every page marked
 * noindex (the workflow publishes the `preview` branch built this way).
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ARTICLE_PAGE, DEFAULT_LANGUAGE, LANGUAGES } from '../public/js/config.js'
import { HOME_PAGE, localizeHref, pagePath, postPath, routeTable } from '../public/js/lib/urls.js'
import { PUBLIC_DIR } from './build-preloads.js'
import { readContent, ROUTES_FILE } from './read-content.js'
import { INDEX_FILE, postsFolder, readPostIndex, toJson } from './read-posts.js'
import { escapeHtml, scriptJson, withSeoTags } from './seo/head-tags.js'
import { pageDescription, publishedPages } from './seo/pages.js'
import { robotsTxt, sitemapXml } from './seo/sitemap.js'

const DIST_DIR = fileURLToPath(new URL('../dist/', import.meta.url))
const ARTICLE_TEMPLATE = `${ARTICLE_PAGE}.html`
/** The <base href> of the page shells, for the dev server at the root of localhost. */
const SOURCE_BASE = '<base href="/" />'

/** Pages that were merged into the Services page, and where they went. */
export const RETIRED_PAGES = {
  'smm.html': 'services.html#smm',
  'seo.html': 'services.html#seo',
  'website-creation.html': 'services.html#website',
}

const NOINDEX = '<meta name="robots" content="noindex" />'

/**
 * A preview page (`npm run build -- --preview`, published at /preview/ to try changes before
 * they go live) is kept out of search results, so it never competes with the real page.
 */
export function withNoindex(html) {
  if (html.includes('name="robots"')) return html
  return html.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n    ${NOINDEX}`)
}

/** A page that keeps search engines away: noindex, and not one of the redirect pages. */
const blocksSearchEngines = (html) =>
  html.includes(NOINDEX) && !html.includes('http-equiv="refresh"')

/**
 * The classic launch mistake, made impossible: the live site must not keep a noindex left over
 * from testing, and every preview page must have one. Stops the publish with the pages named.
 */
export function checkIndexing(pages, { preview }) {
  const wrong = Object.entries(pages)
    .filter(([, html]) => !html.includes('http-equiv="refresh"'))
    .filter(([, html]) => blocksSearchEngines(html) !== preview)
    .map(([file]) => file)
  if (wrong.length === 0) return
  const problem = preview ? 'preview pages search engines may index' : 'live pages marked noindex'
  throw new Error(`Not published, ${problem}: ${wrong.join(', ')}`)
}

/** The page with the site's root as its base, so its files load from any folder. */
export function withBase(html, rootPath) {
  if (!html.includes(SOURCE_BASE)) throw new Error(`no ${SOURCE_BASE}`)
  return html.replace(SOURCE_BASE, `<base href="${escapeHtml(rootPath)}" />`)
}

/** An article's page: the template, naming the article and fetching its file up front. */
export function articlePage(template, slug) {
  const firstModule = template.indexOf('<link rel="modulepreload"')
  if (firstModule === -1) throw new Error(`${ARTICLE_TEMPLATE} has no preload block`)
  const preload = `<link rel="preload" href="content/posts/${slug}.json" as="fetch" crossorigin />`
  const withPreload = `${template.slice(0, firstModule)}${preload}\n    ${template.slice(firstModule)}`
  return withPreload.replace(
    `data-page="${ARTICLE_PAGE}"`,
    `data-page="${ARTICLE_PAGE}" data-post="${escapeHtml(slug)}"`,
  )
}

/**
 * A page that sends the visitor on at once (and tells search engines where the page is now). The
 * old address's ?query and #anchor go along (pricing.html?cat=seo, a ?lang=ru link), unless the
 * new address has its own.
 */
export function redirectPage(target) {
  const href = escapeHtml(target)
  const search = target.includes('?') ? "''" : 'location.search'
  const hash = target.includes('#') ? "''" : 'location.hash'
  return [
    '<!doctype html>',
    '<html>',
    '  <head>',
    '    <meta charset="utf-8" />',
    `    ${NOINDEX}`,
    '    <title>BOTZ</title>',
    `    <link rel="canonical" href="${href}" />`,
    `    <meta http-equiv="refresh" content="0; url=${href}" />`,
    `    <script>location.replace(${scriptJson(target)} + ${search} + ${hash})</script>`,
    '  </head>',
    `  <body><a href="${href}">${href}</a></body>`,
    '</html>',
    '',
  ].join('\n')
}

/**
 * Every earlier address and the address it now redirects to (relative to the root): the page
 * files of each language (about.html, about-en.html, about-ru.html, post-<slug>-en.html …) and
 * the retired pages. The Armenian index.html is the home page itself.
 */
export function earlierAddresses(routes) {
  const named = (name, pathIn) =>
    LANGUAGES.map((language) => ({
      file: language === DEFAULT_LANGUAGE ? `${name}.html` : `${name}-${language}.html`,
      path: pathIn(language),
    }))
  const pages = Object.keys(routes.pages).flatMap((key) =>
    named(key === HOME_PAGE ? 'index' : key, (language) => pagePath(routes, key, language)),
  )
  const posts = Object.keys(routes.posts).flatMap((id) =>
    named(`post-${id}`, (language) => postPath(routes, id, language)),
  )
  const retired = Object.entries(RETIRED_PAGES).map(([file, target]) => ({
    file,
    path: localizeHref(target, DEFAULT_LANGUAGE, routes),
  }))
  return [...pages, ...posts, ...retired].filter((entry) => entry.file !== 'index.html')
}

/** The file a page is written to: "ru/uslugi/" → ru/uslugi/index.html, "./" → index.html. */
const pageFile = (path) => (path === './' ? 'index.html' : `${path}index.html`)

function writeFile(relativePath, text) {
  const path = join(DIST_DIR, relativePath)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

/** Every HTML page of the built site, by its path: { 'ru/o-nas/index.html': html, … }. */
const builtPages = () =>
  Object.fromEntries(
    readdirSync(DIST_DIR, { recursive: true })
      .filter((name) => name.endsWith('.html'))
      .map((file) => [file, readFileSync(join(DIST_DIR, file), 'utf8')]),
  )

/** Every HTML page in the built site gets `transform` applied (all folders). */
function rewritePages(transform) {
  for (const [file, html] of Object.entries(builtPages())) {
    writeFileSync(join(DIST_DIR, file), transform(html))
  }
}

/** Each page in each language at its address, with its base and search-engine tags. */
function writePages({ pages, routes, content, rootPath }) {
  const template = readFileSync(join(PUBLIC_DIR, ARTICLE_TEMPLATE), 'utf8')
  for (const entry of pages) {
    const source = entry.post
      ? articlePage(template, entry.post.slug)
      : readFileSync(join(PUBLIC_DIR, entry.file), 'utf8')
    for (const language of LANGUAGES) {
      const description = pageDescription(entry, language, { ...content, routes })
      const path = entry.post
        ? postPath(routes, entry.post.slug, language)
        : pagePath(routes, entry.key, language)
      writeFile(pageFile(path), withSeoTags(withBase(source, rootPath), description))
    }
  }
}

/** The 404 page: GitHub Pages shows it at any missing address, in any folder. */
function writeNotFound(rootPath) {
  writeFile('404.html', withBase(readFileSync(join(PUBLIC_DIR, '404.html'), 'utf8'), rootPath))
}

function build({ preview = false, today } = {}) {
  const content = readContent(PUBLIC_DIR)
  // The preview is a whole copy of the site in /preview/: its addresses point there.
  const siteUrl = preview ? new URL('preview/', content.site.url).href : content.site.url
  const rootPath = new URL(siteUrl).pathname
  const site = { ...content.site, url: siteUrl }

  rmSync(DIST_DIR, { recursive: true, force: true })
  // The page shells become the pages below and redirects; content files are copied as they are
  // (not the .gitkeep that keeps an empty media folder, such as downloads/, in the repository).
  const shells = new Set(readdirSync(PUBLIC_DIR).filter((file) => file.endsWith('.html')))
  cpSync(PUBLIC_DIR, DIST_DIR, {
    recursive: true,
    filter: (source) =>
      !shells.has(source.slice(PUBLIC_DIR.length)) &&
      !source.endsWith(join('content/posts', INDEX_FILE)) &&
      !source.endsWith('.gitkeep'),
  })

  const posts = readPostIndex(PUBLIC_DIR, today)
  const routes = routeTable(content.pages, posts)
  mkdirSync(postsFolder(DIST_DIR), { recursive: true })
  writeFileSync(join(postsFolder(DIST_DIR), INDEX_FILE), toJson(posts))
  writeFile(ROUTES_FILE, toJson(routes))

  const pages = publishedPages({ pages: content.pages, posts })
  writePages({ pages, routes, content: { ...content, site }, rootPath })
  writeNotFound(rootPath)
  for (const { file, path } of earlierAddresses(routes)) {
    writeFile(file, redirectPage(new URL(path, siteUrl).href))
  }
  writeFile('sitemap.xml', sitemapXml(siteUrl, routes, pages))
  writeFile('robots.txt', robotsTxt(siteUrl))

  if (preview) rewritePages(withNoindex)
  checkIndexing(builtPages(), { preview })
  console.log(
    `Built dist/ for ${siteUrl}: ${pages.length} pages in ${LANGUAGES.length} languages ` +
      `(${posts.length} articles)`,
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build({ preview: process.argv.includes('--preview') })
}
