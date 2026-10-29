import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { heading, section } from './section.js'

export const renderProcess = (config) =>
  section(
    config,
    heading(config.heading),
    h(
      'ol',
      { class: 'steps' },
      config.steps.map((step, index) =>
        h(
          'li',
          { class: 'step', ...reveal(index) },
          h('span', { class: 'step-number' }, String(index + 1).padStart(2, '0')),
          h('h3', null, t(step.title)),
          h('p', null, t(step.text)),
        ),
      ),
    ),
  )
