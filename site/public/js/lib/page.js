import { pages } from '../content/pages/index.js'

/** The page being shown, from `<html data-page="…">` (undefined on the 404 page). */
export const currentPage = () => pages[document.documentElement.dataset.page]

export const hasSection = (id) =>
  Boolean(currentPage()?.sections.some((section) => section.id === id))

/** Link to a section on this page if it has one, otherwise on `file`. */
export const sectionHref = (id, file) => (hasSection(id) ? `#${id}` : `${file}#${id}`)
