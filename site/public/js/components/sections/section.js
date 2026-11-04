/** Building blocks shared by the section components. */
import { h, richText } from '../../lib/dom.js'
import { hasText, t } from '../../lib/i18n.js'
import { updateSelection } from '../../pricing/selection.js'

/** `<section>` with the background, anchor id and width set in the page content. */
export const section = ({ id, background, width }, ...children) =>
  h(
    'section',
    { class: background ? `section bg-${background}` : 'section', id: id || null },
    h('div', { class: width ? `container container-${width}` : 'container' }, children),
  )

/* Headings and intros are not revealed on scroll: text is there to be read at once. */
export const heading = (text, level = 'h2') =>
  hasText(text) ? h(level, { class: 'heading' }, richText(text)) : null

export const lead = (text) => (hasText(text) ? h('p', { class: 'lead' }, t(text)) : null)

/**
 * A link styled as a button; with a `note`, clicking it also prefills the contact form's message.
 * `size`: 'small' for the smaller button (the header's).
 */
export const button = ({ label, href, style, note }, { size } = {}) =>
  h(
    'a',
    {
      class: [`btn btn-${style || 'primary'}`, size && `btn-${size}`].filter(Boolean).join(' '),
      href,
      // The note is kept in every language, so it follows a later language change.
      onclick: hasText(note) ? () => updateSelection({ note }) : null,
    },
    t(label),
  )

export const buttonRow = (links) =>
  links?.length
    ? h(
        'div',
        { class: 'btn-row' },
        links.map((link) => button(link)),
      )
    : null
