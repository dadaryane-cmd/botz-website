/**
 * Read a JSON file from /content (the files edited in Pages CMS). In the browser this is a
 * fetch; under Node (unit tests) the same URL is a file: URL and is read from disk.
 */
const contentRoot = new URL('../../content/', import.meta.url)

export async function loadJson(file) {
  const url = new URL(file, contentRoot)
  let text
  if (url.protocol === 'file:') {
    const { readFile } = await import('node:fs/promises')
    text = await readFile(url, 'utf8')
  } else {
    // GitHub Pages lets browsers reuse files for 10 minutes; content must show edits at once,
    // so always ask whether the file changed (an unchanged file is a cheap "304 Not Modified").
    const response = await fetch(url, { cache: 'no-cache' })
    if (!response.ok) throw new Error(`Could not load ${url.pathname} (${response.status})`)
    text = await response.text()
  }
  // Fields left empty in the editor are saved as "": treat them as not set.
  return JSON.parse(text, (key, value) => (value === '' ? null : value))
}
