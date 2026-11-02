/**
 * Blog content: the list of articles (content/posts/index.json, written when the site is
 * published and by the dev server) and single articles (content/posts/<slug>.json).
 * Both return null when the file is missing, so the page can say so instead of breaking.
 */
import { isSlug } from '../blog/posts.js'
import { loadJson } from './load.js'

const loadOrNull = (file) => loadJson(file).catch(() => null)

export const loadPostIndex = () => loadOrNull('posts/index.json')

export const loadPost = (slug) => (isSlug(slug) ? loadOrNull(`posts/${slug}.json`) : null)
