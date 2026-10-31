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
  document.documentElement.dataset.theme = theme
}
