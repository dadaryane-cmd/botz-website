/**
 * Attributes for the site's WhatsApp links (header, phone bar, contact section, footer). The chat
 * opens naming the package and add-ons chosen at the moment of the tap, which may have changed
 * since the link was drawn; with nothing chosen it opens empty.
 */
import { fromMarkup } from '../lib/dom.js'
import { external, whatsappHref } from '../lib/links.js'
import { estimateWhatsappHref } from '../pricing/estimate.js'

/** A speech bubble with a handset (static, trusted markup), drawn with the text colour. */
const WHATSAPP_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true"><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.4 3.3Z" /><path
  d="M9.2 8.6c-.3 2.4 1.8 5.4 5 6.2.6.1 1.2-.3 1.4-.9l.2-.7-1.9-.9-.8.8a4.6 4.6 0 0 1-2.3-2.3l.8-.8-.9-1.9-.7.2c-.5.2-.8.6-.8 1.1Z"
  /></svg>`

export const whatsappIcon = () => fromMarkup(WHATSAPP_ICON)

export const whatsappLinkAttributes = () => ({
  href: whatsappHref(),
  ...external,
  onclick: (event) => {
    event.currentTarget.href = estimateWhatsappHref()
  },
})
