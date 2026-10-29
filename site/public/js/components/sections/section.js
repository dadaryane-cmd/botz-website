/** Building blocks shared by the section components. */
import { h, richText } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'

/** `<section>` with the background, anchor id and width set in the page content. */
export const section = ({ id, background, width }, ...children) =>
  h(
    'section',
    { class: background ? `section bg-${background}` : 'section', id },
    h('div', { class: width ? `container container-${width}` : 'container' }, children),
  )

export const heading = (text, level = 'h2') =>
  text ? h(level, { class: 'heading' }, richText(text)) : null

export const lead = (text) => (text ? h('p', { class: 'lead' }, t(text)) : null)

export const button = ({ label, href, style = 'primary' }) =>
  h('a', { class: `btn btn-${style}`, href }, t(label))

export const buttonRow = (links) =>
  links?.length ? h('div', { class: 'btn-row' }, links.map(button)) : null
