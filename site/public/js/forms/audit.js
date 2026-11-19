/**
 * Free audit request rules and the email it produces: a name, a phone or WhatsApp number and the
 * page to look at (an Instagram handle or a website). No DOM access, so it is unit-tested.
 */

const PHONE = /^\+?[0-9 ()-]{6,20}$/
/** "@botz.yerevan", "instagram.com/botz", "botz.am", "https://…": something to open, no spaces. */
const PAGE = /^@?[^\s@]+\.?[^\s]*$/

/** Field name → message key in content/ui.json (`form` group). Empty object = valid. */
export function validateAudit({ name, phone, link }) {
  const errors = {}
  if (name.length < 2) errors.name = 'required'
  if (!phone) errors.phone = 'required'
  else if (!PHONE.test(phone)) errors.phone = 'invalidPhone'
  if (!link) errors.link = 'required'
  else if (link.length < 3 || !PAGE.test(link)) errors.link = 'invalidLink'
  return errors
}

/**
 * The page to look at, as a link the team can open: an Instagram handle becomes its profile
 * address and a bare domain gets https://; full addresses stay as they are.
 */
export function pageLink(link) {
  if (/^https?:\/\//i.test(link)) return link
  if (link.startsWith('@')) return `https://www.instagram.com/${link.slice(1)}`
  return `https://${link}`
}

/** The request as an email (the same shape as an inquiry's, js/forms/inquiry.js). */
export function auditEmail(values, { page, language }) {
  return {
    subject: `Free audit request: ${values.name} · ${values.link}`,
    replyTo: null,
    fields: {
      Request: 'Free marketing audit',
      Name: values.name,
      'Phone / WhatsApp': values.phone,
      'Page to audit': pageLink(values.link),
      'What worries them': values.note || '—',
      Page: page,
      Language: language.toUpperCase(),
    },
  }
}
