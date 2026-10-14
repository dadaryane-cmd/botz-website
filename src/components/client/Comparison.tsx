'use client'
import { Fragment } from 'react'
import type { Locale } from '@/i18n/config'
import { formatAmd } from '@/lib/format'
import { findPackage, isRecurring, priceLine, resolveFeatures } from '@/lib/pricing/engine'
import { durationLabel, featureValue, groupLabel, type PricingStrings } from '@/lib/pricing/present'
import type { Catalog, Duration, ResolvedFeature } from '@/lib/pricing/types'

type CompareStrings = { title: string; feature: string; price: string; total: string; savings: string; empty: string; legend: string }

const groupsOrder = ['scope', 'setup', 'content', 'platforms', 'production', 'ads', 'reporting', 'support', 'delivery']

/**
 * Side-by-side comparison driven by the same catalog and pricing functions as
 * the cards. Text labels and symbols (✓ / — / ?) carry meaning, never colour alone.
 */
export function Comparison({
  catalog,
  keys,
  duration,
  locale,
  s,
  c,
}: {
  catalog: Catalog
  keys: string[]
  duration: Duration
  locale: Locale
  s: PricingStrings
  c: CompareStrings
}) {
  const pkgs = keys.map((k) => findPackage(catalog, k)).filter(Boolean) as NonNullable<ReturnType<typeof findPackage>>[]
  if (pkgs.length < 2) return <p className="muted">{c.empty}</p>

  const resolved = new Map(pkgs.map((p) => [p.key, new Map(resolveFeatures(catalog, p.key).map((f) => [f.featureKey, f]))]))
  const featureKeys = catalog.features
    .filter((d) => d.compare && pkgs.some((p) => resolved.get(p.key)!.has(d.key)))
    .sort((a, b) => groupsOrder.indexOf(a.group) - groupsOrder.indexOf(b.group) || a.order - b.order)
  const groups = groupsOrder
    .map((g) => ({ g, defs: featureKeys.filter((d) => d.group === g) }))
    .filter((x) => x.defs.length)

  const priceCells = pkgs.map((p) => {
    if (!isRecurring(p)) {
      const v = p.oneTimePrice ? formatAmd(p.oneTimePrice, locale) : '—'
      return { price: `${v} · ${s.oneTime}`, total: v, savings: '—' }
    }
    const line = priceLine(p, duration)
    if (!line) return { price: s.unavailable, total: '—', savings: '—' }
    return {
      price: `${formatAmd(line.monthly, locale)} ${s.perMonth}`,
      total: formatAmd(line.recurringTotal, locale),
      savings: line.savings > 0 ? formatAmd(line.savings, locale) : '—',
    }
  })

  const cell = (f: ResolvedFeature | undefined) => {
    if (!f) return <span className="cmp-unspec">? {s.notSpecified}</span>
    const v = featureValue(f, s, catalog)
    if (v.kind === 'yes') return <span className="cmp-yes">{v.text}</span>
    if (v.kind === 'no') return <span className="cmp-no">— {v.text}</span>
    if (v.kind === 'replaced') return <span className="cmp-unspec">↳ {v.text}</span>
    return <span className="cmp-unspec">? {v.text}</span>
  }

  const anyFeatures = groups.length > 0
  const termLabel = durationLabel(s, duration)

  return (
    <div className="compare" aria-live="polite">
      <h3 className="h3" style={{ marginBottom: 12 }}>
        {c.title} · {termLabel}
      </h3>
      <div className="compare-desktop compare-scroll">
        <table className="compare-table">
          <caption>{c.legend}</caption>
          <thead>
            <tr>
              <th scope="col">{c.feature}</th>
              {pkgs.map((p) => (
                <th scope="col" key={p.key}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{c.price}</th>
              {priceCells.map((pc, i) => (
                <td key={i}>
                  <b>{pc.price}</b>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">{c.total}</th>
              {priceCells.map((pc, i) => (
                <td key={i}>{pc.total}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">{c.savings}</th>
              {priceCells.map((pc, i) => (
                <td key={i}>{pc.savings}</td>
              ))}
            </tr>
            {!anyFeatures && (
              <tr>
                <td colSpan={pkgs.length + 1}>{s.scopeInProposal}</td>
              </tr>
            )}
            {groups.map(({ g, defs }) => (
              <Fragment key={g}>
                <tr className="grp">
                  <th scope="rowgroup" colSpan={pkgs.length + 1}>
                    {groupLabel(s, g)}
                  </th>
                </tr>
                {defs.map((d) => (
                  <tr key={d.key}>
                    <th scope="row">{d.label}</th>
                    {pkgs.map((p) => (
                      <td key={p.key}>{cell(resolved.get(p.key)!.get(d.key))}</td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="compare-mobile compare-cards">
        <p className="muted small">{c.legend}</p>
        <article>
          <h4>{c.price}</h4>
          <dl>
            {pkgs.map((p, i) => (
              <Fragment key={p.key}>
                <dt>{p.name}</dt>
                <dd>
                  {priceCells[i].price}
                  <br />
                  <span className="muted small">
                    {c.total}: {priceCells[i].total} · {c.savings}: {priceCells[i].savings}
                  </span>
                </dd>
              </Fragment>
            ))}
          </dl>
        </article>
        {!anyFeatures && <p className="muted">{s.scopeInProposal}</p>}
        {groups.flatMap(({ defs }) =>
          defs.map((d) => (
            <article key={d.key}>
              <h4>{d.label}</h4>
              <dl>
                {pkgs.map((p) => (
                  <Fragment key={p.key}>
                    <dt>{p.name}</dt>
                    <dd>{cell(resolved.get(p.key)!.get(d.key))}</dd>
                  </Fragment>
                ))}
              </dl>
            </article>
          )),
        )}
      </div>
    </div>
  )
}
