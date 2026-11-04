/**
 * Entry point. Every HTML page has the same empty shell and names its content with
 * <html data-page="…">; this module renders the header, the page's sections and the footer in
 * the language of the page's address (about-en.html is English). The theme is pure CSS
 * (<html data-theme>).
 */
import { renderArticle } from './components/blog/article.js'
import { renderFooter } from './components/layout/footer.js'
import { setUpCompactHeader } from './components/layout/compact-header.js'
import { renderHeader, setUpMobileMenu } from './components/layout/header.js'
import { renderMobileBar } from './components/layout/mobile-bar.js'
import { renderNotFound } from './components/not-found.js'
import { renderSection } from './components/sections/index.js'
import { site } from './content/index.js'
import { getLanguage, initLanguage, t, ui } from './lib/i18n.js'
import { currentArticle, currentPage, currentSitePath, isArticlePage } from './lib/page.js'
import { startReveals } from './lib/reveal.js'
import { initSelection } from './pricing/selection.js'
import { startAnalytics } from './services/analytics.js'

/** The longest the first drawing waits for the first screen's fonts (usually they are there). */
const FONT_WAIT_MS = 400

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const elements = {
  header: document.getElementById('site-header'),
  main: document.getElementById('main'),
  footer: document.getElementById('site-footer'),
  mobileBar: document.getElementById('mobile-bar'),
  skipLink: document.querySelector('.skip-link'),
  description: document.querySelector('meta[name="description"]'),
}

function renderArticlePage() {
  const post = currentArticle()
  const title = post ? t(post.title) : ui('blog', 'missingTitle')
  document.title = title + t(site.titleSuffix)
  if (post) elements.description.content = t(post.description)
  elements.main.replaceChildren(renderArticle(post))
}

function renderPage() {
  const page = currentPage()
  document.documentElement.lang = getLanguage()
  elements.skipLink.textContent = ui('common', 'skipToContent')

  if (isArticlePage()) {
    renderArticlePage()
    return
  }
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

initLanguage(currentSitePath())
// With <base href> at the site's root, the shell's "#main" would lead to the home page.
elements.skipLink.setAttribute('href', `${location.pathname}#main`)
initSelection(location.search)
// head.js started loading the first screen's fonts. Drawn before they arrive, the text would
// re-wrap when they do and the page below would jump; so wait for them, but never long.
await Promise.race([document.fonts.ready, wait(FONT_WAIT_MS)])
renderAll()
setUpMobileMenu(elements.header)
setUpCompactHeader(elements.header)
// Sections are created by script, so the browser could not jump to #anchors on load.
if (location.hash) {
  document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
}
// Reveals start after scrolling, so whatever is on screen is shown at once.
startReveals()
// Only with a measurement id set in Pages CMS; Google's script loads once the page is idle.
startAnalytics(site.ga4Id)
