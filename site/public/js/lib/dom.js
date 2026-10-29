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

/** Localized text where `*words*` are emphasised, as used in headings. */
export function richText(value) {
  const fragment = document.createDocumentFragment()
  for (const part of t(value).split(/(\*[^*]+\*)/)) {
    if (/^\*[^*]+\*$/.test(part)) fragment.append(h('em', null, part.slice(1, -1)))
    else if (part) fragment.append(part)
  }
  return fragment
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
