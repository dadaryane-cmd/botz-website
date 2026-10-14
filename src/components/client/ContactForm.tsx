'use client'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { Locale } from '@/i18n/config'
import { track } from '@/lib/client/analytics'
import { useCatalogForBar } from '@/lib/client/catalogStore'
import { clearSelection, setSelection, usePageCategory, useSelection } from '@/lib/client/selection'
import { routeContacts, type ContactInfo } from '@/lib/contact'
import { formatAmd } from '@/lib/format'
import { findAddon, findPackage, quote } from '@/lib/pricing/engine'
import { durationLabel } from '@/lib/pricing/present'
import type { Strings } from '@/lib/site'

type FormStrings = Strings['form'] & { services: Strings['services']; pricing: Strings['pricing'] }
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success'; name: string } | { kind: 'error'; message: string }

const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m)
const SERVICES = ['smm', 'seo', 'bundle', 'website', 'addon', 'other'] as const

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })

export function ContactForm({
  locale,
  s,
  contacts,
  defaultService,
}: {
  locale: Locale
  s: FormStrings
  contacts: ContactInfo
  defaultService?: string | null
}) {
  const id = useId()
  const selection = useSelection()
  const pageCategory = usePageCategory()
  const catalog = useCatalogForBar()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const tokenRef = useRef<string>('')
  const submissionId = useRef<string>('')
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const selectedPkg = catalog && selection.packageKey ? findPackage(catalog, selection.packageKey) : undefined
  const suggestedService = selectedPkg?.category ?? (selection.addons?.length ? 'addon' : null) ?? defaultService ?? pageCategory ?? ''
  // A visitor's own choice wins until they pick a different package.
  const [serviceChoice, setServiceChoice] = useState<{ value: string; pkg: string | null } | null>(null)
  const service = serviceChoice && serviceChoice.pkg === (selection.packageKey ?? null) ? serviceChoice.value : suggestedService

  const routed = routeContacts(contacts, (service || null) as never, selectedPkg?.contact ?? null)
  const suggestedContact = routed.length === 1 ? routed[0].key : 'either'
  const [contactChoice, setContactChoice] = useState<string | null>(null)
  const preferred = contactChoice && (contactChoice === 'either' || routed.some((r) => r.key === contactChoice)) ? contactChoice : suggestedContact

  async function fetchToken() {
    try {
      const r = await fetch('/api/inquiry/token', { cache: 'no-store' })
      tokenRef.current = (await r.json()).token
    } catch {
      tokenRef.current = ''
    }
  }
  useEffect(() => {
    fetchToken()
  }, [])

  const q = catalog && (selection.packageKey || selection.addons?.length) ? quote(catalog, selection) : null
  const attached = q && q.errors.length === 0 ? q : null

  const errorText = (key?: string) => (key ? ((s as unknown as Record<string, string>)[key] ?? s.required) : '')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status.kind === 'sending') return
    const fd = new FormData(e.currentTarget)
    const data = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      service: String(fd.get('service') ?? ''),
      message: String(fd.get('message') ?? '').trim(),
      preferredContact: String(fd.get('preferredContact') ?? 'either'),
      website: String(fd.get('website') ?? ''),
    }
    // Client checks mirror the server's; the server remains authoritative.
    const errs: Record<string, string> = {}
    if (data.name.length < 2) errs.name = 'required'
    if (!data.email && !data.phone) errs.email = 'needEmailOrPhone'
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'invalidEmail'
    if (data.phone && !/^\+?[0-9 ()-]{6,20}$/.test(data.phone)) errs.phone = 'invalidPhone'
    if (!data.service) errs.service = 'required'
    if (data.message.length < 5) errs.message = 'messageTooShort'
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ kind: 'error', message: s.errorValidation })
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    if (!submissionId.current) submissionId.current = uuid()
    setStatus({ kind: 'sending' })

    const send = async () =>
      fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          submissionId: submissionId.current,
          formToken: tokenRef.current,
          locale,
          source: window.location.pathname,
          selection: attached
            ? { packageKey: selection.packageKey ?? null, duration: selection.duration ?? null, addons: selection.addons ?? [] }
            : null,
          estimateToken: attached ? (selection.estimateToken ?? undefined) : undefined,
        }),
      })

    try {
      let res = await send()
      let body = await res.json().catch(() => ({}))
      if (res.status === 400 && body.code === 'token') {
        await fetchToken()
        res = await send()
        body = await res.json().catch(() => ({}))
      }
      if (res.ok && body.ok) {
        // Counted only after the server confirms the inquiry was saved.
        track('inquiry_saved', { service: data.service, package: selection.packageKey ?? undefined, contact: data.preferredContact, locale })
        setStatus({ kind: 'success', name: body.contactName ?? s.teamName })
        clearSelection()
        submissionId.current = ''
        return
      }
      if (res.status === 429) setStatus({ kind: 'error', message: s.errorRate })
      else if (res.status === 409) setStatus({ kind: 'error', message: s.errorSelection })
      else if (body.code === 'validation') {
        setErrors(body.fields ?? {})
        setStatus({ kind: 'error', message: s.errorValidation })
      } else setStatus({ kind: 'error', message: s.errorGeneric })
    } catch {
      setStatus({ kind: 'error', message: s.errorGeneric })
    }
  }

  useEffect(() => {
    if (status.kind === 'success' || status.kind === 'error') statusRef.current?.focus()
  }, [status])

  if (status.kind === 'success')
    return (
      <div className="form form-success" ref={statusRef} tabIndex={-1} role="status">
        <p className="big">{s.successTitle}</p>
        <p className="muted">{fill(s.successText, { name: status.name })}</p>
      </div>
    )

  const field = (name: string) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-err` : undefined,
  })
  const err = (name: string) =>
    errors[name] ? (
      <span id={`${id}-${name}-err`} className="field-error">
        {errorText(errors[name])}
      </span>
    ) : null

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate data-contact-form aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{s.title}</h3>
      <div className="form-grid">
        <div className="field full">
          <label htmlFor={`${id}-name`}>{s.name}</label>
          <input {...field('name')} autoComplete="name" required maxLength={120} />
          {err('name')}
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>{s.email}</label>
          <input {...field('email')} type="email" autoComplete="email" inputMode="email" maxLength={200} />
          {err('email')}
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>{s.phone}</label>
          <input {...field('phone')} type="tel" autoComplete="tel" inputMode="tel" maxLength={40} />
          {err('phone')}
        </div>
        <span className="field-hint full" style={{ marginTop: -8 }}>
          {s.contactHint}
        </span>
        <div className="field full">
          <label htmlFor={`${id}-service`}>{s.service}</label>
          <select {...field('service')} value={service} onChange={(e) => setServiceChoice({ value: e.target.value, pkg: selection.packageKey ?? null })} required>
            <option value="" disabled>
              {s.choose}
            </option>
            {SERVICES.map((v) => (
              <option key={v} value={v}>
                {s.services[v]}
              </option>
            ))}
          </select>
          {err('service')}
        </div>
        <fieldset className="field full">
          <legend>{s.preferredContact}</legend>
          <div className="radio-row">
            {contacts.people.map((p) => (
              <label key={p.key}>
                <input type="radio" name="preferredContact" value={p.key} checked={preferred === p.key} onChange={() => setContactChoice(p.key)} />
                {p.name}
                {p.role ? <span className="muted small">· {p.role}</span> : null}
              </label>
            ))}
            <label>
              <input type="radio" name="preferredContact" value="either" checked={preferred === 'either'} onChange={() => setContactChoice('either')} />
              {s.either}
            </label>
          </div>
        </fieldset>
        <div className="field full">
          <label htmlFor={`${id}-message`}>{s.message}</label>
          <textarea {...field('message')} placeholder={s.messagePlaceholder} required maxLength={4000} />
          {err('message')}
        </div>
        {attached && catalog && (
          <div className="full attached">
            <div>
              <strong>{s.selectedEstimate}</strong>
              <br />
              {selectedPkg && (
                <>
                  {selectedPkg.name}
                  {attached.duration ? ` · ${durationLabel(s.pricing, attached.duration)}` : ''}
                  <br />
                </>
              )}
              {attached.addons.map((a) => (
                <span key={a.key}>
                  + {findAddon(catalog, a.key)?.name}
                  {a.qty > 1 ? ` × ${a.qty}` : ''}
                  <br />
                </span>
              ))}
              <b>
                {attached.isMinimum ? `${s.pricing.from} ` : ''}
                {formatAmd(attached.combinedTotal, locale)}
              </b>
            </div>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setSelection((x) => ({ ...x, packageKey: null, duration: null, addons: [] }))}>
              {s.removeEstimate}
            </button>
          </div>
        )}
        <div className="hp" aria-hidden="true">
          <label htmlFor={`${id}-website`}>{s.honeypot}</label>
          <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <div className="btn-row" style={{ marginTop: 20 }}>
        <button type="submit" className="btn" disabled={status.kind === 'sending'} aria-busy={status.kind === 'sending'}>
          {status.kind === 'sending' ? s.sending : s.submit}
        </button>
      </div>
      <p className="field-hint">{s.privacy}</p>
      <div ref={statusRef} tabIndex={-1} aria-live="assertive">
        {status.kind === 'error' && <p className="form-status error">{status.message}</p>}
      </div>
    </form>
  )
}
