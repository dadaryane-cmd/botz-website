/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { localeShort, locales, type Locale } from '@/i18n/config'
import type { SiteData } from '@/lib/data'
import { linkVisible, resolveHref, type CmsLink } from '@/lib/links'
import { BulbThemeToggle } from './client/BulbThemeToggle'
import { HeaderShell, MobileMenu } from './client/HeaderClient'
import { CmsButton } from './ui'

export type Alternates = Record<Locale, string | null>

export function LocaleSwitcher({ locale, alternates, site }: { locale: Locale; alternates: Alternates; site: SiteData }) {
  const s = site.strings.common
  return (
    <nav className="lang-switch" aria-label={s.language}>
      {locales.map((l) => {
        const href = alternates[l]
        if (l === locale)
          return (
            <span key={l} aria-current="true" lang={l}>
              {localeShort[l]}
            </span>
          )
        // Untranslated page: say so and go to that language's home page instead of a missing page.
        if (!href)
          return (
            <a key={l} href={`/${l}`} lang={l} className="unavailable" title={s.notAvailableInLanguage} data-track="language_select" data-locale={l}>
              {localeShort[l]}
              <span className="sr-only"> — {s.notAvailableInLanguage}</span>
            </a>
          )
        return (
          <a key={l} href={href} lang={l} hrefLang={l} data-track="language_select" data-locale={l}>
            {localeShort[l]}
          </a>
        )
      })}
    </nav>
  )
}

export function Logo({ site, locale, variant = 'header' }: { site: SiteData; locale: Locale; variant?: 'header' | 'footer' }) {
  const logos = site.theme.logos ?? {}
  const light = logos.logoLight?.url ?? '/brand/botz-logo-light.webp'
  const dark = logos.logoDark?.url ?? '/brand/botz-logo-dark.webp'
  const mark = logos.mark?.url ?? '/brand/botz-mark.webp'
  // Without a custom upload, dark mode uses the B exactly as drawn in the dark logo.
  const markDark = logos.mark?.url ?? '/brand/botz-mark-dark.webp'
  const name = site.settings.siteName ?? 'BOTZ Marketing Agency'
  if (variant === 'footer')
    return (
      <Link href={`/${locale}`} className="footer-logo">
        {/* The footer uses the inverse background: dark in light mode, warm white in dark mode.
            Only one variant is displayed at a time (the others are display:none), so the name is read once. */}
        <img className="footer-logo-on-dark" src={dark} alt={name} width={974} height={381} loading="lazy" />
        <img className="footer-logo-on-light" src={light} alt={name} width={973} height={381} loading="lazy" />
      </Link>
    )
  return (
    <Link href={`/${locale}`} className="brand">
      <img className="brand-full logo-light" src={light} alt={name} width={973} height={381} />
      <img className="brand-full logo-dark" src={dark} alt={name} width={974} height={381} />
      <img className="brand-mark logo-light" src={mark} alt={name} width={709} height={1097} />
      <img className="brand-mark logo-dark" src={markDark} alt={name} width={206} height={320} />
    </Link>
  )
}

export function SiteHeader({
  site,
  locale,
  alternates,
  currentPath,
}: {
  site: SiteData
  locale: Locale
  alternates: Alternates
  currentPath: string
}) {
  const items = ((site.nav.header ?? []) as CmsLink[]).filter((l) => linkVisible(l, site.has))
  const s = site.strings.common
  const navList = (
    <ul>
      {items.map((item, i) => {
        const href = resolveHref(item, locale, site.contacts)
        if (!href) return null
        return (
          <li key={i}>
            <Link href={href} aria-current={href === currentPath ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
  const cta = site.nav.headerCta as CmsLink | undefined
  return (
    <HeaderShell>
      <div className="container header-inner">
        <Logo site={site} locale={locale} />
        <nav className="main-nav" aria-label={s.menu}>
          {navList}
        </nav>
        <div className="header-tools">
          <LocaleSwitcher locale={locale} alternates={alternates} site={site} />
          <BulbThemeToggle
            labels={{ toLight: s.switchToLight, toDark: s.switchToDark, theme: s.theme, hint: s.pullHint, tooltip: site.strings.trust.themeTooltip }}
          />
          {cta?.label && <CmsButton link={{ ...cta, appearance: 'primary' }} locale={locale} contacts={site.contacts} className="btn-sm header-cta" />}
          <MobileMenu label={s.menu} closeLabel={s.close}>
            <nav className="menu-links" aria-label={s.menu}>{navList}</nav>
            {cta?.label && <CmsButton link={{ ...cta, appearance: 'primary' }} locale={locale} contacts={site.contacts} />}
            <div style={{ marginTop: 24 }}>
              <LocaleSwitcher locale={locale} alternates={alternates} site={site} />
            </div>
          </MobileMenu>
        </div>
      </div>
    </HeaderShell>
  )
}
