import { Caveat, Golos_Text, Manrope, Noto_Sans, Noto_Sans_Armenian, Unbounded } from 'next/font/google'

/**
 * Self-hosted at build time (no requests to Google from visitors).
 * Latin and Cyrillic come from the chosen display/body font, Armenian from Noto Sans Armenian.
 */
export const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--f-unbounded', display: 'swap' })
export const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--f-manrope', display: 'swap' })
export const golos = Golos_Text({ subsets: ['latin', 'cyrillic'], variable: '--f-golos', display: 'swap', preload: false })
export const noto = Noto_Sans({ subsets: ['latin', 'cyrillic'], variable: '--f-noto', display: 'swap', preload: false })
export const notoArmenian = Noto_Sans_Armenian({ subsets: ['armenian'], variable: '--f-armenian', display: 'swap' })

// Handwriting for the falling papers in the hero (canvas only, so it is not preloaded). No Armenian glyphs:
// Armenian phrases fall back to Noto Sans Armenian with a marker treatment.
export const caveat = Caveat({ subsets: ['latin', 'cyrillic'], weight: ['700'], variable: '--f-hand', display: 'swap', preload: false })

export const fontVariables = [unbounded, manrope, golos, noto, notoArmenian, caveat].map((f) => f.variable).join(' ')

type Font = { style: { fontFamily: string } }
const fonts: Record<string, Font> = { unbounded, manrope, golos, noto }

/** next/font families are "'Real Font', 'Real Font Fallback'"; split off the size-matched fallback. */
const split = (f: Font) => {
  const [primary, ...rest] = f.style.fontFamily.split(',').map((s) => s.trim())
  return { primary, fallbacks: rest }
}

/**
 * The generated "… Fallback" faces are local Arial for every character, so they must come after
 * Noto Sans Armenian — otherwise Armenian is drawn in Arial with faked bold instead of real weights.
 */
export const fontStack = (key: string | undefined, fallback: string) => {
  const chosen = split(fonts[key ?? fallback] ?? fonts[fallback])
  const armenian = split(notoArmenian)
  return [chosen.primary, armenian.primary, ...chosen.fallbacks, ...armenian.fallbacks, 'system-ui', 'sans-serif'].join(', ')
}

/** Canvas font families for the falling papers: handwriting, and Armenian (for Armenian letters). */
export const paperFonts = { hand: split(caveat).primary, armenian: split(notoArmenian).primary }
