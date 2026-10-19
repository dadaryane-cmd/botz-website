'use client'
import { useId, useMemo, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { track } from '@/lib/client/analytics'
import { setSelection } from '@/lib/client/selection'
import { formatAmd } from '@/lib/format'
import { recommend, type Candidate, type GuideConfig } from '@/lib/guide'
import { durationLabel } from '@/lib/pricing/present'
import type { Catalog } from '@/lib/pricing/types'
import type { Strings } from '@/lib/site'

const fill = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m))

/**
 * "Find my package". Answers live only in component state (this tab) and are
 * never sent anywhere. The recommendation is computed with the editable rules
 * and the published prices, and explains itself.
 */
export function Guide({
  config,
  catalog,
  locale,
  s,
  p,
  contactHref,
  messageTemplate,
  serviceNames,
}: {
  config: GuideConfig
  catalog: Catalog
  locale: Locale
  s: Strings['guide']
  p: Strings['pricing']
  contactHref: string
  /** e.g. “The package finder suggested {package} ({service}).” — pre-fills the contact message. */
  messageTemplate: string
  serviceNames: Strings['services']
}) {
  const id = useId()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const qs = config.questions
  const result = useMemo(() => (done ? recommend(config, catalog, answers) : null), [done, config, catalog, answers])

  if (!qs.length) return null
  const q = qs[step]
  const amd = (n: number) => formatAmd(n, locale)

  const cost = (c: Candidate) => {
    if (c.pkg.category === 'website') return c.total ? `${amd(c.total)} · ${p.oneTime}` : ''
    if (!c.monthly || !c.duration) return p.unavailable
    return fill(s.trueCost, { monthly: amd(c.monthly), n: c.duration, total: amd(c.total ?? 0) })
  }

  const use = (c: Candidate) => {
    // Service and contact person follow the package; the message names the suggestion.
    const note = fill(messageTemplate, { package: c.pkg.name, service: serviceNames[c.pkg.category] ?? c.pkg.category })
    setSelection((x) => ({ ...x, packageKey: c.pkg.key, duration: c.pkg.category === 'website' ? null : c.duration, category: c.pkg.category, note }))
    const form = document.querySelector<HTMLFormElement>('form[data-contact-form]')
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.location.href = contactHref
  }

  if (result) {
    const best = result.best
    return (
      <div className="guide guide-result" aria-live="polite">
        <h3 className="h3">{s.resultTitle}</h3>
        {best ? (
          <div className="guide-best">
            <p className="pkg-cat" style={{ margin: 0 }}>
              {best.pkg.category === 'bundle' ? 'SMM + SEO' : best.pkg.category.toUpperCase()}
            </p>
            <h3>{best.pkg.name}</h3>
            <p className="price-save" style={{ marginTop: 6, display: 'block' }}>
              {cost(best)}
            </p>
            {best.duration && !best.durationAvailable && <p className="small muted">{p.unavailable}</p>}
            <p style={{ margin: '12px 0 0' }}>
              <strong>{s.why}</strong>
            </p>
            <ul className="reasons">
              {best.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="btn-row" style={{ marginTop: 16 }}>
              <button type="button" className="btn" onClick={() => use(best)}>
                {s.usePackage}
              </button>
            </div>
          </div>
        ) : (
          <p className="notice">{s.noMatch}</p>
        )}
        {result.alternatives.length > 0 && (
          <>
            <strong>{s.alternatives}</strong>
            <div className="guide-alt">
              {result.alternatives.map((c) => (
                <article key={c.pkg.key}>
                  <h4 className="h3" style={{ fontSize: '1.3rem' }}>
                    {c.pkg.name}
                  </h4>
                  <p className="small" style={{ margin: '6px 0' }}>
                    {cost(c)}
                  </p>
                  {!c.withinBudget && <p className="small muted">{s.overBudget}</p>}
                  {!c.durationAvailable && result.duration && (
                    <p className="small muted">
                      {p.unavailable} ({durationLabel(p, result.duration)})
                    </p>
                  )}
                  <ul className="reasons small">
                    {c.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={() => use(c)}>
                    {s.usePackage}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
        {result.suggestCustom && <p className="notice">{s.custom}</p>}
        <div className="guide-nav">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setDone(false)
              setStep(0)
              setAnswers({})
            }}
          >
            {s.restart}
          </button>
          <a className="btn" href={contactHref}>
            {s.discuss}
          </a>
        </div>
      </div>
    )
  }

  const answered = Boolean(answers[q.key])
  return (
    <div className="guide">
      <div className="guide-progress" aria-hidden="true">
        <span style={{ width: `${((step + (answered ? 1 : 0)) / qs.length) * 100}%` }} />
      </div>
      <p className="small muted" style={{ marginTop: 0 }}>
        {fill(s.progress, { n: step + 1, total: qs.length })}
      </p>
      <fieldset>
        <legend id={`${id}-q`}>{q.label}</legend>
        {q.help && <p className="muted small">{q.help}</p>}
        <div className="guide-options">
          {q.options.map((o) => (
            <label className="guide-option" key={o.value}>
              <input type="radio" name={`${id}-${q.key}`} value={o.value} checked={answers[q.key] === o.value} onChange={() => setAnswers((a) => ({ ...a, [q.key]: o.value }))} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="guide-nav">
        <button type="button" className="btn btn-secondary" onClick={() => setStep((n) => Math.max(0, n - 1))} disabled={step === 0}>
          {s.back}
        </button>
        {step < qs.length - 1 ? (
          <button type="button" className="btn" onClick={() => setStep((n) => n + 1)} disabled={!answered}>
            {s.next}
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            disabled={!answered}
            onClick={() => {
              setDone(true)
              const r = recommend(config, catalog, answers)
              track('guide_complete', { result: r.best?.pkg.key ?? 'custom', duration: r.duration ?? undefined })
            }}
          >
            {s.seeResult}
          </button>
        )}
      </div>
      <p className="small muted" style={{ marginBottom: 0 }}>
        {s.temporary}
      </p>
    </div>
  )
}
