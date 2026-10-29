import { site } from '../content/site.js'

export const phoneHref = `tel:${site.phoneE164}`
export const emailHref = `mailto:${site.email}`

export const whatsappHref = (message = '') =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const mailtoHref = (to, subject, body) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

/** Attributes for links that open another site in a new tab. */
export const external = { target: '_blank', rel: 'noopener' }
