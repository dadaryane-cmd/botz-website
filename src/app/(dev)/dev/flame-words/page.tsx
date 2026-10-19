import { notFound } from 'next/navigation'
import { burnWords } from '@/seed/content'
import { paperFonts } from '../../../(frontend)/fonts'
import { FlameWordsLab } from './FlameWordsLab'

/**
 * /dev/flame-words — tune the falling-paper animation with sliders (values are mirrored in the URL,
 * e.g. ?BURN_MS=1200,1600&CURL=0.2). Development only: a 404 in production builds.
 */
export const dynamic = 'force-dynamic'

export default async function FlameWordsDevPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const params = await searchParams
  const initial = Object.fromEntries(Object.entries(params).filter((e): e is [string, string] => typeof e[1] === 'string'))
  const words = {
    en: burnWords.map((w) => w.text.en),
    hy: burnWords.map((w) => w.text.hy),
    ru: burnWords.map((w) => w.text.ru),
  }
  return <FlameWordsLab words={words} fonts={paperFonts} initial={initial} />
}
