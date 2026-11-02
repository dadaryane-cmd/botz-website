/**
 * Draws an article's Markdown (parsed by js/blog/markdown.js) with h(): text is always text,
 * never HTML. External links open in a new tab.
 */
import { parseMarkdown } from '../../blog/markdown.js'
import { h } from '../../lib/dom.js'
import { external } from '../../lib/links.js'

const isExternal = (href) => /^https?:/i.test(href)

function inline(parts) {
  return parts.map((part) => {
    if (part.type === 'strong') return h('strong', null, inline(part.children))
    if (part.type === 'em') return h('em', null, inline(part.children))
    if (part.type === 'code') return h('code', null, part.text)
    if (part.type === 'link') {
      const attributes = isExternal(part.href)
        ? { href: part.href, ...external }
        : { href: part.href }
      return h('a', attributes, inline(part.children))
    }
    return part.text
  })
}

function block(item) {
  if (item.type === 'heading') return h(`h${item.level}`, null, inline(item.children))
  if (item.type === 'quote') return h('blockquote', null, h('p', null, inline(item.children)))
  if (item.type === 'image') {
    return h('img', { src: item.src, alt: item.alt, loading: 'lazy', decoding: 'async' })
  }
  if (item.type === 'list') {
    const tag = item.ordered ? 'ol' : 'ul'
    const start = item.ordered && item.start !== 1 ? item.start : null
    return h(
      tag,
      { start },
      item.items.map((parts) => h('li', null, inline(parts))),
    )
  }
  return h('p', null, inline(item.children))
}

/** The article text as elements, for the article body. */
export const renderMarkdown = (markdown) => parseMarkdown(markdown).map(block)
