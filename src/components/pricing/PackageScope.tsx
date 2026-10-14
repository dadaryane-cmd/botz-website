import { findPackage, resolveBoundaries, resolveFeatures } from '@/lib/pricing/engine'
import { featureValue, groupLabel, type PricingStrings } from '@/lib/pricing/present'
import type { Catalog } from '@/lib/pricing/types'

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m)

/** Full, structured inclusion list for one package (inheritance and bundle components resolved). */
export function PackageScope({ catalog, pkgKey, s }: { catalog: Catalog; pkgKey: string; s: PricingStrings }) {
  const pkg = findPackage(catalog, pkgKey)
  if (!pkg) return null
  const features = resolveFeatures(catalog, pkgKey).filter((f) => f.status !== 'not_specified')
  const boundaries = resolveBoundaries(catalog, pkgKey)
  if (!features.length && !boundaries.length) return <p className="muted small">{s.scopeInProposal}</p>

  const groups = new Map<string, typeof features>()
  for (const f of features) {
    const g = f.def?.group ?? 'delivery'
    groups.set(g, [...(groups.get(g) ?? []), f])
  }
  const parent = pkg.inherits ? findPackage(catalog, pkg.inherits) : undefined
  const comps = (pkg.components ?? []).map((k) => findPackage(catalog, k)?.name).filter(Boolean) as string[]

  return (
    <div>
      {pkg.summary && <p style={{ margin: '8px 0 0' }}>{pkg.summary}</p>}
      {parent && <p className="small muted">{fill(s.everythingIn, { name: parent.name })}</p>}
      {comps.length > 0 && <p className="small muted">{fill(s.bundleOf, { list: comps.join(' + ') })}</p>}
      {Array.from(groups.entries()).map(([g, list]) => (
        <div className="feature-group" key={g}>
          <h4>{groupLabel(s, g)}</h4>
          <ul className="feature-list">
            {list.map((f) => {
              const v = featureValue(f, s, catalog)
              const cls = v.kind === 'no' ? 'is-no' : v.kind === 'yes' ? '' : 'is-unspec'
              const icon = v.kind === 'yes' ? '✓' : v.kind === 'no' ? '—' : '↳'
              return (
                <li key={f.featureKey} className={cls}>
                  <span className="fi" aria-hidden="true">
                    {icon}
                  </span>
                  <span>
                    <span className="f-label">{f.def?.label ?? f.featureKey}</span>
                    {': '}
                    <span>{v.text}</span>
                    {f.overridesInherited && v.kind === 'yes' && <span className="f-up">↑ {s.changedFrom}</span>}
                    {f.detail && <span className="f-detail">{f.detail}</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      {boundaries.length > 0 && (
        <div className="boundaries">
          <strong>{s.boundaries}</strong>
          <ul>
            {boundaries.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
