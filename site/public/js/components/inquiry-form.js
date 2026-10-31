/**
 * Inquiry form. Validates in the browser, attaches the visitor's estimate and emails
 * everything to site.formEmail through FormSubmit.
 */
import { INQUIRY_SERVICES } from '../config.js'
import { catalog, people, site } from '../content/index.js'
import {
  initialService,
  inquiryEmail,
  serviceFromSearch,
  suggestedContact,
  validateInquiry,
} from '../forms/inquiry.js'
import { h } from '../lib/dom.js'
import { getLanguage, t, ui } from '../lib/i18n.js'
import { external, mailtoHref, whatsappHref } from '../lib/links.js'
import { findPackage } from '../pricing/engine.js'
import { estimateSummary } from '../pricing/estimate.js'
import { getSelection, subscribe, updateSelection } from '../pricing/selection.js'
import { sendForm } from '../services/formsubmit.js'

/** Email and phone are validated together (one of them is needed). */
const LINKED_FIELDS = ['email', 'phone']
const TEXT_FIELDS = ['name', 'email', 'phone', 'message']

/** Numbers each form, so two forms on one page never share element ids. */
let formCount = 0

export function renderInquiryForm({ service: pageService }) {
  const prefix = `inquiry${formCount}`
  formCount += 1
  const id = (name) => `${prefix}-${name}`

  const selection = getSelection()
  const preselected = initialService({
    requested: serviceFromSearch(location.search),
    packageCategory: findPackage(catalog, selection.packageKey)?.category,
    hasAddons: Object.keys(selection.addons).length > 0,
    pageService,
  })

  /* ---------- fields ---------- */

  const errorFor = {}
  const field = (name, label, control, { full = false } = {}) => {
    errorFor[name] = h('span', { class: 'field-error', id: id(`${name}-error`) })
    return h(
      'div',
      { class: full ? 'field full' : 'field' },
      h('label', { for: id(name) }, label),
      control,
      errorFor[name],
    )
  }
  const control = (tag, name, attributes = {}, ...children) =>
    h(tag, { id: id(name), name, 'aria-describedby': id(`${name}-error`), ...attributes }, children)

  errorFor.service = h('span', { class: 'field-error', id: id('service-error') })
  const serviceChoice = serviceFieldset({
    preselected,
    describedBy: id('service-error'),
    extra: errorFor.service,
  })
  const message = control('textarea', 'message', {
    rows: 5,
    maxlength: 4000,
    placeholder: ui('form', 'messagePlaceholder'),
  })
  const fillSuggestedNote = noteFiller(message, selection.note)
  const estimate = attachedEstimate()

  const status = h('div', { class: 'form-status', role: 'status', tabindex: '-1' })
  const submitButton = h(
    'button',
    { type: 'submit', class: 'btn btn-primary' },
    ui('form', 'submit'),
  )

  const form = h(
    'form',
    { class: 'card form', novalidate: true },
    h(
      'div',
      { class: 'form-grid' },
      field(
        'name',
        ui('form', 'name'),
        control('input', 'name', { autocomplete: 'name', maxlength: 120, required: true }),
        { full: true },
      ),
      field(
        'email',
        ui('form', 'email'),
        control('input', 'email', { type: 'email', autocomplete: 'email', maxlength: 200 }),
      ),
      field(
        'phone',
        ui('form', 'phone'),
        control('input', 'phone', { type: 'tel', autocomplete: 'tel', maxlength: 40 }),
      ),
      h('p', { class: 'hint full' }, ui('form', 'contactHint')),
      serviceChoice,
      field('message', ui('form', 'message'), message, { full: true }),
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
    estimate.element,
    h('p', { class: 'muted small' }, `${ui('form', 'privacy')} ${ui('trust', 'replyTime')}`),
    submitButton,
    status,
  )

  subscribe(form, (changed) => {
    estimate.update()
    fillSuggestedNote(changed.note)
  })

  /* ---------- behaviour ---------- */

  form.addEventListener('input', ({ target }) => {
    const names = LINKED_FIELDS.includes(target.name) ? LINKED_FIELDS : [target.name]
    for (const name of names) {
      if (errorFor[name]) errorFor[name].textContent = ''
    }
    target.removeAttribute('aria-invalid')
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = readValues(form)
    const errors = validateInquiry(values)
    showFieldErrors(form, errorFor, errors)
    const firstInvalid = Object.keys(errors)[0]
    if (firstInvalid) {
      showError(ui('form', 'errorValidation'))
      form.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    // Only the email to the team names who should answer; the visitor just hears from "us".
    const contactKey = suggestedContact(people, values.service)
    const contact = people.find((person) => person.key === contactKey)
    const contactName = t(contact?.name) || ui('form', 'teamName')
    // The honeypot was filled in, so this is a bot: pretend it worked and send nothing.
    if (values.website) {
      showSuccess()
      return
    }

    setSending(true)
    try {
      await sendForm(
        site.formEmail,
        inquiryEmail(values, {
          serviceLabel: ui('services', values.service),
          contactName,
          estimate: estimateSummary(),
          page: location.pathname.split('/').pop() || 'index.html',
          language: getLanguage(),
        }),
      )
      showSuccess()
    } catch {
      setSending(false)
      showError(ui('form', 'errorGeneric'), fallbackLinks(values))
    }
  })

  function setSending(sending) {
    submitButton.disabled = sending
    submitButton.textContent = ui('form', sending ? 'sending' : 'submit')
    if (sending) status.replaceChildren()
  }

  function showError(text, extra = '') {
    status.className = 'form-status is-error'
    status.replaceChildren(h('p', null, text), extra)
    status.focus()
  }

  function showSuccess() {
    updateSelection({ packageKey: null, addons: {}, note: null })
    const done = h(
      'div',
      { class: 'card form form-success', role: 'status', tabindex: '-1' },
      h('p', { class: 'form-success-title' }, ui('form', 'successTitle')),
      h('p', { class: 'muted' }, ui('form', 'successText')),
    )
    form.replaceWith(done)
    done.focus()
  }

  return form
}

/* ---------- parts of the form ---------- */

/** The services as a row of buttons (radio buttons underneath), so every option is visible. */
function serviceFieldset({ preselected, describedBy, extra }) {
  return h(
    'fieldset',
    { class: 'full radios', 'aria-describedby': describedBy },
    h('legend', null, ui('form', 'service')),
    INQUIRY_SERVICES.map((service) =>
      h(
        'label',
        { class: 'option' },
        h('input', {
          type: 'radio',
          name: 'service',
          value: service,
          checked: service === preselected,
        }),
        h('span', null, ui('services', service)),
      ),
    ),
    extra,
  )
}

/**
 * A suggested message (package finder, lamp surprise) fills the message field, unless the
 * visitor has written their own. Returns the function that applies a newly suggested note.
 */
function noteFiller(message, initialNote) {
  let suggested = initialNote
  if (suggested) message.value = suggested

  return (note) => {
    if (!note || note === suggested) return
    const untouched = !message.value.trim() || message.value === suggested
    if (untouched) message.value = note
    suggested = note
  }
}

/** The visitor's current estimate, sent with the inquiry, with a button to remove it. */
function attachedEstimate() {
  const element = h('div', { class: 'attached-estimate' })
  const update = () => {
    const summary = estimateSummary()
    if (!summary) {
      element.replaceChildren()
      return
    }
    element.replaceChildren(
      h('span', { class: 'label' }, ui('form', 'selectedEstimate')),
      h('pre', null, summary),
      h(
        'button',
        {
          type: 'button',
          class: 'btn btn-link btn-small',
          onclick: () => updateSelection({ packageKey: null, addons: {} }),
        },
        ui('form', 'removeEstimate'),
      ),
    )
  }
  update()
  return { element, update }
}

/* ---------- submitting ---------- */

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

/** When sending fails, offer the same message by email app or WhatsApp. */
function fallbackLinks(values) {
  const text = [
    values.message,
    estimateSummary(),
    `${values.name} · ${values.email} ${values.phone}`,
  ]
    .filter(Boolean)
    .join('\n\n')
  return h(
    'div',
    { class: 'btn-row' },
    h(
      'a',
      {
        class: 'btn btn-secondary btn-small',
        href: mailtoHref(site.formEmail, `Inquiry: ${values.name}`, text),
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
