/** Package finder: one question at a time, then a recommendation with reasons and real cost. */
import { catalog, finder } from '../../content/index.js'
import { h } from '../../lib/dom.js'
import { formatAmd } from '../../lib/format.js'
import { hasText, t, ui } from '../../lib/i18n.js'
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

  /** The intro, one of the questions, or the result after the last question. */
  const screen = () => {
    if (step === INTRO) return intro()
    if (step < questions.length) return questionScreen(questions[step])
    return result()
  }

  const show = (next) => {
    step = next
    panel.replaceChildren(...screen().filter(Boolean))
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

  function questionScreen(question) {
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
        h('legend', null, t(question.label)),
        hasText(question.help) && h('p', { class: 'muted small' }, t(question.help)),
        h(
          'div',
          { class: 'options' },
          question.options.map((option) =>
            h(
              'label',
              { class: 'option' },
              h('input', {
                type: 'radio',
                name: `finder-${question.key}`,
                value: option.value,
                checked: answers[question.key] === option.value,
                // Re-render to reveal "Next"; no auto-advance, so arrow keys still move between options.
                onchange: () => {
                  answers[question.key] = option.value
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
        answers[question.key] &&
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
      alternatives.length > 0 && alternativeList(alternatives),
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

  function recommendation(candidate) {
    const { pkg } = candidate
    const service = ui('services', pkg.category)
    const useInEstimate = () =>
      updateSelection({
        packageKey: pkg.key,
        months: candidate.months ?? getSelection().months,
        note: ui('trust', 'finderMessage', { package: t(pkg.name), service }),
      })
    return h(
      'div',
      { class: 'card finder-result' },
      h('p', { class: 'badge badge-accent' }, service),
      h('p', { class: 'finder-package' }, t(pkg.name)),
      h('p', null, t(pkg.tagline)),
      h('p', { class: 'price-small' }, costLine(candidate)),
      h('p', { class: 'label' }, ui('guide', 'why')),
      h(
        'ul',
        { class: 'check-list' },
        candidate.reasons.map((reason) => h('li', null, t(reason))),
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

/** Other packages worth a look, with a note when they are over the stated budget. */
function alternativeList(alternatives) {
  return [
    h('p', { class: 'label' }, ui('guide', 'alternatives')),
    h(
      'ul',
      { class: 'alternatives' },
      alternatives.map((candidate) =>
        h(
          'li',
          null,
          h('strong', null, `${categoryLabel(candidate.pkg.category)} ${t(candidate.pkg.name)}`),
          ` — ${costLine(candidate)}`,
          !candidate.withinBudget &&
            h('span', { class: 'muted small' }, ` · ${ui('guide', 'overBudget')}`),
        ),
      ),
    ),
  ]
}

/** "420,000 ֏ per month × 6 = 2,520,000 ֏", or the one-time price. */
function costLine(candidate) {
  if (candidate.monthly === null) {
    return `${formatAmd(candidate.total)} · ${ui('pricing', 'oneTime')}`
  }
  return ui('guide', 'trueCost', {
    monthly: formatAmd(candidate.monthly),
    n: candidate.months,
    total: formatAmd(candidate.total),
  })
}
