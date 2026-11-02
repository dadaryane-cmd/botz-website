/**
 * The current page's content: /content/pages/<data-page>.json; on an article's page, the article
 * named by <html data-post> (written by the publishing step and the dev server) and, on the blog
 * page, the list of articles. Missing content is null (the 404 page, or an article that does not
 * exist).
 */
import { ARTICLE_PAGE, PAGES } from '../config.js'
import { loadPost, loadPostIndex } from './blog.js'
import { loadJson } from './load.js'

export const pageKey = document.documentElement.dataset.page
export const postId = document.documentElement.dataset.post ?? null

const [pageContent, articleContent, postList] = await Promise.all([
  PAGES.includes(pageKey) ? loadJson(`pages/${pageKey}.json`) : null,
  pageKey === ARTICLE_PAGE ? loadPost(postId) : null,
  pageKey === 'blog' ? loadPostIndex() : null,
])

export const page = pageContent
export const article = articleContent
/** The published articles, newest first (blog page only). */
export const posts = postList ?? []
