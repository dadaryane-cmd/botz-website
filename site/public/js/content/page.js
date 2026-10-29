/** The current page's content: /content/pages/<data-page>.json, or null for the 404 page. */
import { PAGES } from '../config.js'
import { loadJson } from './load.js'

export const pageKey = document.documentElement.dataset.page

export const page = PAGES.includes(pageKey) ? await loadJson(`pages/${pageKey}.json`) : null
