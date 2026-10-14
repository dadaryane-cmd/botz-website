import { themeDefaults } from '@/globals/Theme'

type Palette = typeof themeDefaults.light
type Raw = Record<string, any>

const hex = (v: unknown, d: string) => (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : d)

const vars = (p: Palette, d: Palette) => `--bg:${hex(p.bg, d.bg)};--surface:${hex(p.surface, d.surface)};--text:${hex(p.text, d.text)};--muted:${hex(p.muted, d.muted)};--border:${hex(p.border, d.border)};--accent:${hex(p.accent, d.accent)};--accent-text:${hex(p.accentText, d.accentText)};--on-accent:${hex(p.onAccent, d.onAccent)};--inverse-bg:${hex(p.inverseBg, d.inverseBg)};--inverse-text:${hex(p.inverseText, d.inverseText)};`

/** CSS custom properties for both themes, generated from the Design & brand global. */
export function themeCss(theme: Raw, fonts: { display: string; body: string }): string {
  const light = vars(theme.light ?? {}, themeDefaults.light)
  const dark = vars(theme.dark ?? {}, themeDefaults.dark)
  const t = theme.type ?? {}
  const scale = { md: 0.78, lg: 0.9, xl: 1 }[t.headingScale as 'md' | 'lg' | 'xl'] ?? 1
  const btnR = Number.isFinite(t.buttonRadius) ? Math.max(0, Math.min(999, t.buttonRadius)) : 999
  const cardR = Number.isFinite(t.cardRadius) ? Math.max(0, Math.min(48, t.cardRadius)) : 28
  return [
    `:root,[data-theme="light"]{${light}color-scheme:light;}`,
    `[data-theme="dark"]{${dark}color-scheme:dark;}`,
    `:root{--font-display:${fonts.display};--font-body:${fonts.body};--h-scale:${scale};--r-btn:${btnR}px;--r-card:${cardR}px;--btn-style:${t.buttonStyle === 'contrast' ? 'contrast' : 'solid'};}`,
  ].join('\n')
}
