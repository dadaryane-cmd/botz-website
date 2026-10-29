/*
 * Package finder: six questions, then a suggested package with the reasons and the real cost.
 * Scoring is transparent — every matching rule adds points and its reason to a package.
 */
(function () {
  'use strict'

  const B = window.BOTZ
  const { h, tr, ui, amd } = B

  function recommend(answers) {
    const { questions, rules } = B.data.guide
    const durationQ = questions.find((q) => q.role === 'duration')
    const budgetQ = questions.find((q) => q.role === 'budget')
    const months = durationQ.options.find((o) => o.value === answers[durationQ.key])?.months ?? null
    const budgetMax = budgetQ.options.find((o) => o.value === answers[budgetQ.key])?.budgetMax ?? null

    const scores = new Map()
    for (const rule of rules) {
      if (!rule.when.every((c) => c.values.includes(answers[c.question]))) continue
      const entry = scores.get(rule.packageKey) || { score: 0, reasons: [] }
      entry.score += rule.points
      entry.reasons.push(rule.reason)
      scores.set(rule.packageKey, entry)
    }

    const candidates = [...scores].map(([key, { score, reasons }]) => {
      const pkg = B.findPackage(key)
      if (!B.isRecurring(pkg)) return { pkg, score, reasons, duration: null, monthly: null, total: pkg.oneTimePrice, withinBudget: true, durationAvailable: true }
      const avail = B.availableDurations(pkg)
      const durationAvailable = !months || avail.includes(months)
      // If the preferred term is unavailable, show the longest shorter term so the true cost is visible.
      const duration = durationAvailable ? months || avail[0] : avail.filter((d) => d <= months).pop() || avail[0]
      const line = B.priceLine(pkg, duration)
      const withinBudget = budgetMax === null || line.monthly <= budgetMax
      return { pkg, score, reasons, duration, monthly: line.monthly, total: line.total, withinBudget, durationAvailable }
    })

    candidates.sort(
      (a, b) =>
        b.withinBudget - a.withinBudget ||
        b.durationAvailable - a.durationAvailable ||
        b.score - a.score ||
        (a.monthly ?? a.total) - (b.monthly ?? b.total),
    )
    const best = candidates.find((c) => c.withinBudget && c.durationAvailable) || null
    return { best, alternatives: candidates.filter((c) => c !== best).slice(0, 2), suggestCustom: !best || candidates.every((c) => !c.withinBudget) }
  }

  B.blocks.guide = (block) => {
    const questions = B.data.guide.questions
    let step = -1 // -1 = intro, questions.length = result
    const answers = {}
    const panel = h('div', { class: 'guide-panel' })

    const go = (next) => {
      step = next
      panel.replaceChildren(...screen())
      panel.querySelector('input:checked, input, button.btn-primary')?.focus()
    }

    function screen() {
      if (step < 0) return [h('button', { type: 'button', class: 'btn btn-primary', onclick: () => go(0) }, ui('guide', 'start')), h('p', { class: 'muted small' }, ui('guide', 'temporary'))]
      if (step >= questions.length) return result()

      const q = questions[step]
      const name = 'guide-' + q.key
      return [
        h('p', { class: 'muted small' }, ui('guide', 'progress', { n: step + 1, total: questions.length })),
        h(
          'fieldset',
          { class: 'guide-question' },
          h('legend', null, tr(q.label)),
          q.help ? h('p', { class: 'muted small' }, tr(q.help)) : null,
          h(
            'div',
            { class: 'options' },
            q.options.map((o) =>
              h(
                'label',
                { class: 'option' },
                h('input', {
                  type: 'radio',
                  name,
                  value: o.value,
                  checked: answers[q.key] === o.value,
                  onchange: () => {
                    answers[q.key] = o.value
                    go(step) // show the Next button; no auto-advance, so arrow keys keep working
                  },
                }),
                h('span', null, tr(o.label)),
              ),
            ),
          ),
        ),
        h(
          'div',
          { class: 'btn-row' },
          step > 0 ? h('button', { type: 'button', class: 'btn btn-link', onclick: () => go(step - 1) }, '← ', ui('guide', 'back')) : null,
          answers[q.key] ? h('button', { type: 'button', class: 'btn btn-secondary', onclick: () => go(step + 1) }, step === questions.length - 1 ? ui('guide', 'seeResult') : ui('guide', 'next')) : null,
        ),
      ]
    }

    function costLine(c) {
      if (!c.monthly) return `${amd(c.total)} · ${ui('pricing', 'oneTime')}`
      return ui('guide', 'trueCost', { monthly: amd(c.monthly), n: c.duration, total: amd(c.total) })
    }

    function result() {
      const r = recommend(answers)
      const out = [h('h3', null, ui('guide', 'resultTitle'))]
      if (r.best) {
        const c = r.best
        const service = ui('services', c.pkg.category)
        out.push(
          h(
            'div',
            { class: 'card guide-result' },
            h('p', { class: 'badge badge-accent' }, service),
            h('p', { class: 'guide-name' }, tr(c.pkg.name)),
            h('p', null, tr(c.pkg.tagline)),
            h('p', { class: 'price-small' }, costLine(c)),
            h('p', { class: 'label' }, ui('guide', 'why')),
            h('ul', { class: 'check-list' }, c.reasons.map((reason) => h('li', null, tr(reason)))),
            h(
              'a',
              {
                class: 'btn btn-primary',
                href: B.hasAnchor('pricing') ? '#pricing' : 'pricing.html#pricing',
                onclick: () =>
                  B.setSelection({
                    packageKey: c.pkg.key,
                    duration: c.duration || B.selection().duration,
                    note: ui('trust', 'finderMessage', { package: tr(c.pkg.name), service }),
                  }),
              },
              ui('guide', 'usePackage'),
            ),
          ),
        )
      } else {
        out.push(h('p', null, ui('guide', 'noMatch')))
      }
      if (r.alternatives.length) {
        out.push(
          h('p', { class: 'label' }, ui('guide', 'alternatives')),
          h(
            'ul',
            { class: 'alt-list' },
            r.alternatives.map((c) =>
              h('li', null, h('strong', null, `${ui('pricing', 'cat_' + c.pkg.category)} ${tr(c.pkg.name)}`), ' — ', costLine(c), c.withinBudget ? null : h('span', { class: 'muted small' }, ' · ', ui('guide', 'overBudget'))),
            ),
          ),
        )
      }
      if (r.suggestCustom) out.push(h('p', { class: 'muted' }, ui('guide', 'custom')))
      out.push(
        h(
          'div',
          { class: 'btn-row' },
          h('a', { class: 'btn btn-secondary', href: B.hasAnchor('contact') ? '#contact' : 'contact.html#contact' }, ui('guide', 'discuss')),
          h('button', { type: 'button', class: 'btn btn-link', onclick: () => go(0) }, ui('guide', 'restart')),
        ),
      )
      return out
    }

    panel.append(...screen())
    return B.section(block, h('div', { class: 'guide' }, h('div', null, B.heading(block.heading), block.intro ? h('p', { class: 'lead' }, tr(block.intro)) : null), panel))
  }
})()
