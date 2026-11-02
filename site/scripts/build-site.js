/**
 * The publishing step (`npm run build`, run by .github/workflows/pages.yml): copies public/ to
 * dist/ and adds what depends on the articles in content/posts:
 *
 * - content/posts/index.json, the list the blog page shows (published articles, newest first);
 * - post-<slug>.html for every published article: a copy of post.html that also fetches the
 *   article's file up front. post.html itself is not published.
 *
 * Articles dated in the future are left out until a later publish (the workflow also runs daily).
 * With --preview every page is also marked noindex (the workflow publishes the `preview` branch
 * built this way at /preview/).
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { postFile } from '../public/js/blog/posts.js'
import { PUBLIC_DIR } from './build-preloads.js'
import { INDEX_FILE, postsFolder, readPostIndex, toJson } from './read-posts.js'

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

/** Every HTML page in the built site gets `transform` applied. */
function rewritePages(transform) {
  for (const file of readdirSync(DIST_DIR).filter((name) => name.endsWith('.html'))) {
    const path = join(DIST_DIR, file)
    writeFileSync(path, transform(readFileSync(path, 'utf8')))
  }
}

function build({ preview = false, today } = {}) {
  rmSync(DIST_DIR, { recursive: true, force: true })
  cpSync(PUBLIC_DIR, DIST_DIR, {
    recursive: true,
    filter: (source) => !source.endsWith(join('content/posts', INDEX_FILE)),
  })
  rmSync(join(DIST_DIR, ARTICLE_TEMPLATE))

  const index = readPostIndex(PUBLIC_DIR, today)
  mkdirSync(postsFolder(DIST_DIR), { recursive: true })
  writeFileSync(join(postsFolder(DIST_DIR), INDEX_FILE), toJson(index))

  const template = readFileSync(join(PUBLIC_DIR, ARTICLE_TEMPLATE), 'utf8')
  for (const post of index) {
    writeFileSync(join(DIST_DIR, postFile(post.slug)), articlePage(template, post.slug))
  }
  if (preview) rewritePages(withNoindex)
  console.log(`Built dist/ with ${index.length} articles${preview ? ' (preview)' : ''}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  build({ preview: process.argv.includes('--preview') })
}
