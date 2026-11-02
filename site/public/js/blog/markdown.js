/**
 * A small Markdown reader for blog articles, written in the admin panel. It turns the text into
 * plain data (blocks with inline parts); components/blog/markdown.js draws it with h(), so the
 * text is never parsed as HTML.
 *
 * Blocks, separated by an empty line:   ## Heading   ### Smaller heading   - or * list items
 * 1. numbered items   > quote   ![description](image.webp)   anything else is a paragraph.
 * Inline: **bold**, *italic* or _italic_, [link text](https://…), `code`.
 */

const HEADING = /^(#{1,3})\s+(.*)$/
const BULLET = /^[-*]\s+(.*)$/
const NUMBERED = /^(?:\d+)[.)]\s+(.*)$/
const QUOTE = /^>\s?(.*)$/
const IMAGE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/

/** Links may go to web pages, email, phone or pages of this site; never `javascript:` and the like. */
export function isSafeHref(href) {
  const value = String(href).trim()
  if (/^(https?:|mailto:|tel:)/i.test(value)) return true
  return !/^[a-z][a-z0-9+.-]*:/i.test(value)
}

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_|`(.+?)`|\[([^\]]+)\]\(([^)\s]+)\)/g

/** One match of INLINE → a part. A link to an unsafe address stays plain text. */
function inlinePart([whole, strong, star, underscore, code, label, href]) {
  if (strong) return { type: 'strong', children: parseInline(strong) }
  if (star || underscore) return { type: 'em', children: parseInline(star ?? underscore) }
  if (code) return { type: 'code', text: code }
  if (isSafeHref(href)) return { type: 'link', href, children: parseInline(label) }
  return { type: 'text', text: whole }
}

/** The text of a block, as a list of `{ type: 'text' | 'strong' | 'em' | 'code' | 'link' }`. */
export function parseInline(text) {
  const parts = []
  let last = 0
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) parts.push({ type: 'text', text: text.slice(last, match.index) })
    parts.push(inlinePart(match))
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ type: 'text', text: text.slice(last) })
  return parts
}

/** One block of lines (no empty lines inside) → a block. */
function parseBlock(lines) {
  const [first] = lines
  const heading = first.match(HEADING)
  if (heading && lines.length === 1) {
    // "#" is the article's own title: headings in the text start at level 2.
    return {
      type: 'heading',
      level: Math.max(2, heading[1].length),
      children: parseInline(heading[2]),
    }
  }
  const image = first.match(IMAGE)
  if (image && lines.length === 1) {
    return isSafeHref(image[2]) ? { type: 'image', alt: image[1], src: image[2] } : null
  }
  if (lines.every((line) => BULLET.test(line))) {
    const items = lines.map((line) => parseInline(line.match(BULLET)[1]))
    return { type: 'list', ordered: false, items }
  }
  if (lines.every((line) => NUMBERED.test(line))) {
    const items = lines.map((line) => parseInline(line.match(NUMBERED)[1]))
    // A list that continues after a heading (5., 6., …) keeps counting from its first number.
    return { type: 'list', ordered: true, start: parseInt(first, 10), items }
  }
  if (lines.every((line) => QUOTE.test(line))) {
    const text = lines.map((line) => line.match(QUOTE)[1]).join(' ')
    return { type: 'quote', children: parseInline(text) }
  }
  return { type: 'paragraph', children: parseInline(lines.join(' ')) }
}

/** Markdown text → blocks. */
export function parseMarkdown(markdown = '') {
  return String(markdown)
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((chunk) =>
      chunk
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
    .map(parseBlock)
    .filter(Boolean)
}

/** The words of an article, for its reading time. */
export function plainText(markdown = '') {
  return String(markdown)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`-]/g, ' ')
}
