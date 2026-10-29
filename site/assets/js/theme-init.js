// Runs before the page paints, so a saved light/dark choice never flashes the other theme.
try {
  const saved = JSON.parse(localStorage.getItem('botz.theme'))
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved
} catch {
  /* storage unavailable: follow the system theme */
}
