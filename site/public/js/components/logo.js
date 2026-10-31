/**
 * The BOTZ logo for both themes. Both images are rendered; CSS shows the one for the current
 * theme (header.css), so a theme change never re-renders anything.
 */
import { site } from '../content/index.js'
import { h } from '../lib/dom.js'
import { t } from '../lib/i18n.js'

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
