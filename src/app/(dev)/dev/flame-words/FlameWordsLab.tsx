'use client'

import { useMemo, useState } from 'react'
import { FlameBackground } from '@/components/client/FlameBackground'
import { FlameWords, PAPER_TUNING, type PaperTuning } from '@/components/client/FlameWords'

type Lang = 'en' | 'hy' | 'ru'
type Key = keyof PaperTuning

/** The values most worth tuning, with slider limits. Ranges get two sliders (min / max). */
const CONTROLS: { key: Key; min: number; max: number; step: number; note: string }[] = [
  { key: 'BURN_MS', min: 600, max: 4000, step: 50, note: 'Burn duration (ms)' },
  { key: 'BURN_LINE', min: 0.3, max: 0.95, step: 0.01, note: 'Ignition height (share of hero)' },
  { key: 'BURN_SLOWDOWN', min: 0, max: 1, step: 0.05, note: 'Fall speed while burning' },
  { key: 'CURL', min: 0, max: 0.5, step: 0.01, note: 'Curl while burning' },
  { key: 'RIM_WIDTH', min: 0.005, max: 0.1, step: 0.001, note: 'Glowing rim width' },
  { key: 'CHAR_WIDTH', min: 0.01, max: 0.25, step: 0.005, note: 'Char band width' },
  { key: 'EMBERS_PER_SEC', min: 0, max: 160, step: 1, note: 'Embers per second' },
  { key: 'EMBER_SPEED', min: 10, max: 250, step: 5, note: 'Ember rising speed' },
  { key: 'ASH_PER_SEC', min: 0, max: 60, step: 1, note: 'Ash flakes per second' },
  { key: 'GLOW', min: 0, max: 1, step: 0.05, note: 'Local fire glow' },
  { key: 'FIRELIGHT', min: 0, max: 1, step: 0.02, note: 'Firelight on paper' },
  { key: 'LIGHT_TOP', min: 0, max: 1, step: 0.02, note: 'Brightness near the top' },
  { key: 'EDGE_DARKEN', min: 0, max: 1, step: 0.02, note: 'Darkening edge-on' },
  { key: 'FALL_SPEED', min: 30, max: 400, step: 5, note: 'Fall speed (flat / edge-on)' },
  { key: 'TUMBLE', min: 0, max: 6, step: 0.1, note: 'Tumble speed (rad/s)' },
  { key: 'GAP_MS', min: 300, max: 8000, step: 100, note: 'Gap between drops (ms)' },
  { key: 'MAX_ACTIVE', min: 1, max: 6, step: 1, note: 'Max scraps (desktop)' },
  { key: 'MAX_ACTIVE_MOBILE', min: 1, max: 4, step: 1, note: 'Max scraps (mobile)' },
]

const parse = (key: Key, raw: string): number | [number, number] | null => {
  const def = PAPER_TUNING[key]
  const nums = raw.split(',').map(Number)
  if (nums.some((n) => !Number.isFinite(n))) return null
  if (Array.isArray(def)) return nums.length === 2 ? [nums[0], nums[1]] : null
  return nums.length === 1 ? nums[0] : null
}

const copy: Record<Lang, { h: string; sub: string }> = {
  en: { h: 'Make your brand impossible to scroll past.', sub: 'Preview of the falling-paper animation. Adjust the sliders; the URL keeps your values.' },
  hy: { h: 'Ձեր բիզնեսն ավելի տեսանելի ԲՈՑ-ի շնորհիվ։', sub: 'Թղթերի անիմացիայի նախադիտում։' },
  ru: { h: 'Бренд, который невозможно пролистать.', sub: 'Предпросмотр анимации падающих листков.' },
}

