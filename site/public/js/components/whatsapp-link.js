/**
 * Attributes for the site's WhatsApp links (header, phone bar, contact section, footer). The chat
 * opens naming the package and add-ons chosen at the moment of the tap, which may have changed
 * since the link was drawn; with nothing chosen it opens empty.
 */
import { external, whatsappHref } from '../lib/links.js'
import { estimateWhatsappHref } from '../pricing/estimate.js'

export const whatsappLinkAttributes = () => ({
  href: whatsappHref(),
  ...external,
  onclick: (event) => {
    event.currentTarget.href = estimateWhatsappHref()
  },
})
