// Classic script in <head>: sets the theme before the page paints, so it never flashes the other one.
// The saved choice wins; otherwise follow the system setting. (Block-scoped: no globals.)
{
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  try {
    const saved = JSON.parse(localStorage.getItem('botz.theme'))
    if (saved === 'light' || saved === 'dark') theme = saved
  } catch {
    // Storage unavailable: keep the system theme.
  }
  document.documentElement.dataset.theme = theme
}
