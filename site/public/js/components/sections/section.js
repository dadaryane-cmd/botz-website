/** Building blocks shared by the section components. */
import { h, richText } from '../../lib/dom.js'
import { hasText, t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'

/** `<section>` with the background, anchor id and width set in the page content. */
export const section = ({ id, background, width }, ...children) =>
  h(
    'section',
    { class: background ? `section bg-${background}` : 'section', id: id || null },
    h('div', { class: width ? `container container-${width}` : 'container' }, children),
  )

export const heading = (text, level = 'h2') =>
  hasText(text) ? h(level, { class: 'heading', ...reveal() }, richText(text)) : null

export const lead = (text) =>
  hasText(text) ? h('p', { class: 'lead', ...reveal(1) }, t(text)) : null

export const button = ({ label, href, style }) =>
  h('a', { class: `btn btn-${style || 'primary'}`, href }, t(label))

export const buttonRow = (links) =>
  links?.length
    ? h(
        'div',
        { class: 'btn-row' },
        links.map((link) => button(link)),
      )
    : null
