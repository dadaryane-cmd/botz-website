/** Inquiry form rules and the email it produces. No DOM access, so it is unit-tested. */
import { INQUIRY_SERVICES } from '../config.js'
import { responsibleFor } from '../lib/people.js'
import { isPhone } from './phone.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * One field takes a phone number or an email, whichever the visitor prefers: an "@" makes it an
 * email. Returns both, one of them empty.
 */
export function splitContact(contact) {
  if (contact.includes('@')) return { email: contact, phone: '' }
  return { email: '', phone: contact }
}

/**
 * Field name → message key in content/ui.json (`form` group). Empty object = valid. Only a name
 * and a way to reach the visitor are needed: the service defaults to "not sure yet" and the
 * message is optional, so sending takes seconds.
 */
export function validateInquiry({ name, contact }) {
  const errors = {}
  if (name.length < 2) errors.name = 'required'
  const { email, phone } = splitContact(contact)
  if (!contact) errors.contact = 'needEmailOrPhone'
  else if (email && !EMAIL.test(email)) errors.contact = 'invalidEmail'
  else if (phone && !isPhone(phone)) errors.contact = 'invalidPhone'
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
 * The inquiry as an email: its subject, the address a reply goes to (only when the visitor gave
 * one) and the fields shown as a table. js/services/ puts it in each delivery service's format.
 */
export function inquiryEmail(values, { serviceLabel, contactName, estimate, page, language }) {
  const { email, phone } = splitContact(values.contact)
  return {
    subject: `New inquiry: ${values.name} · ${serviceLabel}`,
    replyTo: email || null,
    fields: {
      Name: values.name,
      Email: email || '—',
      Phone: phone || '—',
      Service: serviceLabel,
      'Preferred contact': contactName,
      Message: values.message || '—',
      Estimate: estimate || '—',
      Page: page,
      Language: language.toUpperCase(),
    },
  }
}
