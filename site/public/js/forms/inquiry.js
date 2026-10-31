/** Inquiry form rules and the email it produces. No DOM access, so it is unit-tested. */
import { INQUIRY_SERVICES } from '../config.js'
import { responsibleFor } from '../lib/people.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?[0-9 ()-]{6,20}$/

/** Field name → message key in content/ui.json (`form` group). Empty object = valid. */
export function validateInquiry({ name, email, phone, service, message }) {
  const errors = {}
  if (name.length < 2) errors.name = 'required'
  if (!email && !phone) errors.email = 'needEmailOrPhone'
  if (email && !EMAIL.test(email)) errors.email = 'invalidEmail'
  if (phone && !PHONE.test(phone)) errors.phone = 'invalidPhone'
  if (!service) errors.service = 'required'
  if (message.length < 5) errors.message = 'messageTooShort'
  return errors
}

/** The service a link asks the form to preselect (`?service=seo`), or null. */
export function serviceFromSearch(search = '') {
  const service = new URLSearchParams(search).get('service')
  return INQUIRY_SERVICES.includes(service) ? service : null
}

/**
 * The service to preselect: the one a link asked for (`?service=seo`), the chosen
 * package's, "addon" for add-ons alone, else the page's.
 */
export function initialService({ requested, packageCategory, hasAddons, pageService }) {
  if (requested) return requested
  if (packageCategory) return packageCategory
  if (hasAddons) return 'addon'
  return pageService ?? ''
}

/** The founder who handles `service`, or "either" when nobody or more than one does. */
export function suggestedContact(people, service) {
  const responsible = responsibleFor(people, service)
  return responsible.length === 1 ? responsible[0].key : 'either'
}

/**
 * FormSubmit fields. Keys starting with `_` configure the email
 * (https://formsubmit.co/documentation); the rest appear as a table.
 */
export function inquiryEmail(values, { serviceLabel, contactName, estimate, page, language }) {
  return {
    _subject: `New inquiry: ${values.name} · ${serviceLabel}`,
    _template: 'table',
    _captcha: 'false',
    ...(values.email && { _replyto: values.email }),
    Name: values.name,
    Email: values.email || '—',
    Phone: values.phone || '—',
    Service: serviceLabel,
    'Preferred contact': contactName,
    Message: values.message,
    Estimate: estimate || '—',
    Page: page,
    Language: language.toUpperCase(),
  }
}
