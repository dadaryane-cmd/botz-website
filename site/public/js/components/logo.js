/**
 * The BOTZ logo for both themes. Both images are rendered; CSS shows the one for the current
 * theme (header.css), so a theme change never re-renders anything.
 */
import { site } from '../content/index.js'
import { h } from '../lib/dom.js'
import { t } from '../lib/i18n.js'
import { splitLetters } from '../lib/letters.js'
import { picture } from './picture.js'

/** The display width of the header and footer logo (css: header.css, footer.css). */
const SMALL_LOGO_SIZES = '112px'

/**
 * The image files of one theme's logo: a 240px file for the small header and footer logo (sharp
 * on high-density screens) and the 600px original for large uses; `sizes` says which applies.
 */
export const logoSources = (theme, sizes = SMALL_LOGO_SIZES) => ({
  src: `images/botz-logo-${theme}.webp`,
  srcset: `images/botz-logo-${theme}-240.webp 240w, images/botz-logo-${theme}.webp 600w`,
  avif: `images/botz-logo-${theme}-240.avif 240w, images/botz-logo-${theme}.avif 600w`,
  sizes,
})

/** One theme's logo, as AVIF with a WebP fallback; `theme` is the page theme it is drawn for. */
export const logoPicture = (theme, attributes = {}) =>
  picture({ class: `logo-${theme}`, ...logoSources(theme), ...attributes })

const logoImage = (theme) => logoPicture(theme, { alt: t(site.name), width: 112, height: 44 })

export const logoImages = () => [logoImage('light'), logoImage('dark')]

/**
 * Words right after the logo in a heading take the logo's proportions: a capital first letter
 * stays as tall as the logo's B, and the other letters are drawn as tall as its "OTZ"
 * (`.logo-letters` in hero.css). "We are {logo} Team." → T as tall as B, "eam." as tall as OTZ.
 */
export function matchLogoLetters(heading) {
  const logo = heading.querySelector('.inline-logo')
  if (!logo) return
  let word = (logo.closest('.word') ?? logo).nextElementSibling
  while (word?.classList.contains('word')) {
    const [first = '', ...others] = splitLetters(word.textContent)
    const isCapital = first !== first.toLowerCase()
    const rest = isCapital ? others.join('') : first + others.join('')
    word.replaceChildren(isCapital ? first : '', h('span', { class: 'logo-letters' }, rest))
    word = word.nextElementSibling
  }
}

/** About 2.7em wide in a page title: up to ~125px on phones and ~280px on large screens. */
const INLINE_LOGO_SIZES = '(max-width: 759px) 130px, 280px'

/**
 * The logo inside a headline (`{logo}` in content), read as "BOTZ". The image hidden by the
 * theme is skipped by screen readers, so each one can carry the word.
 */
export const inlineLogo = () =>
  h(
    'span',
    { class: 'inline-logo' },
    // width/height give the proportions, so its space is kept before the file arrives (CSS sets
    // the size); otherwise the words after it would move when it loads.
    ['light', 'dark'].map((theme) =>
      logoPicture(theme, { alt: 'BOTZ', sizes: INLINE_LOGO_SIZES, width: 600, height: 235 }),
    ),
  )
