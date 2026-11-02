// Classic script in <head>, run before the page paints (block-scoped: no globals).
// 1. Theme: the saved choice, else dark, set now so the page never flashes the other theme.
// 2. Early fetches for the first screen, which the browser would otherwise find only once the
//    script has drawn the page: the fonts its text uses in the page's language and, on the home
//    page, the fire picture for this theme. Fonts that arrive after the text is drawn re-wrap it
//    and everything below jumps (a layout shift): main.js waits briefly for these to load.
//    (The stylesheets have been read when this runs, so the fonts are known by name.)
{
  const root = document.documentElement
  const readSaved = (key) => {
    try {
      return JSON.parse(localStorage.getItem(`botz.${key}`))
    } catch {
      return null // storage unavailable
    }
  }
  const preload = (href, as, extra) => {
    const link = Object.assign(document.createElement('link'), { rel: 'preload', href, as }, extra)
    document.head.append(link)
  }

  const savedTheme = readSaved('theme')
  const theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
  root.dataset.theme = theme

  // The same choice as pickLanguage() in js/lib/i18n.js: the link (?lang=), the saved choice,
  // the browser's languages, else Armenian.
  const LANGUAGES = ['hy', 'en', 'ru']
  const browserLanguages = (navigator.languages ?? [navigator.language]).map(
    (tag) => String(tag).toLowerCase().split('-')[0],
  )
  const candidates = [new URLSearchParams(location.search).get('lang'), readSaved('lang')]
  const language =
    [...candidates, ...browserLanguages].find((code) => LANGUAGES.includes(code)) ?? 'hy'

  // The header and first section in each language (css/base/fonts.css): page titles (Anton;
  // Russian falls back to Oswald, Armenian to Noto) and body text (Golos Text). Each font with a
  // sample letter, which picks the right piece of it (Latin, Cyrillic or Armenian).
  const FIRST_SCREEN_FONTS = {
    hy: [
      ['Noto Sans Armenian', 'Ա'],
      ['Golos Text', 'A'],
    ],
    en: [
      ['Anton', 'A'],
      ['Golos Text', 'A'],
    ],
    ru: [
      ['Oswald', 'Б'],
      ['Golos Text', 'Б'],
      ['Golos Text', 'A'],
    ],
  }
  for (const [family, sample] of FIRST_SCREEN_FONTS[language]) {
    // Loading through the font set (not a <link> preload) lets main.js wait on document.fonts.
    document.fonts.load(`1em "${family}"`, sample).catch(() => {})
  }

  // The home page's first screen is the fire picture (a CSS background). Browsers without AVIF
  // skip it (`type`).
  if (root.dataset.page === 'home') {
    preload(`images/hero-flame-poster-${theme}.avif`, 'image', {
      type: 'image/avif',
      fetchPriority: 'high',
    })
  }
}
