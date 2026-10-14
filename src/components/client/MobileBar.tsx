'use client'
import { useEffect, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { routeContacts, telLink, type ContactInfo } from '@/lib/contact'
import { useCatalogForBar } from '@/lib/client/catalogStore'
import { usePageCategory, useSelection } from '@/lib/client/selection'
import { findPackage } from '@/lib/pricing/engine'
import { whatsappHref, whatsappMessage } from '@/lib/whatsapp'
import { Icon } from '../ui'

type Strings = Parameters<typeof whatsappMessage>[0]['strings'] & {
  contact: { call: string; whatsapp: string; email: string; contactPerson: string; mobileBarLabel: string }
}

/**
 * Context-aware sticky contact bar for phones. Routes to Mariam/Edgar based on
 * the selected package or the page's service. Hides while a form field is
 * focused, while the contact form is on screen, and while overlays are open,
 * so it never covers inputs or dialogs. Respects the safe area.
 */
export function MobileBar({
  contacts,
  strings,
  locale,
  show,
}: {
  contacts: ContactInfo
  strings: Strings
  locale: Locale
  show: { call: boolean; whatsapp: boolean; email: boolean }
}) {
  const selection = useSelection()
  const pageCategory = usePageCategory()
  const catalog = useCatalogForBar()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    document.body.classList.add('has-mobile-bar')
    const root = document.documentElement
    let formVisible = false
    let focusInField = false
    let overlay = false
    const update = () => setHidden(formVisible || focusInField || overlay)
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            formVisible = entries.some((e) => e.isIntersecting)
            update()
          })
        : null
    const observeForms = () => document.querySelectorAll('form[data-contact-form]').forEach((f) => io?.observe(f))
    observeForms()
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement
      focusInField = Boolean(t?.matches?.('input, textarea, select'))
      update()
    }
    const mo = new MutationObserver(() => {
      overlay = root.dataset.overlayOpen === 'true'
      update()
      observeForms()
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-overlay-open'] })
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', onFocus)
    return () => {
      document.body.classList.remove('has-mobile-bar')
      io?.disconnect()
      mo.disconnect()
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', onFocus)
    }
  }, [])

  const pkg = catalog && selection.packageKey ? findPackage(catalog, selection.packageKey) : undefined
  const category = pkg?.category ?? selection.category ?? pageCategory
  const routed = routeContacts(contacts, category, pkg?.contact ?? null)
  const person = routed.length === 1 ? routed[0] : null
  const name = person?.name ?? routed.map((p) => p.name).join(' / ')
  const message = whatsappMessage({ strings, locale, contactName: name, service: category, catalog, selection })
  const wa = whatsappHref(person?.whatsappNumber ?? contacts.whatsappNumber, message)

  return (
    <nav className={`mobile-bar${hidden ? ' is-hidden' : ''}`} aria-label={strings.contact.mobileBarLabel} aria-hidden={hidden}>
      {show.whatsapp && (
        <a className="primary" href={wa} target="_blank" rel="noopener noreferrer" data-contact={person?.key ?? 'either'} tabIndex={hidden ? -1 : 0}>
          {Icon.whatsapp}
          <span className="bar-label">{person ? strings.contact.contactPerson.replace('{name}', person.name) : strings.contact.whatsapp}</span>
        </a>
      )}
      {show.call && (
        <a href={telLink(person?.phoneE164 ?? contacts.phoneE164)} data-contact={person?.key ?? 'either'} tabIndex={hidden ? -1 : 0}>
          {Icon.phone}
          <span className="bar-label">{strings.contact.call}</span>
        </a>
      )}
      {show.email && (
        <a href={`mailto:${person?.email ?? contacts.email}`} tabIndex={hidden ? -1 : 0}>
          {Icon.mail}
          <span className="bar-label">{strings.contact.email}</span>
        </a>
      )}
    </nav>
  )
}