export function FlameWordsLab({ words, fonts, initial }: { words: Record<Lang, string[]>; fonts: { hand: string; armenian: string }; initial: Record<string, string> }) {
  const [lang, setLang] = useState<Lang>(initial.lang === 'hy' || initial.lang === 'ru' ? initial.lang : 'en')
  const [values, setValues] = useState<Partial<PaperTuning>>(() => {
    const out: Record<string, unknown> = {}
    for (const c of CONTROLS) {
      const v = initial[c.key] ? parse(c.key, initial[c.key]) : null
      if (v !== null) out[c.key] = v
    }
    return out as Partial<PaperTuning>
  })
  const [open, setOpen] = useState(true)
  // Re-create the animation only when the values actually change.
  const tuning = useMemo(() => values, [values])

  const update = (key: Key, v: number | [number, number]) => {
    const next = { ...values, [key]: v }
    setValues(next)
    const q = new URLSearchParams(Object.entries(next).map(([k, x]) => [k, Array.isArray(x) ? x.join(',') : String(x)]))
    q.set('lang', lang)
    window.history.replaceState(null, '', `?${q.toString()}`)
  }
  const current = (key: Key) => (values[key] ?? PAPER_TUNING[key]) as number | [number, number]

  return (
    <main>
      <section className="section hero hero-flame-variant">
        <div className="hero-flame-stage">
          <FlameBackground
            video={{ webm: '/brand/hero-flame.webm', mp4: '/brand/hero-flame.mp4' }}
            poster={{ dark: '/brand/hero-flame-poster-dark.webp', light: '/brand/hero-flame-poster-light.webp' }}
          />
          <FlameWords key={lang} words={words[lang]} fonts={fonts} tuning={tuning} />
          <div className="container hero-flame-content">
            <div className="hero-copy" lang={lang}>
              <h1 className="display h1">{copy[lang].h}</h1>
              <p className="lead hero-sub">{copy[lang].sub}</p>
              <div className="btn-row">
                <a className="btn" href="#">
                  Get a free audit
                </a>
                <a className="btn btn-secondary" href="#">
                  Explore packages
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside
        style={{
          position: 'fixed',
          right: 12,
          bottom: 12,
          zIndex: 100,
          width: 'min(360px, calc(100vw - 24px))',
          maxHeight: '70vh',
          overflow: 'auto',
          padding: 14,
          borderRadius: 14,
          background: 'rgba(14,14,15,0.92)',
          border: '1px solid #333',
          color: '#eee',
          font: '12px/1.4 system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
          <strong>Falling papers — tuning</strong>
          <button type="button" onClick={() => setOpen((o) => !o)}>
            {open ? 'Hide' : 'Show'}
          </button>
        </div>
        {open && (
          <>
            <p style={{ margin: '8px 0' }}>
              Phrases:{' '}
              {(['en', 'hy', 'ru'] as Lang[]).map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)} style={{ marginRight: 4, fontWeight: l === lang ? 700 : 400 }}>
                  {l}
                </button>
              ))}{' '}
              <button
                type="button"
                onClick={() => {
                  setValues({})
                  window.history.replaceState(null, '', '?')
                }}
              >
                Reset
              </button>
            </p>
            {CONTROLS.map((c) => {
              const v = current(c.key)
              const pair = Array.isArray(v)
              return (
                <label key={c.key} style={{ display: 'block', margin: '8px 0' }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{c.note}</span>
                    <code>{pair ? `${v[0]} – ${v[1]}` : v}</code>
                  </span>
                  {pair ? (
                    <span style={{ display: 'flex', gap: 6 }}>
                      <input type="range" min={c.min} max={c.max} step={c.step} value={v[0]} onChange={(e) => update(c.key, [Number(e.target.value), Math.max(Number(e.target.value), v[1])])} style={{ flex: 1 }} />
                      <input type="range" min={c.min} max={c.max} step={c.step} value={v[1]} onChange={(e) => update(c.key, [Math.min(v[0], Number(e.target.value)), Number(e.target.value)])} style={{ flex: 1 }} />
                    </span>
                  ) : (
                    <input type="range" min={c.min} max={c.max} step={c.step} value={v} onChange={(e) => update(c.key, Number(e.target.value))} style={{ width: '100%' }} />
                  )}
                </label>
              )
            })}
            <p style={{ margin: '8px 0 0', opacity: 0.7 }}>Copy the URL to share a setting. Final values go into PAPER_TUNING in FlameWords.tsx.</p>
          </>
        )}
      </aside>
    </main>
  )
}
