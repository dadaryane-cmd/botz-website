import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { heading, lead, section } from './section.js'

/** Large statement on one side, explanation and key points on the other. */
export const renderSplit = (config) =>
  section(
    config,
    h(
      'div',
      { class: 'split' },
      h('div', null, heading(config.statement)),
      h(
        'div',
        null,
        lead(config.body),
        config.points?.length > 0 &&
          h(
            'ul',
            { class: 'points' },
            config.points.map((point) =>
              h('li', null, h('strong', null, t(point.title)), h('span', null, t(point.text))),
            ),
          ),
      ),
    ),
  )
