/**
 * The current page's content: /content/pages/<data-page>.json; on the article page, the article
 * named in the address (post-<slug>.html) and, on the blog page, the list of articles. Missing
 * content is null (the 404 page, or an article that does not exist).
 */
import { slugFromPath } from '../blog/posts.js'
import { ARTICLE_PAGE, PAGES } from '../config.js'
import { loadPost, loadPostIndex } from './blog.js'
import { loadJson } from './load.js'

export const pageKey = document.documentElement.dataset.page

const [pageContent, articleContent, postList] = await Promise.all([
  PAGES.includes(pageKey) ? loadJson(`pages/${pageKey}.json`) : null,
  pageKey === ARTICLE_PAGE ? loadPost(slugFromPath(location.pathname)) : null,
  pageKey === 'blog' ? loadPostIndex() : null,
])

export const page = pageContent
export const article = articleContent
/** The published articles, newest first (blog page only). */
export const posts = postList ?? []
