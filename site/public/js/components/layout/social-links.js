/**
 * Icons for the agency's social media pages (content/site.json → social). A network without a
 * link yet is shown dimmed and marked "coming soon"; adding the link in the editor makes it live.
 */
import { fromMarkup, h } from '../../lib/dom.js'
import { ui } from '../../lib/i18n.js'
import { external } from '../../lib/links.js'

const NAMES = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' }

/* Static icons (trusted markup), drawn with the text colour. */
const ICONS = {
  instagram: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12"
    r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>`,
  facebook: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path
    d="M14.5 3H13a4.5 4.5 0 0 0-4.5 4.5V10H6v4h2.5v7h4v-7h3l.5-4h-3.5V8a1 1 0 0 1 1-1h2V3z" /></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path
    d="M16 3c.4 2.3 1.9 3.8 4 4v3.5a7.5 7.5 0 0 1-4-1.2V15a6 6 0 1 1-6-6v3.6a2.5 2.5 0 1 0
    2.5 2.4V3z" /></svg>`,
}

export function renderSocialLinks(social = []) {
  const known = social.filter((account) => ICONS[account.network])
  if (known.length === 0) return null
  return h(
    'ul',
    { class: 'social-links' },
    known.map((account) => h('li', null, socialIcon(account))),
  )
}

function socialIcon({ network, url }) {
  const icon = fromMarkup(ICONS[network])
  if (url) {
    return h(
      'a',
      { class: 'social-link', href: url, 'aria-label': NAMES[network], ...external },
      icon,
    )
  }
  const label = `${NAMES[network]} (${ui('footer', 'comingSoon')})`
  return h(
    'span',
    { class: 'social-link is-soon', role: 'img', 'aria-label': label, title: label },
    icon,
  )
}
