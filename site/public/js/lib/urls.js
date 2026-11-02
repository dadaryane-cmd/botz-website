/**
 * The site's addresses. Armenian (the default language) is at the site's root, the other
 * languages each in a folder, and every page and article has an address in each language:
 *
 *   tsarayutyunner/        ru/uslugi/           en/services/
 *   blog/<armenian-slug>/  ru/blog/<ru-slug>/   en/blog/<en-slug>/
 *
 * They come from the content (each page's and article's `path`), collected in a route table:
 * { pages: { services: { hy, en, ru }, … }, posts: { <article id>: { hy, en, ru } } }.
 * Content names pages by their file ("pricing.html?cat=smm", "post-<id>.html"), and links are
 * pointed at that page's address in the page's language. Addresses are relative to the site's
 * root (every page has a <base href>), so the site also works in a sub-folder.
 * Pure, so the browser, the dev server and the publishing step follow the same rules.
 */
import { DEFAULT_LANGUAGE, LANGUAGES } from '../config.js'

export const HOME_PAGE = 'home'
export const BLOG_PAGE = 'blog'

const OTHER_LANGUAGES = LANGUAGES.filter((language) => language !== DEFAULT_LANGUAGE)

/** A slug: lowercase Latin letters, digits and hyphens ("mer-masin", "seo-prodvizhenie"). */
export const isSlug = (slug) => typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)

/** A link to one of the site's pages by its file: "pricing.html", "services.html#seo". */
const PAGE_LINK = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.html((?:[?#].*)?)$/

/** The folder of a language: "ru/", and "" for Armenian (at the root). */
const languageFolder = (language) => (language === DEFAULT_LANGUAGE ? '' : `${language}/`)

/** The route table from the pages ({ key: page content }) and the published articles. */
export function routeTable(pages, posts) {
  return {
    pages: Object.fromEntries(Object.entries(pages).map(([key, page]) => [key, page.path ?? {}])),
    posts: Object.fromEntries(posts.map((post) => [post.slug, post.path ?? {}])),
  }
}

/** A page's address in `language` ("ru/uslugi/"; "./" for the Armenian home page), or null. */
export function pagePath(routes, key, language) {
  const slugs = routes.pages[key]
  if (!slugs) return null
  const slug = slugs[language]
  const path = slug ? `${languageFolder(language)}${slug}/` : languageFolder(language)
  return path || './'
}

/** An article's address in `language`, inside the blog's ("ru/blog/<slug>/"), or null. */
export function postPath(routes, id, language) {
  const slug = routes.posts[id]?.[language]
  const blog = pagePath(routes, BLOG_PAGE, language)
  return slug && blog ? `${blog}${slug}/` : null
}

/** The page a content link names: "index.html" → home, "post-<id>.html" → that article. */
function linkTarget(name) {
  if (name === 'index') return { page: HOME_PAGE }
  const post = name.match(/^post-(.+)$/)?.[1]
  return post ? { post } : { page: name }
}

/**
 * A link to one of the site's pages, pointed at its address in `language`
 * ("pricing.html?cat=smm" → "ru/ceny/?cat=smm"). Other links (other sites, files, #anchors) and
 * links to pages the site does not have stay as they are.
 */
export function localizeHref(href, language, routes) {
  const match = String(href).match(PAGE_LINK)
  if (!match) return href
  const [, name, rest] = match
  const target = linkTarget(name)
  const path = target.post
    ? postPath(routes, target.post, language)
    : pagePath(routes, target.page, language)
  return path ? path + rest : href
}

/** The language of an address relative to the root: "ru/uslugi/" → "ru", "mer-masin/" → "hy". */
export function languageOfPath(sitePath) {
  const folder = String(sitePath).split('/')[0]
  return OTHER_LANGUAGES.includes(folder) ? folder : DEFAULT_LANGUAGE
}

/** What an address relative to the root shows: { language, page } or { language, post }, or null. */
export function resolvePath(routes, sitePath) {
  const language = languageOfPath(sitePath)
  const segments = String(sitePath)
    .split('/')
    .filter((segment) => segment && segment !== 'index.html')
  const [first, second, ...rest] = language === DEFAULT_LANGUAGE ? segments : segments.slice(1)
  if (!first) return { language, page: HOME_PAGE }
  if (rest.length > 0) return null
  const page = Object.keys(routes.pages).find((key) => routes.pages[key][language] === first)
  if (!page) return null
  if (!second) return { language, page }
  if (page !== BLOG_PAGE) return null
  const post = Object.keys(routes.posts).find((id) => routes.posts[id][language] === second)
  return post ? { language, post } : null
}
