'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n/config'

const text: Record<Locale, { title: string; body: string; back: string }> = {
  en: { title: 'Page not found', body: 'The page may have moved. Start from the home page.', back: 'Back to home' },
  hy: { title: 'Էջը չի գտնվել', body: 'Հնարավոր է՝ էջը տեղափոխվել է։ Սկսեք գլխավոր էջից։', back: 'Վերադառնալ գլխավոր էջ' },
  ru: { title: 'Страница не найдена', body: 'Возможно, страница переехала. Начните с главной.', back: 'На главную' },
}

/** Localized 404 — the language comes from the URL. */
export default function NotFound() {
  const seg = usePathname()?.split('/')[1]
  const locale: Locale = isLocale(seg) ? seg : 'hy'
  const t = text[locale]
  return (
    <main id="main" className="section pt-xl pb-xl">
      <div className="container">
        <h1 className="display h1">{t.title}</h1>
        <p className="lead">{t.body}</p>
        <div className="btn-row">
          <Link className="btn" href={`/${locale}`}>
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  )
}
