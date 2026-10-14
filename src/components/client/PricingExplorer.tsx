'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { track } from '@/lib/client/analytics'
import { setSelection, useSelection } from '@/lib/client/selection'
import { routeContacts, type ContactInfo } from '@/lib/contact'
import { formatAmd, formatDate, formatNumber } from '@/lib/format'
import {
  availableDurations,
  findAddon,
  findPackage,
  includedQuantity,
  isDuration,
  isRecurring,
  maxSavings,
  packagesIn,
  priceLine,
  quote,
  visibleAddons,
} from '@/lib/pricing/engine'
import { durationLabel } from '@/lib/pricing/present'
import {
  DURATIONS,
  type Addon,
  type Catalog,
  type Category,
  type Duration,
  type Pkg,
} from '@/lib/pricing/types'
import type { Strings } from '@/lib/site'
import { whatsappHref, whatsappMessage } from '@/lib/whatsapp'
import { PackageScope } from '../pricing/PackageScope'
import { AnimatedNumber } from './AnimatedNumber'
import { Comparison } from './Comparison'

export type PricingUiStrings = Pick<
  Strings,
  'pricing' | 'compare' | 'services' | 'contact' | 'whatsapp'
>

type Props = {
  catalog: Catalog
  locale: Locale
  strings: PricingUiStrings
  contacts: ContactInfo
  defaultCategory: Category
  defaultDuration: Duration
  lockCategory: boolean
  showAddons: boolean
  showComparison: boolean
  showTerms: boolean
  shareEnabled: boolean
  contactHref: string
}

const fill = (t: string, v: Record<string, string | number>) =>
  t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? String(v[k]) : m))
const CATEGORIES: Category[] = ['smm', 'seo', 'bundle', 'website', 'addon']

