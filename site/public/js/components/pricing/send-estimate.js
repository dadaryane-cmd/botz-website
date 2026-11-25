/**
 * "Send me this estimate", under the live estimate: the visitor leaves a phone or WhatsApp
 * number and the team gets the estimate with it, sent like an inquiry (Web3Forms, with
 * FormSubmit as the backup: js/services/send-inquiry.js). The rules are in
 * js/forms/estimate-request.js. The pricing tool redraws the panel on every change, so the
 * typed number and the sent state are kept here, outside it.
 */
import { site } from '../../content/index.js'
import { estimateRequestEmail, phoneError } from '../../forms/estimate-request.js'
import { h } from '../../lib/dom.js'
import { getLanguage, ui } from '../../lib/i18n.js'
import { estimateLink, estimateSummary } from '../../pricing/estimate.js'
import { trackEvent } from '../../services/analytics.js'
import { sendInquiry } from '../../services/send-inquiry.js'

const FIELD_ID = 'send-estimate-phone'

let typedPhone = ''
/** The number the estimate went to, once it is sent. */
let sentTo = null

export function sendEstimateForm(totals, selection) {
  if (sentTo) {
    return h('p', { class: 'send-estimate-done', role: 'status' }, [
      ui('pricing', 'sendDone', { phone: sentTo }),
    ])
  }

  const error = h('span', { class: 'field-error', id: `${FIELD_ID}-error` })
  const status = h('div', { class: 'form-status', role: 'status' })
  const input = h('input', {
    id: FIELD_ID,
    name: 'phone',
    type: 'tel',
    autocomplete: 'tel',
    maxlength: 40,
    value: typedPhone,
    required: true,
    'aria-describedby': `${FIELD_ID}-error`,
    'data-key': FIELD_ID,
    oninput: () => {
      typedPhone = input.value
      error.textContent = ''
      input.removeAttribute('aria-invalid')
    },
  })
  const button = h(
    'button',
    { type: 'submit', class: 'btn btn-secondary btn-small' },
    ui('pricing', 'sendSubmit'),
  )

  async function submit(event) {
    event.preventDefault()
    const phone = input.value.trim()
    const problem = phoneError(phone)
    if (problem) {
      error.textContent = ui('form', problem)
      input.setAttribute('aria-invalid', 'true')
      input.focus()
      return
    }
    // The honeypot was filled in, so this is a bot: pretend it worked and send nothing.
    if (form.elements.website.value) {
      showSent(phone)
      return
    }

    button.disabled = true
    button.textContent = ui('form', 'sending')
    status.replaceChildren()
    try {
      const email = estimateRequestEmail(phone, {
        summary: estimateSummary(totals),
        link: estimateLink(selection),
        page: location.pathname,
        language: getLanguage(),
      })
      await sendInquiry(site, email)
      trackEvent('generate_lead', { service: 'estimate' })
      showSent(phone)
    } catch (sendError) {
      console.warn('Estimate request not sent:', sendError.message)
      button.disabled = false
      button.textContent = ui('pricing', 'sendSubmit')
      status.className = 'form-status is-error'
      status.replaceChildren(h('p', null, ui('form', 'errorGeneric')))
    }
  }

  function showSent(phone) {
    sentTo = phone
    form.replaceWith(sendEstimateForm(totals, selection))
  }

  const form = h(
    'form',
    { class: 'send-estimate', novalidate: true, onsubmit: submit },
    h('p', { class: 'send-estimate-title' }, ui('pricing', 'sendTitle')),
    h('p', { class: 'muted small' }, ui('pricing', 'sendIntro')),
    h('label', { class: 'small', for: FIELD_ID }, ui('pricing', 'sendPhone')),
    h('div', { class: 'send-estimate-row' }, input, button),
    error,
    // Hidden from people, but bots fill it in.
    h(
      'div',
      { class: 'honeypot', 'aria-hidden': 'true' },
      h('input', { name: 'website', tabindex: '-1', autocomplete: 'off' }),
    ),
    status,
  )
  return form
}
