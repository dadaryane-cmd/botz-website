/** Package finder: one question at a time, then a recommendation with reasons and real cost. */
import { catalog } from '../../content/catalog.js'
import { finder } from '../../content/finder.js'
import { h } from '../../lib/dom.js'
import { formatAmd } from '../../lib/format.js'
import { t, ui } from '../../lib/i18n.js'
import { sectionHref } from '../../lib/page.js'
import { categoryLabel } from '../../pricing/estimate.js'
import { recommend } from '../../pricing/finder.js'
import { getSelection, updateSelection } from '../../pricing/selection.js'
import { heading, lead, section } from './section.js'

const INTRO = -1

export function renderFinder(config) {
  const { questions } = finder
  const answers = {}
  let step = INTRO
  const panel = h('div', { class: 'finder-panel' })

  const show = (next) => {
    step = next
    const content =
      step === INTRO ? intro() : step < questions.length ? question(questions[step]) : result()
    panel.replaceChildren(...content.filter(Boolean))
    panel.querySelector('input:checked, input, .btn-primary')?.focus()
  }

  const intro = () => [
    h(
      'button',
      { type: 'button', class: 'btn btn-primary', onclick: () => show(0) },
      ui('guide', 'start'),
    ),
    h('p', { class: 'muted small' }, ui('guide', 'temporary')),
  ]

  function question(q) {
    const isLast = step === questions.length - 1
    return [
      h(
        'p',
        { class: 'muted small' },
        ui('guide', 'progress', { n: step + 1, total: questions.length }),
      ),
      h(
        'fieldset',
        { class: 'finder-question' },
        h('legend', null, t(q.label)),
        q.help && h('p', { class: 'muted small' }, t(q.help)),
        h(
          'div',
          { class: 'options' },
          q.options.map((option) =>
            h(
              'label',
              { class: 'option' },
              h('input', {
                type: 'radio',
                name: `finder-${q.key}`,
                value: option.value,
                checked: answers[q.key] === option.value,
                // Re-render to reveal "Next"; no auto-advance, so arrow keys still move between options.
                onchange: () => {
                  answers[q.key] = option.value
                  show(step)
                },
              }),
              h('span', null, t(option.label)),
            ),
          ),
        ),
      ),
      h(
        'div',
        { class: 'btn-row' },
        step > 0 &&
          h(
            'button',
            { type: 'button', class: 'btn btn-link', onclick: () => show(step - 1) },
            `← ${ui('guide', 'back')}`,
          ),
        answers[q.key] &&
          h(
            'button',
            { type: 'button', class: 'btn btn-secondary', onclick: () => show(step + 1) },
            ui('guide', isLast ? 'seeResult' : 'next'),
          ),
      ),
    ]
  }

  function result() {
    const { best, alternatives, suggestCustom } = recommend(finder, catalog, answers)
    return [
      h('h3', null, ui('guide', 'resultTitle')),
      best ? recommendation(best) : h('p', null, ui('guide', 'noMatch')),
      alternatives.length > 0 && h('p', { class: 'label' }, ui('guide', 'alternatives')),
      alternatives.length > 0 &&
        h(
          'ul',
          { class: 'alternatives' },
          alternatives.map((c) =>
            h(
              'li',
              null,
              h('strong', null, `${categoryLabel(c.pkg.category)} ${t(c.pkg.name)}`),
              ` — ${costLine(c)}`,
              !c.withinBudget &&
                h('span', { class: 'muted small' }, ` · ${ui('guide', 'overBudget')}`),
            ),
          ),
        ),
      suggestCustom && h('p', { class: 'muted' }, ui('guide', 'custom')),
      h(
        'div',
        { class: 'btn-row' },
        h(
          'a',
          { class: 'btn btn-secondary', href: sectionHref('contact', 'contact.html') },
          ui('guide', 'discuss'),
        ),
        h(
          'button',
          { type: 'button', class: 'btn btn-link', onclick: () => show(0) },
          ui('guide', 'restart'),
        ),
      ),
    ]
  }

  function recommendation(c) {
    const service = ui('services', c.pkg.category)
    const useInEstimate = () =>
      updateSelection({
        packageKey: c.pkg.key,
        months: c.months ?? getSelection().months,
        note: ui('trust', 'finderMessage', { package: t(c.pkg.name), service }),
      })
    return h(
      'div',
      { class: 'card finder-result' },
      h('p', { class: 'badge badge-accent' }, service),
      h('p', { class: 'finder-package' }, t(c.pkg.name)),
      h('p', null, t(c.pkg.tagline)),
      h('p', { class: 'price-small' }, costLine(c)),
      h('p', { class: 'label' }, ui('guide', 'why')),
      h(
        'ul',
        { class: 'check-list' },
        c.reasons.map((reason) => h('li', null, t(reason))),
      ),
      h(
        'a',
        {
          class: 'btn btn-primary',
          href: sectionHref('pricing', 'pricing.html'),
          onclick: useInEstimate,
        },
        ui('guide', 'usePackage'),
      ),
    )
  }

  show(INTRO)
  return section(
    config,
    h(
      'div',
      { class: 'finder' },
      h('div', null, heading(config.heading), lead(config.intro)),
      panel,
    ),
  )
}

function costLine(c) {
  if (c.monthly === null) return `${formatAmd(c.total)} · ${ui('pricing', 'oneTime')}`
  return ui('guide', 'trueCost', {
    monthly: formatAmd(c.monthly),
    n: c.months,
    total: formatAmd(c.total),
  })
}
