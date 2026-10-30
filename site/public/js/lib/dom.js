import { t } from './i18n.js'

/**
 * Create an element: `h('a', { href: '#', class: 'btn', onclick }, 'Label', childNode)`.
 * Strings become text nodes (never parsed as HTML); null, false and nested arrays are flattened away.
 */
export function h(tag, attributes, ...children) {
  const element = document.createElement(tag)
  for (const [name, value] of Object.entries(attributes ?? {})) {
    if (value == null || value === false) continue
    if (name === 'class') element.className = value
    else if (name.startsWith('on')) element.addEventListener(name.slice(2), value)
    else element.setAttribute(name, value === true ? '' : value)
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue
    element.append(child instanceof Node ? child : String(child))
  }
  return element
}

/**
 * Localized text where `*words*` are emphasised, as used in headings.
 * With `words: true` every word is wrapped in `<span class="word" style="--i: n">` for the
 * word-by-word entrance animation (emphasised words stay together inside one `<em>`).
 */
export function richText(value, { words = false } = {}) {
  const fragment = document.createDocumentFragment()
  let index = 0
  const wordSpan = (word) => h('span', { class: 'word', style: `--i: ${index++}` }, word)
  /** Text as a list of nodes: the text itself, or (with `words`) word spans and the spaces between. */
  const nodes = (text) =>
    words
      ? text
          .split(/(\s+)/)
          .filter(Boolean)
          .map((part) => (/^\s+$/.test(part) ? part : wordSpan(part)))
      : [text]
  for (const part of t(value).split(/(\*[^*]+\*)/)) {
    if (/^\*[^*]+\*$/.test(part)) fragment.append(h('em', null, nodes(part.slice(1, -1))))
    else if (part) fragment.append(...nodes(part))
  }
  return fragment
}

/** An element from static, trusted markup (only for the site's own SVG drawings and icons). */
export function fromMarkup(markup) {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  return template.content.firstElementChild
}

/**
 * Restart a CSS animation class even if it is already applied, and remove it again after
 * `duration` ms when given. Reading `offsetWidth` makes the browser apply the removal first.
 */
export function replayClass(element, className, duration) {
  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
  if (duration) setTimeout(() => element.classList.remove(className), duration)
}

/**
 * Replace a container's content and keep keyboard focus on the control with the same
 * `data-key`, so re-rendering after a click does not lose the user's place.
 */
export function renderInto(container, children) {
  const focusedKey = document.activeElement?.dataset?.key
  container.replaceChildren(...children.filter(Boolean))
  if (focusedKey) container.querySelector(`[data-key="${CSS.escape(focusedKey)}"]`)?.focus()
}
