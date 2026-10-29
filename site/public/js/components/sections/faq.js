import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { heading, section } from './section.js'

export const renderFaq = (config) =>
  section(
    config,
    heading(config.heading),
    h(
      'div',
      { class: 'faq' },
      config.items.map((item) =>
        h(
          'details',
          { open: Boolean(item.openByDefault) },
          h('summary', null, t(item.question)),
          h('p', null, t(item.answer)),
        ),
      ),
    ),
  )
