import { h } from '../../lib/dom.js'
import { t, ui } from '../../lib/i18n.js'
import { reveal } from '../../lib/reveal.js'
import { heading, lead, section } from './section.js'

/** Example deliverables (PDFs in /downloads). */
export const renderSamples = (config) =>
  section(
    config,
    heading(config.heading),
    lead(config.intro),
    h('div', { class: 'grid grid-3' }, config.items.map(sampleCard)),
    h('p', { class: 'muted small' }, ui('trust', 'sampleNote')),
  )

const sampleCard = (item, index) =>
  h(
    'article',
    { class: 'card sample-card', ...reveal(index) },
    h('span', { class: 'badge' }, ui('trust', 'sampleLabel')),
    h('h3', null, t(item.title)),
    h('p', null, t(item.text)),
    h(
      'div',
      { class: 'btn-row' },
      h(
        'a',
        {
          class: 'btn btn-secondary btn-small',
          href: item.file,
          target: '_blank',
          rel: 'noopener',
        },
        ui('trust', 'preview'),
      ),
      h(
        'a',
        { class: 'btn btn-link btn-small', href: item.file, download: true },
        ui('trust', 'download'),
      ),
    ),
  )
