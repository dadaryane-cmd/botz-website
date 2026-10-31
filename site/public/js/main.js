/**
 * Entry point. Every HTML page has the same empty shell and names its content with
 * <html data-page="…">; this module renders the header, the page's sections and the footer,
 * and re-renders when the language changes. The theme is pure CSS (<html data-theme>).
 */
import { renderFooter } from './components/layout/footer.js'
import { renderHeader, setUpMobileMenu } from './components/layout/header.js'
import { renderMobileBar } from './components/layout/mobile-bar.js'
import { renderNotFound } from './components/not-found.js'
import { renderSection } from './components/sections/index.js'
import { site } from './content/index.js'
import { getLanguage, initLanguage, onLanguageChange, t, ui } from './lib/i18n.js'
import { currentPage } from './lib/page.js'
import { startReveals } from './lib/reveal.js'
import { initSelection } from './pricing/selection.js'

const elements = {
  header: document.getElementById('site-header'),
  main: document.getElementById('main'),
  footer: document.getElementById('site-footer'),
  mobileBar: document.getElementById('mobile-bar'),
  skipLink: document.querySelector('.skip-link'),
  description: document.querySelector('meta[name="description"]'),
}

function renderPage() {
  const page = currentPage()
  document.documentElement.lang = getLanguage()
  elements.skipLink.textContent = ui('common', 'skipToContent')

  if (!page) {
    document.title = ui('errors', 'notFoundTitle') + t(site.titleSuffix)
    elements.main.replaceChildren(renderNotFound())
    return
  }
  document.title = t(page.meta.title) + t(site.titleSuffix)
  elements.description.content = t(page.meta.description)
  elements.main.replaceChildren(...page.sections.map(renderSection).filter(Boolean))
}

function renderAll() {
  renderHeader(elements.header)
  renderPage()
  renderFooter(elements.footer)
  renderMobileBar(elements.mobileBar)
}

initLanguage(location.search)
initSelection(location.search)
renderAll()
setUpMobileMenu(elements.header)
// Sections are created by script, so the browser could not jump to #anchors on load.
if (location.hash) {
  document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
}
// Reveals start after scrolling, so whatever is on screen is shown at once.
startReveals()

onLanguageChange(() => {
  const scrollPosition = window.scrollY
  renderAll()
  window.scrollTo(0, scrollPosition)
  startReveals()
})
