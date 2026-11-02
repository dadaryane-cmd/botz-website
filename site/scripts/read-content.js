/**
 * The site content on disk, for the dev server and the publishing step: what the search-engine
 * tags are written from, and the route table (every page's and article's address, generated as
 * content/routes.json like the blog's list of articles).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PAGES } from '../public/js/config.js'
import { routeTable } from '../public/js/lib/urls.js'
import { readPostIndex } from './read-posts.js'

export const ROUTES_FILE = 'content/routes.json'

const readJson = (publicDir, path) => JSON.parse(readFileSync(join(publicDir, path), 'utf8'))

/** The site-wide content and every page's content: { site, people, navigation, pages }. */
export const readContent = (publicDir) => ({
  site: readJson(publicDir, 'content/site.json'),
  people: readJson(publicDir, 'content/people.json').people,
  navigation: readJson(publicDir, 'content/navigation.json'),
  pages: Object.fromEntries(
    PAGES.map((key) => [key, readJson(publicDir, `content/pages/${key}.json`)]),
  ),
})

/** Every page's and published article's address in each language. */
export function readRoutes(publicDir, today) {
  const { pages } = readContent(publicDir)
  return routeTable(pages, readPostIndex(publicDir, today))
}
