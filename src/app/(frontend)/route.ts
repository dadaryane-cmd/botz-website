import { NextResponse } from 'next/server'
import { isLocale } from '@/i18n/config'
import { payloadClient } from '@/lib/data'

export const dynamic = 'force-dynamic'

/**
 * The bare domain sends visitors to their saved language (cookie set by the
 * language switcher) or to the first-visit language chosen in Site settings.
 */
export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') ?? ''
  const saved = /(?:^|;\s*)botz-locale=(\w+)/.exec(cookie)?.[1]
  let locale = isLocale(saved) ? saved : null
  if (!locale) {
    const payload = await payloadClient()
    const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })) as { defaultLocale?: string }
    locale = isLocale(settings.defaultLocale) ? settings.defaultLocale : 'hy'
  }
  return NextResponse.redirect(new URL(`/${locale}`, req.url), 307)
}
