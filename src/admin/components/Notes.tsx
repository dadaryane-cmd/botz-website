import Link from 'next/link'

export const FontNote = () => (
  <p style={{ margin: '0 0 1.5rem', color: 'var(--theme-elevation-600)', maxWidth: 680 }}>
    Every font option is paired with Noto Sans Armenian, so Armenian, Russian and English text always render correctly.
    Fonts are self-hosted by the website (no requests to Google from visitors).
  </p>
)

const note = { margin: '0 0 1rem', color: 'var(--theme-elevation-600)', maxWidth: 680 } as const

export const GrowthNote = () => (
  <p style={note}>
    The numbers and the “last updated” date come from <Link href="/admin/globals/growth-offer">Website → Growth &amp; offer</Link>. Update
    them there each month.
  </p>
)

export const OfferNote = () => (
  <p style={note}>
    The offer text, spots and discount come from <Link href="/admin/globals/growth-offer">Website → Growth &amp; offer</Link>. The banner
    hides itself when the offer is switched off there.
  </p>
)
