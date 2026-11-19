/**
 * The free audit request: a name, a phone or WhatsApp number and the page to look at, nothing
 * more, so it takes half a minute. Sent like an inquiry (Web3Forms, with FormSubmit as the
 * backup: js/services/send-inquiry.js); the rules are in js/forms/audit.js.
 */
import { site } from '../content/index.js'
import { auditEmail, pageLink, validateAudit } from '../forms/audit.js'
import { fadeIn } from '../lib/animation.js'
import { h } from '../lib/dom.js'
import { getLanguage, ui } from '../lib/i18n.js'
import { external, mailtoHref, whatsappHref } from '../lib/links.js'
import { trackEvent } from '../services/analytics.js'
import { sendInquiry } from '../services/send-inquiry.js'

const TEXT_FIELDS = ['name', 'phone', 'link', 'note']

export function renderAuditForm() {
  const id = (name) => `audit-${name}`
  const errorFor = {}
  const field = (name, label, control, hint) => {
    errorFor[name] = h('span', { class: 'field-error', id: id(`${name}-error`) })
    return h(
      'div',
      { class: 'field full' },
      h('label', { for: id(name) }, label),
      control,
      hint && h('p', { class: 'hint' }, hint),
      errorFor[name],
    )
  }
  const input = (name, attributes) =>
    h('input', { id: id(name), name, 'aria-describedby': id(`${name}-error`), ...attributes })

  const status = h('div', { class: 'form-status', role: 'status', tabindex: '-1' })
  const submitButton = h(
    'button',
    { type: 'submit', class: 'btn btn-primary' },
    ui('form', 'auditSubmit'),
  )

  const form = h(
    'form',
    { class: 'card form', novalidate: true },
    h(
      'div',
      { class: 'form-grid' },
      field(
        'link',
        ui('form', 'auditLink'),
        // A handle or an address: no spell check or capital first letter.
        input('link', {
          autocomplete: 'url',
          spellcheck: 'false',
          autocapitalize: 'off',
          maxlength: 300,
          placeholder: ui('form', 'auditLinkPlaceholder'),
          required: true,
        }),
      ),
      field('name', ui('form', 'name'), input('name', { autocomplete: 'name', maxlength: 120 })),
      field(
        'phone',
        ui('form', 'auditPhone'),
        input('phone', { type: 'tel', autocomplete: 'tel', maxlength: 40, required: true }),
      ),
      field(
        'note',
        [ui('form', 'auditNote'), h('span', { class: 'muted' }, ` (${ui('form', 'optional')})`)],
        h('textarea', { id: id('note'), name: 'note', rows: 3, maxlength: 2000 }),
      ),
    ),
    // Honeypot: hidden from people, but bots fill it in.
    h(
      'div',
      { class: 'honeypot', 'aria-hidden': 'true' },
      h(
        'label',
        null,
        ui('form', 'honeypot'),
        h('input', { name: 'website', tabindex: '-1', autocomplete: 'off' }),
      ),
    ),
    h('p', { class: 'muted small' }, `${ui('form', 'privacy')} ${ui('trust', 'replyTime')}`),
    submitButton,
    status,
  )

  form.addEventListener('input', ({ target }) => {
    if (errorFor[target.name]) errorFor[target.name].textContent = ''
    target.removeAttribute('aria-invalid')
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = readValues(form)
    const errors = validateAudit(values)
    showFieldErrors(form, errorFor, errors)
    const firstInvalid = Object.keys(errors)[0]
    if (firstInvalid) {
      showError(ui('form', 'errorValidation'))
      form.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    // The honeypot was filled in, so this is a bot: pretend it worked and send nothing.
    if (values.website) {
      showSuccess(values)
      return
    }

    setSending(true)
    try {
      await sendInquiry(
        site,
        auditEmail(values, { page: location.pathname, language: getLanguage() }),
      )
      trackEvent('generate_lead', { service: 'audit' })
      showSuccess(values)
    } catch (error) {
      console.warn('Audit request not sent:', error.message)
      setSending(false)
      showError(ui('form', 'errorGeneric'), fallbackLinks(values))
    }
  })

  function setSending(sending) {
    submitButton.disabled = sending
    submitButton.textContent = ui('form', sending ? 'sending' : 'auditSubmit')
    if (sending) status.replaceChildren()
  }

  function showError(text, extra = '') {
    status.className = 'form-status is-error'
    status.replaceChildren(h('p', null, text), extra)
    status.focus()
  }

  function showSuccess(values) {
    const greeting = ui('form', 'auditWhatsappMessage', { name: values.name, link: values.link })
    const done = h(
      'div',
      { class: 'card form form-success', role: 'status', tabindex: '-1' },
      h('p', { class: 'form-success-title' }, ui('form', 'successTitle')),
      h('p', { class: 'muted' }, ui('form', 'auditSuccessText')),
      h(
        'div',
        { class: 'btn-row' },
        h(
          'a',
          { class: 'btn btn-secondary', href: whatsappHref(greeting), ...external },
          ui('form', 'successWhatsapp'),
        ),
        h('a', { class: 'text-link', href: 'index.html' }, ui('form', 'successHome')),
      ),
    )
    form.replaceWith(done)
    fadeIn(done)
    done.focus()
  }

  return form
}

function readValues(form) {
  const values = Object.fromEntries(new FormData(form))
  for (const key of TEXT_FIELDS) {
    values[key] = String(values[key] ?? '').trim()
  }
  return values
}

function showFieldErrors(form, errorFor, errors) {
  for (const [name, element] of Object.entries(errorFor)) {
    element.textContent = errors[name] ? ui('form', errors[name]) : ''
    form
      .querySelector(`[name="${name}"]`)
      ?.setAttribute('aria-invalid', String(Boolean(errors[name])))
  }
}

/** When sending fails, offer the same request by email app or WhatsApp. */
function fallbackLinks(values) {
  const text = [
    ui('form', 'auditSubmit'),
    pageLink(values.link),
    `${values.name} · ${values.phone}`,
  ]
    .filter(Boolean)
    .join('\n')
  return h(
    'div',
    { class: 'btn-row' },
    h(
      'a',
      {
        class: 'btn btn-secondary btn-small',
        href: mailtoHref(site.formEmail, `Free audit: ${values.name}`, text),
      },
      ui('contact', 'email'),
    ),
    h(
      'a',
      { class: 'btn btn-secondary btn-small', href: whatsappHref(text), ...external },
      ui('contact', 'whatsapp'),
    ),
  )
}
