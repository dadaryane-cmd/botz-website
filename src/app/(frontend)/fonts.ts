import { Golos_Text, Manrope, Noto_Sans, Noto_Sans_Armenian, Unbounded } from 'next/font/google'

/**
 * Self-hosted at build time (no requests to Google from visitors).
 * Every stack ends with Noto Sans Armenian so Armenian glyphs always render;
 * Latin and Cyrillic come from the chosen display/body font.
 */
export const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--f-unbounded', display: 'swap' })
export const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--f-manrope', display: 'swap' })
export const golos = Golos_Text({ subsets: ['latin', 'cyrillic'], variable: '--f-golos', display: 'swap', preload: false })
export const noto = Noto_Sans({ subsets: ['latin', 'cyrillic'], variable: '--f-noto', display: 'swap', preload: false })
export const notoArmenian = Noto_Sans_Armenian({ subsets: ['armenian', 'latin'], variable: '--f-armenian', display: 'swap' })

export const fontVariables = [unbounded, manrope, golos, noto, notoArmenian].map((f) => f.variable).join(' ')

const stacks: Record<string, string> = {
  unbounded: 'var(--f-unbounded)',
  manrope: 'var(--f-manrope)',
  golos: 'var(--f-golos)',
  noto: 'var(--f-noto)',
}

export const fontStack = (key: string | undefined, fallback: string) =>
  `${stacks[key ?? fallback] ?? stacks[fallback]}, var(--f-armenian), system-ui, sans-serif`
