import { h } from '../../lib/dom.js'
import { buttonRow, heading, lead, section } from './section.js'

/** Call to action on a coloured background. */
export const renderCta = (config) =>
  section(
    config,
    h(
      'div',
      { class: 'cta' },
      heading(config.heading),
      lead(config.text),
      buttonRow(config.buttons),
    ),
  )
