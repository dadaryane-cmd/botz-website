import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { telLink, whatsappLink } from '@/lib/contact'
import type { SiteData } from '@/lib/data'
import { linkVisible, resolveHref, type CmsLink } from '@/lib/links'
import { Logo } from './SiteHeader'
import { CmsButton, Highlight, Icon } from './ui'

export function SiteFooter({ site, locale }: { site: SiteData; locale: Locale }) {
  const c = site.contacts
  const s = site.strings
  const columns = (site.nav.footerColumns ?? []) as { title: string; links: CmsLink[] }[]
  return (
    <footer className="site-footer">
      <div className="container">
        {site.nav.footerStatement && (
          <p className="display footer-statement" data-reveal>
            <Highlight text={site.nav.footerStatement} />
          </p>
        )}
        {site.nav.headerCta?.label && (
          <div className="btn-row">
            <CmsButton link={{ ...site.nav.headerCta, appearance: 'primary' }} locale={locale} contacts={c} />
          </div>
        )}
        <div className="footer-grid">
          <div>
            <Logo site={site} locale={locale} variant="footer" />
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <h2>{col.title}</h2>
              <ul>
                {(col.links ?? [])
                  .filter((l) => linkVisible(l, site.has))
                  .map((l, j) => {
                    const href = resolveHref(l, locale, c)
                    return href ? (
                      <li key={j}>
                        <Link href={href}>{l.label}</Link>
                      </li>
                    ) : null
                  })}
              </ul>
            </div>
          ))}
          <div>
            <h2>{s.footer.contactTitle}</h2>
            <ul>
              <li>
                <a href={telLink(c.phoneE164)}>
                  {Icon.phone}&nbsp;{c.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappLink(c.whatsappNumber)} target="_blank" rel="noopener noreferrer">
                  {Icon.whatsapp}&nbsp;WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${c.email}`}>
                  {Icon.mail}&nbsp;{c.email}
                </a>
              </li>
              {c.instagramUrl && (
                <li>
                  <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer">
                    {Icon.instagram}&nbsp;Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.settings.siteName}. {s.footer.rights}
          </span>
          {site.nav.footerNote && <span>{site.nav.footerNote}</span>}
        </div>
      </div>
    </footer>
  )
}
