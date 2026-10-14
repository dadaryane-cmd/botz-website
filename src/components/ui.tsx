import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Locale } from '@/i18n/config'
import type { ContactInfo } from '@/lib/contact'
import { resolveHref, type CmsLink } from '@/lib/links'

/** Render "*word*" segments as highlighted <em>. Optionally split into animated words. */
export function Highlight({ text, words = false }: { text?: string | null; words?: boolean }) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  let i = 0
  const renderWords = (s: string, hl: boolean) =>
    s.split(/(\s+)/).map((w, k) =>
      /^\s+$/.test(w) ? (
        w
      ) : (
        <span key={k} className="word" style={{ ['--i' as string]: i++ }}>
          {hl ? <em className="hl">{w}</em> : w}
        </span>
      ),
    )
  return (
    <>
      {parts.map((p, idx) => {
        const hl = p.startsWith('*') && p.endsWith('*')
        const s = hl ? p.slice(1, -1) : p
        if (words) return <span key={idx}>{renderWords(s, hl)}</span>
        return hl ? (
          <em key={idx} className="hl">
            {s}
          </em>
        ) : (
          <span key={idx}>{s}</span>
        )
      })}
    </>
  )
}

export const Arrow = () => (
  <svg className="arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function CmsButton({
  link,
  locale,
  contacts,
  className = '',
  children,
}: {
  link: CmsLink
  locale: Locale
  contacts?: ContactInfo
  className?: string
  children?: ReactNode
}) {
  const href = resolveHref(link, locale, contacts)
  if (!href) return null
  const style = link.appearance === 'secondary' ? 'btn btn-secondary' : link.appearance === 'link' ? 'btn btn-link' : 'btn'
  const label = children ?? (
    <>
      {link.label}
      {link.appearance !== 'link' && <Arrow />}
    </>
  )
  const external = /^https?:/.test(href)
  if (external || href.startsWith('#'))
    return (
      <a
        className={`${style} ${className}`}
        href={href}
        {...(external ? { target: link.newTab || link.type === 'contact' ? '_blank' : undefined, rel: 'noopener noreferrer' } : {})}
        {...(link.type === 'contact' ? { 'data-track': 'whatsapp_click', 'data-contact': link.contact ?? '' } : {})}
      >
        {label}
      </a>
    )
  return (
    <Link className={`${style} ${className}`} href={href}>
      {label}
    </Link>
  )
}

export function Eyebrow({ text }: { text?: string | null }) {
  return text ? <p className="eyebrow">{text}</p> : null
}

export const ServiceIcon = ({ service }: { service?: string | null }) => {
  const paths: Record<string, ReactNode> = {
    smm: <path d="M4 5h16v11H8l-4 4V5Zm4 4h8M8 12h5" />,
    seo: <path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm4.8 11.3L20 20M8 11l2 2 3.5-4" />,
    website: <path d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" />,
    bundle: <path d="M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />,
    addon: <path d="M12 5v14M5 12h14" />,
  }
  return (
    <span className="service-icon" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {paths[service ?? 'addon'] ?? paths.addon}
      </svg>
    </span>
  )
}

export const Icon = {
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinejoin="round" />
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18v12H3zM3 7l9 6 9-6" strokeLinejoin="round" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
}
