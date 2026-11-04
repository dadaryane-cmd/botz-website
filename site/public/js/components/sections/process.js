import { h } from '../../lib/dom.js'
import { t } from '../../lib/i18n.js'
import { REVEAL } from '../../lib/reveal.js'
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
          { class: 'step', ...REVEAL },
          h('span', { class: 'step-number' }, String(index + 1)),
          h('h3', null, t(step.title)),
          h('p', null, t(step.text)),
        ),
      ),
    ),
  )
