// Classic script in <head>: sets the theme before the page paints, so it never flashes the other one.
// The site opens in dark mode; a choice made with the lamp is saved and wins. (Block-scoped: no globals.)
{
  let theme = 'dark'
  try {
    const saved = JSON.parse(localStorage.getItem('botz.theme'))
    if (saved === 'light' || saved === 'dark') theme = saved
  } catch {
    // Storage unavailable: keep the default.
  }
  const root = document.documentElement
  root.dataset.theme = theme

  // The home page's first screen is the fire picture (a CSS background for this theme, which the
  // browser would only find late): fetch it now. Browsers without AVIF skip it (`type`).
  if (root.dataset.page === 'home') {
    const poster = document.createElement('link')
    poster.rel = 'preload'
    poster.as = 'image'
    poster.type = 'image/avif'
    poster.href = `images/hero-flame-poster-${theme}.avif`
    poster.fetchPriority = 'high'
    document.head.append(poster)
  }
}
