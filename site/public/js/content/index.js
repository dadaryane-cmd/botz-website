/**
 * Site-wide content from /content/*.json, loaded once before anything renders.
 * Every text is `{ hy, en, ru }`; see README.md for the editing workflow.
 */
import { SITE_CONTENT } from '../config.js'
import { loadJson } from './load.js'

const files = await Promise.all(SITE_CONTENT.map((name) => loadJson(`${name}.json`)))
const content = Object.fromEntries(SITE_CONTENT.map((name, index) => [name, files[index]]))

export const { site, navigation, catalog, finder, ui } = content
export const { people } = content.people
