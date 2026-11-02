/**
 * The route table: every page's and article's address in each language (js/lib/urls.js).
 * content/routes.json is written from the content when publishing, and by the dev server on
 * request, like the blog's list of articles.
 */
import { loadJson } from './load.js'

export const routes = await loadJson('routes.json')