export function PricingExplorer(props: Props) {
  const {
    catalog,
    locale,
    strings,
    contacts,
    lockCategory,
    showAddons,
    showComparison,
    showTerms,
    shareEnabled,
  } = props
  const s = strings.pricing
  const id = useId()
  const router = useRouter()
  const selection = useSelection()
  const amd = (n: number) => formatAmd(n, locale)

  const categories = CATEGORIES.filter((c) =>
    c === 'addon' ? catalog.addons.some((a) => a.visible) : packagesIn(catalog, c).length,
  )
  const [categoryChoice, setCategoryChoice] = useState<Category | null>(null)
  const [durationChoice, setDurationChoice] = useState<Duration | null>(null)
  const [compare, setCompare] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [share, setShare] = useState<{
    url?: string
    expiresAt?: string
    error?: boolean
    busy?: boolean
  }>({})
  const initialised = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const estimateRef = useRef<HTMLElement>(null)
  // Phones: a compact estimate bar while the cards are on screen but the estimate panel is not.
  const [floatVisible, setFloatVisible] = useState(false)
  useEffect(() => {
    if (!('IntersectionObserver' in window) || !rootRef.current || !estimateRef.current) return
    let inRoot = false
    let estimateSeen = false
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === rootRef.current) inRoot = e.isIntersecting
        else estimateSeen = e.isIntersecting
      }
      setFloatVisible(inRoot && !estimateSeen)
    })
    io.observe(rootRef.current)
    io.observe(estimateRef.current)
    return () => io.disconnect()
  }, [])
  const selectedPkg = selection.packageKey ? findPackage(catalog, selection.packageKey) : undefined

  // Until the visitor picks a filter or term here, follow their current selection
  // (from the guide, a recalculation link or another section of the site).
  const category: Category =
    categoryChoice ?? (!lockCategory && selectedPkg ? selectedPkg.category : props.defaultCategory)
  const duration: Duration =
    durationChoice ?? (isDuration(selection.duration) ? selection.duration : props.defaultDuration)

  // A recalculation link (?pkg=&d=&addons=key:qty) loads that selection into the shared store.
  useEffect(() => {
    if (initialised.current) return
    initialised.current = true
    const q = new URLSearchParams(window.location.search)
    const pkg = q.get('pkg') ? findPackage(catalog, q.get('pkg')) : undefined
    const d = Number(q.get('d'))
    const addons = (q.get('addons') ?? '')
      .split(',')
      .filter(Boolean)
      .map((x) => {
        const [key, qty] = x.split(':')
        return { key, qty: Math.max(1, Math.min(20, Number(qty) || 1)) }
      })
      .filter((a) => findAddon(catalog, a.key))
    if (!pkg && !addons.length) return
    const dur = isDuration(d) ? d : props.defaultDuration
    setSelection({
      packageKey: pkg?.key ?? null,
      duration: pkg && isRecurring(pkg) ? dur : null,
      addons,
      category: pkg?.category ?? 'addon',
    })
  }, [catalog, props.defaultDuration])

  const list = category === 'addon' ? [] : packagesIn(catalog, category)
  const recurring = category !== 'website' && category !== 'addon'
  const q = useMemo(() => quote(catalog, selection), [catalog, selection])

  function changeDuration(d: Duration) {
    setDurationChoice(d)
    track('duration_change', { duration: d, category })
    if (selectedPkg && isRecurring(selectedPkg)) {
      if (priceLine(selectedPkg, d)) setSelection((x) => ({ ...x, duration: d }))
      else {
        // The selected package does not exist for this term: unselect and say why.
        setSelection((x) => ({ ...x, packageKey: null, duration: null }))
        setNote(`${selectedPkg.name}: ${s.unavailable} (${durationLabel(s, d)})`)
      }
    }
  }

  function choose(pkg: Pkg) {
    setNote('')
    if (selection.packageKey === pkg.key) {
      setSelection((x) => ({ ...x, packageKey: null, duration: null }))
      return
    }
    if (isRecurring(pkg) && !priceLine(pkg, duration)) return
    setSelection((x) => ({
      ...x,
      packageKey: pkg.key,
      duration: isRecurring(pkg) ? duration : null,
      category: pkg.category,
    }))
    track('package_view', {
      package: pkg.key,
      category: pkg.category,
      duration: isRecurring(pkg) ? duration : undefined,
    })
  }

  function toggleCompare(key: string) {
    if (compare.includes(key)) return setCompare(compare.filter((k) => k !== key))
    if (compare.length >= 3) return setNote(s.compareLimit)
    const next = [...compare, key]
    setCompare(next)
    if (next.length >= 2) track('package_compare', { packages: next.join(','), duration })
  }

  function setAddonQty(addon: Addon, qty: number) {
    setSelection((x) => {
      const rest = (x.addons ?? []).filter((a) => a.key !== addon.key)
      return {
        ...x,
        addons: qty > 0 ? [...rest, { key: addon.key, qty: Math.min(20, qty) }] : rest,
        category: x.category ?? 'addon',
      }
    })
  }

  const routed = routeContacts(
    contacts,
    selectedPkg?.category ?? (category === 'addon' ? null : category),
    selectedPkg?.contact ?? null,
  )
  const person = routed.length === 1 ? routed[0] : null
  const waText = whatsappMessage({
    strings: { whatsapp: strings.whatsapp, pricing: s, services: strings.services },
    locale,
    contactName: person?.name ?? routed.map((p) => p.name).join(' / '),
    service: selectedPkg?.category ?? category,
    catalog,
    selection,
  })

  async function createShare() {
    setShare({ busy: true })
    try {
      const res = await fetch('/api/estimates/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          selection: {
            packageKey: selection.packageKey ?? null,
            duration: selection.duration ?? null,
            addons: selection.addons ?? [],
          },
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.code)
      const url = `${window.location.origin}${data.url}`
      setShare({ url, expiresAt: data.expiresAt })
      setSelection((x) => ({ ...x, estimateToken: data.url.split('/').pop() }))
      track('estimate_created', {
        package: selection.packageKey ?? undefined,
        duration: selection.duration ?? undefined,
      })
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        // clipboard not available; the link is shown on screen
      }
    } catch {
      setShare({ error: true })
    }
  }

  function requestProposal() {
    const form = document.querySelector<HTMLFormElement>('form[data-contact-form]')
    if (form) {
      form.scrollIntoView({
        behavior: document.documentElement.dataset.motion === 'off' ? 'auto' : 'smooth',
        block: 'start',
      })
      window.setTimeout(
        () => form.querySelector<HTMLElement>('input,textarea')?.focus({ preventScroll: true }),
        400,
      )
    } else router.push(props.contactHref)
  }

  const hasSelection = Boolean(selection.packageKey || selection.addons?.length)
  const showTotal = hasSelection && q.errors.length === 0 && q.combinedTotal > 0
  // While the catalog publishes no detailed scopes, say so once instead of an empty toggle on every card.
  const noScope = catalog.packages.every((p) => !p.features.length && !p.boundaries.length)
  const goToEstimate = () =>
    estimateRef.current?.scrollIntoView({
      behavior: document.documentElement.dataset.motion === 'off' ? 'auto' : 'smooth',
      block: 'start',
    })
  const addonsShown =
    category === 'addon'
      ? visibleAddons(catalog)
      : showAddons
        ? visibleAddons(catalog, category)
        : []

  return (
    <div className="pricing" ref={rootRef}>
      <div className="pricing-sticky">
        <div className="pricing-controls">
          {!lockCategory && categories.length > 1 ? (
            <fieldset className="seg">
              <legend>{s.filterLabel}</legend>
              <div className="seg-options">
                {categories.map((c) => (
                  <label key={c}>
                    <input
                      type="radio"
                      name={`${id}-cat`}
                      value={c}
                      checked={category === c}
                      onChange={() => {
                        setCategoryChoice(c)
                        setCompare([])
                        setNote('')
                      }}
                    />
                    <span>{(s as Record<string, string>)[`cat_${c}`] ?? c}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <span />
          )}
          {recurring && (
            <fieldset className="seg">
              <legend>{s.durationLabel}</legend>
              <div className="seg-options">
                {DURATIONS.map((d) => (
                  <label key={d}>
                    <input
                      type="radio"
                      name={`${id}-dur`}
                      value={d}
                      checked={duration === d}
                      onChange={() => changeDuration(d)}
                    />
                    <span>{durationLabel(s, d)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
        {showTotal && (
          <button type="button" className="est-pill" onClick={goToEstimate}>
            {s.estimateTitle}:{' '}
            <b>
              {q.isMinimum ? `${s.from} ` : ''}
              {amd(q.combinedTotal)}
            </b>{' '}
            <span aria-hidden="true">↓</span>
          </button>
        )}
      </div>
      <p className={`live-note${note ? ' has-note' : ''}`} role="status" aria-live="polite">
        {note}
      </p>
      {noScope && list.length > 0 && <p className="scope-note">{s.scopeInProposal}</p>}

      {list.length > 0 && (
        <div className="pkg-grid">
          {list.map((pkg) => (
            <PackageCard
              key={pkg.key}
              pkg={pkg}
              catalog={catalog}
              duration={duration}
              locale={locale}
              s={s}
              selected={selection.packageKey === pkg.key}
              comparing={compare.includes(pkg.key)}
              showCompare={showComparison && list.length > 1}
              onChoose={() => choose(pkg)}
              onCompare={() => toggleCompare(pkg.key)}
              showScope={!noScope}
              amd={amd}
            />
          ))}
        </div>
      )}

      {showComparison && compare.length >= 2 && (
        <>
          <div className="compare-tray">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setCompare([])}
            >
              {s.clear}
            </button>
          </div>
          <Comparison
            catalog={catalog}
            keys={compare}
            duration={duration}
            locale={locale}
            s={s}
            c={strings.compare}
          />
        </>
      )}
      {showComparison && compare.length === 1 && (
        <p className="muted small">{strings.compare.empty}</p>
      )}

      {addonsShown.length > 0 && (
        <section className="addon-section" aria-labelledby={`${id}-addons`}>
          <h3 id={`${id}-addons`} className="h3">
            {s.addonsTitle}
          </h3>
          <p className="muted">{s.addonsIntro}</p>
          <div className="addon-grid">
            {addonsShown.map((a) => {
              const qty = selection.addons?.find((x) => x.key === a.key)?.qty ?? 0
              const included = a.relatedFeatureKey
                ? includedQuantity(catalog, selection.packageKey, a.relatedFeatureKey)
                : 0
              const def = catalog.features.find((f) => f.key === a.relatedFeatureKey)
              return (
                <article key={a.key} className={`addon-card${qty ? ' is-selected' : ''}`}>
                  <h4>{a.name}</h4>
                  {a.description && <p>{a.description}</p>}
                  <div className="addon-price">
                    {a.priceIsFrom && <span className="small muted">{s.from} </span>}
                    {amd(a.price)}
                  </div>
                  {a.units && a.units > 1 && (
                    <span className="small muted">
                      {fill(s.bundleUnits, { n: a.units })} ·{' '}
                      {fill(s.eachPrice, { price: amd(Math.round(a.price / a.units)) })}
                    </span>
                  )}
                  {included > 0 && (
                    <p className="addon-note">
                      {fill(s.alreadyIncluded, { qty: included, unit: def?.unit ?? '' })}
                    </p>
                  )}
                  <div className="pkg-actions">
                    {qty === 0 ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setAddonQty(a, 1)}
                      >
                        {s.add} <span className="sr-only">{a.name}</span>
                      </button>
                    ) : (
                      <div className="stepper" role="group" aria-label={`${s.quantity}: ${a.name}`}>
                        <button
                          type="button"
                          onClick={() => setAddonQty(a, qty - 1)}
                          aria-label={`${s.remove} 1`}
                        >
                          −
                        </button>
                        <output aria-live="polite">{qty}</output>
                        <button
                          type="button"
                          onClick={() => setAddonQty(a, qty + 1)}
                          aria-label={`${s.add} 1`}
                          disabled={qty >= 20}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <section
        className="estimate"
        ref={estimateRef}
        aria-labelledby={`${id}-est`}
        aria-live="polite"
      >
        <div>
          <h3 id={`${id}-est`}>{s.estimateTitle}</h3>
          {!hasSelection ? (
            <p className="muted">{s.noSelection}</p>
          ) : (
            <table className="est-table">
              <tbody>
                {q.recurring && selectedPkg && (
                  <>
                    <tr className="est-section">
                      <th colSpan={2}>{s.recurringFees}</th>
                    </tr>
                    <tr>
                      <th scope="row">
                        {strings.services[selectedPkg.category]} · {selectedPkg.name}
                        <br />
                        <span className="muted small">
                          <AnimatedNumber value={q.recurring.monthly} format={amd} /> {s.perMonth} ×{' '}
                          {q.recurring.months}
                        </span>
                      </th>
                      <td>
                        <AnimatedNumber value={q.recurring.recurringTotal} format={amd} />
                      </td>
                    </tr>
                    {q.recurring.savings > 0 && (
                      <tr>
                        <th scope="row" className="muted">
                          {fill(s.youSave, { amount: '' }).trim()}
                        </th>
                        <td className="price-save">
                          <AnimatedNumber value={q.recurring.savings} format={amd} />
                        </td>
                      </tr>
                    )}
                  </>
                )}
                {(q.oneTimePackage || q.addons.length > 0) && (
                  <tr className="est-section">
                    <th colSpan={2}>{s.oneTimeFees}</th>
                  </tr>
                )}
                {q.oneTimePackage && selectedPkg && (
                  <tr>
                    <th scope="row">{selectedPkg.name}</th>
                    <td>{amd(q.oneTimePackage)}</td>
                  </tr>
                )}
                {q.addons.map((a) => (
                  <tr key={a.key}>
                    <th scope="row">
                      {findAddon(catalog, a.key)?.name} {a.qty > 1 ? `× ${a.qty}` : ''}
                    </th>
                    <td>
                      {a.priceIsFrom ? `${s.from} ` : ''}
                      {amd(a.total)}
                    </td>
                  </tr>
                ))}
                <tr className="est-total">
                  <th scope="row">{s.combinedEstimate}</th>
                  <td>
                    {q.isMinimum ? `${s.from} ` : ''}
                    <AnimatedNumber value={q.combinedTotal} format={amd} />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="est-actions">
          <button type="button" className="btn" onClick={requestProposal}>
            {s.requestProposal}
          </button>
          <a
            className="btn btn-secondary"
            href={whatsappHref(person?.whatsappNumber ?? contacts.whatsappNumber, waText)}
            target="_blank"
            rel="noopener noreferrer"
            data-contact={person?.key ?? 'either'}
          >
            {s.discussWhatsapp}
          </a>
          {shareEnabled && hasSelection && q.errors.length === 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={createShare}
              disabled={share.busy}
            >
              {s.shareEstimate}
            </button>
          )}
          {share.url && (
            <p className="share-result" role="status">
              {fill(s.shareCopied, {
                date: share.expiresAt ? formatDate(share.expiresAt, locale) : '',
              })}
              <br />
              <a href={share.url}>{share.url}</a>
            </p>
          )}
          {share.error && (
            <p className="share-result" role="alert">
              {s.shareFailed}
            </p>
          )}
          {q.isMinimum && <p className="est-note">{s.minimumNote}</p>}
          <p className="est-note">{s.notContract}</p>
        </div>
      </section>

      {showTotal && (
        <button
          type="button"
          className={`est-float${floatVisible ? ' is-visible' : ''}`}
          onClick={goToEstimate}
          tabIndex={floatVisible ? 0 : -1}
          aria-hidden={!floatVisible}
        >
          <span>{s.estimateTitle}</span>
          <b>
            {q.isMinimum ? `${s.from} ` : ''}
            {amd(q.combinedTotal)} ↓
          </b>
        </button>
      )}
      {showTerms && catalog.terms.length > 0 && (
        <details className="terms">
          <summary>{s.termsTitle}</summary>
          <ul>
            {catalog.terms.map((t, i) => (
              <li key={i}>{t.text}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

function PackageCard({
  pkg,
  catalog,
  duration,
  locale,
  s,
  selected,
  comparing,
  showCompare,
  onChoose,
  onCompare,
  showScope,
  amd,
}: {
  pkg: Pkg
  catalog: Catalog
  duration: Duration
  locale: Locale
  s: Strings['pricing']
  selected: boolean
  comparing: boolean
  showCompare: boolean
  onChoose: () => void
  onCompare: () => void
  showScope: boolean
  amd: (n: number) => string
}) {
  const line = isRecurring(pkg) ? priceLine(pkg, duration) : null
  const unavailable = isRecurring(pkg) && !line
  const best = maxSavings(pkg)
  const avail = availableDurations(pkg)
  const headingId = `pkg-${pkg.key}`
  const [opened, setOpened] = useState(false)
  return (
    <article
      className={`pkg-card${pkg.recommended ? ' is-recommended' : ''}${selected ? ' is-selected' : ''}${unavailable ? ' is-unavailable' : ''}`}
      aria-labelledby={headingId}
    >
      <div className="pkg-top">
        <span className="pkg-cat">
          {pkg.category === 'bundle' ? 'SMM + SEO' : pkg.category.toUpperCase()}
        </span>
        {(pkg.badge || pkg.recommended) && (
          <span className="chip">{pkg.badge || s.recommended}</span>
        )}
      </div>
      <h3 id={headingId} className="display pkg-name">
        {pkg.name}
      </h3>
      {pkg.tagline && <p className="pkg-tagline">{pkg.tagline}</p>}
      <div className="price-block">
        {!isRecurring(pkg) ? (
          <>
            <div className="price-main">
              <span className="price-amount">
                {pkg.priceIsFrom && <span className="small">{s.from} </span>}
                {pkg.oneTimePrice ? formatNumber(pkg.oneTimePrice, locale) : '—'}
                {pkg.oneTimePrice ? <span className="cur">֏</span> : null}
              </span>
              <span className="price-unit">{s.oneTime}</span>
            </div>
          </>
        ) : line ? (
          <>
            <div className="price-main">
              <span className="price-amount">
                <AnimatedNumber value={line.monthly} format={(n) => formatNumber(n, locale)} />
                <span className="cur">֏</span>
              </span>
              <span className="price-unit">{s.perMonth}</span>
            </div>
            <p className="price-meta">
              {duration === 1 ? s.totalFor1 : fill(s.totalFor, { n: duration })}:{' '}
              <AnimatedNumber value={line.recurringTotal} format={amd} />
            </p>
            {line.savings > 0 ? (
              <span className="price-save">{fill(s.youSave, { amount: amd(line.savings) })}</span>
            ) : best ? (
              <span className="price-meta">
                {fill(s.saveUpTo, { amount: amd(best.savings), n: best.duration })}
              </span>
            ) : (
              <span className="price-meta">{s.noSavings}</span>
            )}
          </>
        ) : (
          <>
            <p className="price-unavailable">{s.unavailable}</p>
            <p className="price-meta">
              {fill(s.availableFor, { list: avail.map((d) => durationLabel(s, d)).join(', ') })}
            </p>
          </>
        )}
      </div>
      {showScope && (
        <details
          className="pkg-details"
          onToggle={(e) => {
            if ((e.target as HTMLDetailsElement).open && !opened) {
              setOpened(true)
              track(
                'package_view',
                { package: pkg.key, category: pkg.category },
                { oncePerPage: true },
              )
            }
          }}
        >
          <summary>{s.showDetails}</summary>
          <PackageScope catalog={catalog} pkgKey={pkg.key} s={s} />
        </details>
      )}
      <div className="pkg-actions">
        <button
          type="button"
          className={`btn btn-sm${selected ? '' : ' btn-secondary'}`}
          aria-pressed={selected}
          aria-disabled={unavailable}
          disabled={unavailable}
          onClick={onChoose}
          aria-describedby={headingId}
        >
          {selected ? `✓ ${s.selected}` : s.select}
        </button>
        {showCompare && (
          <label className="check">
            <input type="checkbox" checked={comparing} onChange={onCompare} />
            {s.compare}
          </label>
        )}
      </div>
    </article>
  )
}
