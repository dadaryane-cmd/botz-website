import { page, pageKey } from '../content/page.js'

/** The page being shown (null on the 404 page). */
export const currentPage = () => page

/** The HTML file of the current page, as used in navigation links. */
export const currentFile = () => (pageKey === 'home' ? 'index.html' : `${pageKey}.html`)

export const hasSection = (id) => Boolean(page?.sections.some((section) => section.id === id))

/** Link to a section on this page if it has one, otherwise on `file`. */
export const sectionHref = (id, file) => (hasSection(id) ? `#${id}` : `${file}#${id}`)
