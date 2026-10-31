/**
 * The BOTZ logo for both themes. Both images are rendered; CSS shows the one for the current
 * theme (header.css), so a theme change never re-renders anything.
 */
import { site } from '../content/index.js'
import { h } from '../lib/dom.js'
import { t } from '../lib/i18n.js'
import { splitLetters } from '../lib/letters.js'

const logoImage = (theme) =>
  h('img', {
    class: `logo-${theme}`,
    src: `images/botz-logo-${theme}.webp`,
    alt: t(site.name),
    width: 112,
    height: 44,
  })

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

/**
 * The logo inside a headline (`{logo}` in content), read as "BOTZ". The image hidden by the
 * theme is skipped by screen readers, so each one can carry the word.
 */
export const inlineLogo = () =>
  h(
    'span',
    { class: 'inline-logo' },
    ['light', 'dark'].map((theme) =>
      h('img', { class: `logo-${theme}`, src: `images/botz-logo-${theme}.webp`, alt: 'BOTZ' }),
    ),
  )
