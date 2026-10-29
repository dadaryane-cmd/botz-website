/**
 * Site-wide content from /content/*.json, loaded once before anything renders.
 * Every text is `{ hy, en, ru }`; see README.md for the editing workflow.
 */
import { loadJson } from './load.js'

const [site, peopleFile, navigation, catalog, finder, ui] = await Promise.all(
  ['site', 'people', 'navigation', 'catalog', 'finder', 'ui'].map((name) =>
    loadJson(`${name}.json`),
  ),
)

export const { people } = peopleFile
export { site, navigation, catalog, finder, ui }
