/**
 * Inquiry form. Validates in the browser, attaches the visitor's estimate and emails
 * everything to site.formEmail through FormSubmit.
 */
import { INQUIRY_SERVICES } from '../config.js'
import { catalog } from '../content/catalog.js'
import { people } from '../content/people.js'
import { site } from '../content/site.js'
import { inquiryEmail, validateInquiry } from '../forms/inquiry.js'
import { h } from '../lib/dom.js'
import { getLanguage, t, ui } from '../lib/i18n.js'
import { external, mailtoHref, whatsappHref } from '../lib/links.js'
import { findPackage } from '../pricing/engine.js'
import { estimateSummary } from '../pricing/estimate.js'
import { getSelection, subscribe, updateSelection } from '../pricing/selection.js'
import { sendForm } from '../services/formsubmit.js'

let formCount = 0

export function renderInquiryForm({ service: pageService }) {
  const id = (name) => `inquiry${formCount}-${name}`
  formCount += 1

  const selection = getSelection()
  const selectedPackage = findPackage(catalog, selection.packageKey)
  const hasAddons = Object.keys(selection.addons).length > 0
  const initialService = selectedPackage?.category ?? (hasAddons ? 'addon' : pageService) ?? ''

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

  const serviceSelect = control(
    'select',
    'service',
    { onchange: () => suggestContact() },
    h('option', { value: '' }, ui('form', 'choose')),
    INQUIRY_SERVICES.map((s) =>
      h('option', { value: s, selected: s === initialService }, ui('services', s)),
    ),
  )
  const message = control('textarea', 'message', {
    rows: 5,
    maxlength: 4000,
    placeholder: ui('form', 'messagePlaceholder'),
  })
  if (selection.note) message.value = selection.note

  const contactOptions = [
    ...people.map((p) => ({ value: p.key, label: t(p.name) })),
    { value: 'either', label: ui('form', 'either') },
  ]
  const contactChoice = h(
    'fieldset',
    { class: 'full radios' },
    h('legend', null, ui('form', 'preferredContact')),
    contactOptions.map((o) =>
      h(
        'label',
        { class: 'option' },
        h('input', { type: 'radio', name: 'preferredContact', value: o.value }),
        h('span', null, o.label),
      ),
    ),
  )
  // Suggest the founder who handles the chosen service; combined plans go to either.
  function suggestContact() {
    const responsible = people.filter((p) => p.services.includes(serviceSelect.value))
    const value = responsible.length === 1 ? responsible[0].key : 'either'
    contactChoice.querySelector(`input[value="${value}"]`).checked = true
  }

  const attachedEstimate = h('div', { class: 'attached-estimate' })
  const renderEstimate = () => {
    const summary = estimateSummary()
    attachedEstimate.replaceChildren(
      ...(summary
        ? [
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
          ]
        : []),
    )
  }

  const status = h('div', { class: 'form-status', role: 'status', tabindex: '-1' })
  const submitButton = h(
    'button',
    { type: 'submit', class: 'btn btn-primary' },
    ui('form', 'submit'),
  )

  const form = h(
    'form',
    { class: 'card form', novalidate: true },
    h('h3', null, ui('form', 'title')),
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
      field('service', ui('form', 'service'), serviceSelect),
      contactChoice,
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
    attachedEstimate,
    h('p', { class: 'muted small' }, `${ui('form', 'privacy')} ${ui('trust', 'replyTime')}`),
    submitButton,
    status,
  )

  suggestContact()
  renderEstimate()
  subscribe(form, renderEstimate)

  /* ---------- behaviour ---------- */

  // Email and phone are validated together, so editing either clears both messages.
  form.addEventListener('input', ({ target }) => {
    const names =
      target.name === 'email' || target.name === 'phone' ? ['email', 'phone'] : [target.name]
    for (const name of names) if (errorFor[name]) errorFor[name].textContent = ''
    target.removeAttribute('aria-invalid')
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const values = readValues(form)
    const errors = validateInquiry(values)
    showFieldErrors(form, errorFor, errors)
    if (Object.keys(errors).length) {
      showStatus(ui('form', 'errorValidation'))
      form.querySelector(`[name="${Object.keys(errors)[0]}"]`)?.focus()
      return
    }

    const contactName =
      t(people.find((p) => p.key === values.preferredContact)?.name) || ui('form', 'teamName')
    if (values.website) return showSuccess(contactName) // honeypot filled: a bot, so pretend it worked

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
      showSuccess(contactName)
    } catch {
      setSending(false)
      showStatus(ui('form', 'errorGeneric'), fallbackLinks(values))
    }
  })

  function setSending(sending) {
    submitButton.disabled = sending
    submitButton.textContent = ui('form', sending ? 'sending' : 'submit')
    if (sending) status.replaceChildren()
  }

  function showStatus(text, extra) {
    status.className = 'form-status is-error'
    status.replaceChildren(h('p', null, text), extra ?? '')
    status.focus()
  }

  function showSuccess(contactName) {
    updateSelection({ packageKey: null, addons: {}, note: null })
    const done = h(
      'div',
      { class: 'card form form-success', role: 'status', tabindex: '-1' },
      h('p', { class: 'form-success-title' }, ui('form', 'successTitle')),
      h('p', { class: 'muted' }, ui('form', 'successText', { name: contactName })),
    )
    form.replaceWith(done)
    done.focus()
  }

  return form
}

function readValues(form) {
  const values = Object.fromEntries(new FormData(form))
  for (const key of ['name', 'email', 'phone', 'message'])
    values[key] = String(values[key] ?? '').trim()
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
