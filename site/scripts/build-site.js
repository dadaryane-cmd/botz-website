/**
 * The publishing step (`npm run build`, run by .github/workflows/pages.yml): copies public/ to
 * dist/ and adds what is written from the content:
 *
 * - every page and published article in each language (about.html, about-en.html,
 *   about-ru.html), with its title, description, canonical and hreflang links, link-preview tags
 *   and schema.org description in the <head> (scripts/seo), so search engines read them without
 *   running the page's script. Articles are copies of post.html (not published itself) that also
 *   fetch the article's file up front;
 * - content/posts/index.json, the list the blog page shows (published articles, newest first);
 * - sitemap.xml and robots.txt.
 *
 * Articles dated in the future are left out until a later publish (the workflow also runs daily).
 * With --preview every page is also marked noindex (the workflow publishes the `preview` branch
 * built this way at /preview/).
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LANGUAGES, PAGES } from '../public/js/config.js'
import { fileInLanguage } from '../public/js/lib/urls.js'
import { PUBLIC_DIR } from './build-preloads.js'
import { INDEX_FILE, postsFolder, readPostIndex, toJson } from './read-posts.js'
import { withSeoTags } from './seo/head-tags.js'
import { pageDescription, publishedPages } from './seo/pages.js'
import { robotsTxt, sitemapXml } from './seo/sitemap.js'

export const DIST_DIR = fileURLToPath(new URL('../dist/', import.meta.url))
const ARTICLE_TEMPLATE = 'post.html'

const NOINDEX = '<meta name="robots" content="noindex" />'

/**
 * A preview page (`npm run build -- --preview`, published at /preview/ to try changes before
 * they go live) is kept out of search results, so it never competes with the real page.
 */
export function withNoindex(html) {
  if (html.includes('name="robots"')) return html
  return html.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n    ${NOINDEX}`)
}

/** An article's page: the template, with the article's file fetched alongside the others. */
export function articlePage(template, slug) {
  const firstModule = template.indexOf('<link rel="modulepreload"')
  if (firstModule === -1) throw new Error(`${ARTICLE_TEMPLATE} has no preload block`)
  const preload = `<link rel="preload" href="content/posts/${slug}.json" as="fetch" crossorigin />`
  return `${template.slice(0, firstModule)}${preload}\n    ${template.slice(firstModule)}`
}

const readJson = (path) => JSON.parse(readFileSync(join(PUBLIC_DIR, path), 'utf8'))

/** What the search-engine tags are written from. */
const readContent = () => ({
  site: readJson('content/site.json'),
  people: readJson('content/people.json').people,
  navigation: readJson('content/navigation.json'),
  pages: Object.fromEntries(PAGES.map((key) => [key, readJson(`content/pages/${key}.json`)])),
})

/** Every HTML page in the built site gets `transform` applied. */
function rewritePages(transform) {
  for (const file of readdirSync(DIST_DIR).filter((name) => name.endsWith('.html'))) {
    const path = join(DIST_DIR, file)
    writeFileSync(path, transform(readFileSync(path, 'utf8')))
  }
}

/** Each page in each language, with its search-engine tags. */
function writePages(pages, content) {
  const template = readFileSync(join(PUBLIC_DIR, ARTICLE_TEMPLATE), 'utf8')
  for (const entry of pages) {
    const source = entry.post
      ? articlePage(template, entry.post.slug)
      : readFileSync(join(PUBLIC_DIR, entry.file), 'utf8')
    for (const language of LANGUAGES) {
      const html = withSeoTags(source, pageDescription(entry, language, content))
      writeFileSync(join(DIST_DIR, fileInLanguage(entry.file, language)), html)
    }
  }
}

function build({ preview = false, today } = {}) {
  rmSync(DIST_DIR, { recursive: true, force: true })
  cpSync(PUBLIC_DIR, DIST_DIR, {
    recursive: true,
    filter: (source) => !source.endsWith(join('content/posts', INDEX_FILE)),
  })
  rmSync(join(DIST_DIR, ARTICLE_TEMPLATE))

  const posts = readPostIndex(PUBLIC_DIR, today)
  mkdirSync(postsFolder(DIST_DIR), { recursive: true })
  writeFileSync(join(postsFolder(DIST_DIR), INDEX_FILE), toJson(posts))

  const content = readContent()
  const pages = publishedPages({ pages: content.pages, posts })
  writePages(pages, content)
  writeFileSync(join(DIST_DIR, 'sitemap.xml'), sitemapXml(content.site.url, pages))
  writeFileSync(join(DIST_DIR, 'robots.txt'), robotsTxt(content.site.url))

  if (preview) rewritePages(withNoindex)
  console.log(
    `Built dist/: ${pages.length} pages in ${LANGUAGES.length} languages, ${posts.length} of ` +
      `them articles${preview ? ' (preview)' : ''}`,
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build({ preview: process.argv.includes('--preview') })
}
