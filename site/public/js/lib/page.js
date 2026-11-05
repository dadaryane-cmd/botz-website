import { ARTICLE_PAGE } from '../config.js'
import { article, page, pageKey, postId, posts } from '../content/page.js'
import { routes } from '../content/routes.js'
import { HOME_PAGE, pagePath, postPath } from './urls.js'

/** The page being shown (null on the 404 page and on article pages). */
export const currentPage = () => page

/** The article being shown on an article page (null when it does not exist). */
export const currentArticle = () => article

export const isArticlePage = () => pageKey === ARTICLE_PAGE

/** The published articles, newest first (on the blog page). */
export const publishedPosts = () => posts

/** The HTML file of the current page, as used in navigation links (articles belong to the blog). */
export function currentFile() {
  if (pageKey === 'home') return 'index.html'
  if (pageKey === ARTICLE_PAGE) return 'blog.html'
  return `${pageKey}.html`
}

const hasSection = (id) => Boolean(page?.sections.some((section) => section.id === id))

/** Link to a section on this page if it has one, otherwise on `file`. */
export const sectionHref = (id, file) => (hasSection(id) ? `#${id}` : `${file}#${id}`)

/**
 * The address being shown, relative to the site's root (the page's <base href>):
 * "ru/uslugi/" on …/botz-website/ru/uslugi/.
 */
export const currentSitePath = () =>
  location.pathname.slice(new URL(document.baseURI).pathname.length)

/** This page in another language (relative to the root); the home page when there is none. */
export function currentPageIn(language) {
  const path = isArticlePage()
    ? postPath(routes, postId, language)
    : pagePath(routes, pageKey, language)
  return path ?? pagePath(routes, HOME_PAGE, language)
}
