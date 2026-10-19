'use client'

/**
 * <FlameWords /> — “Bad marketing burns”. Short phrases (“Bad marketing”, “Zero results”, …) are
 * handwritten on scraps of warm off-white paper that tumble down the hero, catch fire when they reach
 * the flames, and burn away into embers and ash. Purely decorative (aria-hidden, no pointer events);
 * the phrases come from the hero block's “Words on falling papers” list.
 *
 * How it works (Canvas 2D, one requestAnimationFrame loop):
 *  - Each scrap is pre-rendered once: front (paper, fibres, ink) and back (blank, ink showing through).
 *  - Every frame a small per-scrap canvas re-lights it: darker when edge-on or facing away, dim near
 *    the top of the dark page, tinted orange by firelight lower down.
 *  - At its burn line the scrap ignites at a random point on the edge facing the fire. A noise map
 *    decides, per pixel, whether it is paper, toasted, charred, the glowing rim, crumbling ash or gone.
 *    While burning the scrap curls (drawn in strips), slows (heat lift), and sheds embers and ash.
 *  - Scraps never pass behind the copy: each one gets a column that clears every line of text,
 *    measured from the real text line boxes. Where no column is free (phones) it starts below the copy.
 *  - Nothing runs on the light theme, with reduced motion or data-motion="off"; the loop stops while the
 *    hero is off-screen or the tab is hidden.
 */
import { useEffect, useRef } from 'react'

type Range = [number, number]

export type PaperTuning = {
  /** Pause between drops (ms). The first scrap drops after FIRST_DROP_MS. */
  GAP_MS: Range
  FIRST_DROP_MS: number
  /** “Subtle” animation: gaps × this, one scrap fewer, particles × SUBTLE_PARTICLES. */
  SUBTLE_GAP_FACTOR: number
  SUBTLE_PARTICLES: number
  /** Scraps on screen at once, desktop / mobile (below MOBILE_BREAKPOINT px). */
  MAX_ACTIVE: number
  MAX_ACTIVE_MOBILE: number
  MOBILE_BREAKPOINT: number
  /** Share of scraps that start on the right-hand side (mobile / desktop). */
  RIGHT_BIAS_MOBILE: number
  RIGHT_BIAS_DESKTOP: number
  /** Falling speed (px/s): flat-on falls at the low end, edge-on at the high end. */
  FALL_SPEED: Range
  /** How quickly speed follows the flip (higher = snappier, lower = smoother). */
  SPEED_EASE: number
  /** Tumbling (rad/s), sideways drift on air currents (px) and wobble (deg). */
  TUMBLE: Range
  DRIFT_PX: Range
  WOBBLE_DEG: Range
  /** Handwriting size (px), widest line before wrapping, and how far long phrases may shrink. */
  FONT_SIZE: number
  FONT_SIZE_MOBILE: number
  MAX_TEXT_WIDTH: number
  MAX_TEXT_WIDTH_MOBILE: number
  MIN_FONT_SCALE: number
  /** Paper and ink. */
  PAPER_COLOR: string
  INK_COLOR: string
  STRIKE_CHANCE: number
  /** Lighting: brightness near the top of the hero (0–1), firelight strength low down, its colour (r,g,b). */
  LIGHT_TOP: number
  FIRELIGHT: number
  FIRELIGHT_RGB: string
  /** Darkening when edge-on / showing the back. */
  EDGE_DARKEN: number
  BACK_DARKEN: number
  /** Above this speed (px/s) a faint trailing copy gives a hint of motion blur. */
  MOTION_BLUR_SPEED: number
  /** Where scraps ignite, as a share of the hero height (randomised per scrap). */
  BURN_LINE: Range
  /** Burn duration (ms). */
  BURN_MS: Range
  /** Fall speed while burning (share of normal — heat lifts the scrap). */
  BURN_SLOWDOWN: number
  /** Curl / crumple while burning (0 = flat). */
  CURL: number
  /** Burn bands, in burn-map units (0–1 across the scrap): glowing rim, char, toasted paper, ash. */
  RIM_WIDTH: number
  CHAR_WIDTH: number
  TOAST_WIDTH: number
  ASH_WIDTH: number
  /** Rim colours (front of the flame / behind it) and char colour, as r,g,b. */
  RIM_HOT_RGB: string
  RIM_RGB: string
  CHAR_RGB: string
  /** Embers: per second (at full burning edge), rising speed (px/s), lifetime (s). */
  EMBERS_PER_SEC: number
  EMBER_SPEED: Range
  EMBER_LIFE: Range
  /** Ash flakes per second, and the overall particle cap. */
  ASH_PER_SEC: number
  MAX_PARTICLES: number
  /** Local brightening of the fire where a scrap burns (0 = off). */
  GLOW: number
  /** Clear space (px) kept between a falling scrap and any line of the hero text. */
  TEXT_CLEARANCE: number
  /** Resolution caps. */
  PAPER_PIXEL_RATIO: number
  CANVAS_PIXEL_RATIO: number
}

export const PAPER_TUNING: PaperTuning = {
  GAP_MS: [2200, 3600],
  FIRST_DROP_MS: 700,
  SUBTLE_GAP_FACTOR: 1.7,
  SUBTLE_PARTICLES: 0.5,
  MAX_ACTIVE: 3,
  MAX_ACTIVE_MOBILE: 2,
  MOBILE_BREAKPOINT: 760,
  RIGHT_BIAS_MOBILE: 0.75,
  RIGHT_BIAS_DESKTOP: 0.7,
  FALL_SPEED: [90, 210],
  SPEED_EASE: 2.2,
  TUMBLE: [1.0, 2.4],
  DRIFT_PX: [10, 24],
  WOBBLE_DEG: [5, 12],
  FONT_SIZE: 19,
  FONT_SIZE_MOBILE: 13,
  MAX_TEXT_WIDTH: 170,
  MAX_TEXT_WIDTH_MOBILE: 100,
  MIN_FONT_SCALE: 0.7,
  PAPER_COLOR: '#efe8dc',
  INK_COLOR: '#1f1b17',
  STRIKE_CHANCE: 0.45,
  LIGHT_TOP: 0.55,
  FIRELIGHT: 0.42,
  FIRELIGHT_RGB: '255,128,40',
  EDGE_DARKEN: 0.45,
  BACK_DARKEN: 0.16,
  MOTION_BLUR_SPEED: 190,
  BURN_LINE: [0.6, 0.76],
  BURN_MS: [1300, 1900],
  BURN_SLOWDOWN: 0.35,
  CURL: 0.16,
  RIM_WIDTH: 0.028,
  CHAR_WIDTH: 0.075,
  TOAST_WIDTH: 0.16,
  ASH_WIDTH: 0.05,
  RIM_HOT_RGB: '255,236,170',
  RIM_RGB: '255,120,30',
  CHAR_RGB: '24,15,9',
  EMBERS_PER_SEC: 48,
  EMBER_SPEED: [40, 115],
  EMBER_LIFE: [0.6, 1.4],
  ASH_PER_SEC: 10,
  MAX_PARTICLES: 280,
  GLOW: 0.45,
  TEXT_CLEARANCE: 16,
  PAPER_PIXEL_RATIO: 1.5,
  CANVAS_PIXEL_RATIO: 2,
}

type Kind = 'sheet' | 'torn' | 'square'
const KINDS: Kind[] = ['sheet', 'torn', 'square']

type Surface = { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; orig: Uint8ClampedArray; img: ImageData; opaque: Int32Array; map: Float32Array | null }
type Paper = {
  front: Surface
  back: Surface
  noise: Float32Array
  grain: Uint8Array
  W: number // device pixels
  H: number
  w: number // css px (paper without padding)
  h: number
  pad: number
  pr: number
  comp: HTMLCanvasElement
  cctx: CanvasRenderingContext2D
  born: number
  x0: number
  y: number
  /** Never above its start: the heat lift must not carry a scrap back up towards the text. */
  minY: number
  v: number
  vMin: number
  vMax: number
  phi: number
  omega: number
  flipAxis: 'x' | 'y'
  drift: [number, number, number, number]
  wobble: [number, number, number]
  rot0: number
  burnY: number
  burnMs: number
  ignitedAt: number
  frame: number
  // per frame
  x: number
  rot: number
  sx: number
  sy: number
  edge: number[]
}
type Particle = { ash: boolean; x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; a: number; spin: number; wob: number; ph: number }

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const pickRange = (r: Range) => rand(r[0], r[1])
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const motion = () => {
  const m = document.documentElement.dataset.motion
  if (m === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  return m === 'subtle' ? 'subtle' : 'full'
}
const isDark = () => document.documentElement.dataset.theme === 'dark'
const rgb = (s: string) => s.split(',').map(Number) as [number, number, number]

/* ───────────────────────── Paper drawing ───────────────────────── */

/** Smooth 2D value noise in [0, 1] on a grid of `cell` pixels. */
function valueNoise(W: number, H: number, cell: number) {
  const gw = Math.ceil(W / cell) + 2
  const grid = new Float32Array(gw * (Math.ceil(H / cell) + 2)).map(() => Math.random())
  const out = new Float32Array(W * H)
  for (let y = 0; y < H; y++) {
    const fy = y / cell
    const iy = Math.floor(fy)
    const ty = fy - iy
    const sy = ty * ty * (3 - 2 * ty)
    for (let x = 0; x < W; x++) {
      const fx = x / cell
      const ix = Math.floor(fx)
      const tx = fx - ix
      const sx = tx * tx * (3 - 2 * tx)
      const a = grid[iy * gw + ix]
      const b = grid[iy * gw + ix + 1]
      const c = grid[(iy + 1) * gw + ix]
      const d = grid[(iy + 1) * gw + ix + 1]
      out[y * W + x] = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
    }
  }
  return out
}

/** A slightly irregular (or torn) outline around a w×h rectangle. */
function paperPath(ctx: CanvasRenderingContext2D, w: number, h: number, torn: boolean) {
  const j = (amp: number) => rand(-amp, amp)
  const edge = (x0: number, y0: number, x1: number, y1: number, amp: number, step: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step))
    for (let i = 1; i <= n; i++) {
      const t = i / n
      ctx.lineTo(x0 + (x1 - x0) * t + (i < n ? j(amp) : 0), y0 + (y1 - y0) * t + (i < n ? j(amp) : 0))
    }
  }
  ctx.beginPath()
  ctx.moveTo(0, 0)
  edge(0, 0, w, 0, torn ? 2.4 : 0.6, torn ? 5 : 16)
  edge(w, 0, w, h, 0.6, 16)
  edge(w, h, 0, h, torn ? 0.9 : 0.6, 13)
  edge(0, h, 0, 0, 0.6, 16)
  ctx.closePath()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word
    if (line && ctx.measureText(next).width > max) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function surfaceFrom(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Surface {
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const opaque: number[] = []
  for (let i = 0, n = canvas.width * canvas.height; i < n; i++) if (img.data[i * 4 + 3] > 0) opaque.push(i)
  return { canvas, ctx, orig: new Uint8ClampedArray(img.data), img, opaque: Int32Array.from(opaque), map: null }
}

function makePaper(text: string, kind: Kind, mobile: boolean, fonts: { hand: string; armenian: string }, T: PaperTuning) {
  const armenian = /[Ա-և]/.test(text)
  const base = mobile ? T.FONT_SIZE_MOBILE : T.FONT_SIZE
  const maxW = mobile ? T.MAX_TEXT_WIDTH_MOBILE : T.MAX_TEXT_WIDTH
  // Caveat has a small x-height, so it is set larger; Armenian uses a bold sans with a marker treatment.
  const fontAt = (s: number) => (armenian ? `800 ${s * 0.82}px ${fonts.armenian}, sans-serif` : `700 ${s * 1.28}px ${fonts.hand}, ${fonts.armenian}, cursive`)

  const front = document.createElement('canvas')
  const ctx = front.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  // Long phrases: wrap, then shrink until every line fits (down to MIN_FONT_SCALE).
  let size = base
  let lines: string[] = []
  for (let k = 0; k < 6; k++) {
    ctx.font = fontAt(size)
    lines = wrap(ctx, text, maxW)
    if (lines.length <= 2 && Math.max(...lines.map((l) => ctx.measureText(l).width)) <= maxW * 1.05) break
    if (size <= base * T.MIN_FONT_SCALE) break
    size = Math.max(base * T.MIN_FONT_SCALE, size * 0.92)
  }
  ctx.font = fontAt(size)
  const lineH = size * (armenian ? 1.25 : 1.15)
  const textW = Math.max(...lines.map((l) => ctx.measureText(l).width))
  const padX = size * 0.9
  const padY = size * (kind === 'square' ? 0.9 : 0.65)
  let w = textW + padX * 2
  let h = lines.length * lineH + padY * 2
  // Square scraps only for short phrases (a long phrase would make a huge square); otherwise a sheet.
  if (kind === 'square' && w <= size * 5.2) w = h = Math.max(w, h, size * 3.6)
  w = Math.round(w)
  h = Math.round(h)
  const pad = 7
  const pr = Math.min(window.devicePixelRatio || 1, T.PAPER_PIXEL_RATIO)
  const W = Math.ceil((w + pad * 2) * pr)
  const H = Math.ceil((h + pad * 2) * pr)

  // Blank sheet (shared by both sides): warm off-white, soft shadow, curvature shading, fibres and grain.
  const blank = document.createElement('canvas')
  blank.width = W
  blank.height = H
  const b = blank.getContext('2d') as CanvasRenderingContext2D
  b.scale(pr, pr)
  b.translate(pad, pad)
  paperPath(b, w, h, kind === 'torn')
  b.save()
  b.shadowColor = 'rgba(0,0,0,0.4)'
  b.shadowBlur = 5
  b.shadowOffsetY = 2
  b.fillStyle = T.PAPER_COLOR
  b.fill()
  b.restore()
  b.save()
  b.clip()
  const shade = b.createLinearGradient(0, 0, w, h)
  shade.addColorStop(0, 'rgba(255,255,255,0.12)')
  shade.addColorStop(0.5, 'rgba(255,255,255,0)')
  shade.addColorStop(1, 'rgba(60,40,20,0.10)')
  b.fillStyle = shade
  b.fillRect(0, 0, w, h)
  for (let i = 0; i < (w * h) / 70; i++) {
    b.fillStyle = Math.random() < 0.5 ? `rgba(90,70,50,${rand(0.03, 0.07)})` : `rgba(255,255,255,${rand(0.05, 0.12)})`
    const fx = rand(0, w)
    const fy = rand(0, h)
    b.fillRect(fx, fy, rand(1, 3), 0.6)
  }
  b.restore()

  // Front: paper + marker ink (a faint offset pass gives the ink some bleed), optional red strike.
  front.width = W
  front.height = H
  ctx.drawImage(blank, 0, 0)
  ctx.save()
  ctx.scale(pr, pr)
  ctx.translate(pad, pad)
  ctx.font = fontAt(size)
  ctx.textBaseline = 'middle'
  lines.forEach((line, i) => {
    const lw = ctx.measureText(line).width
    const cx = w / 2
    // Vertically centred (square scraps are taller than their text).
    const cy = (h - lines.length * lineH) / 2 + lineH * (i + 0.5)
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(rand(-0.035, 0.035))
    ctx.fillStyle = T.INK_COLOR
    ctx.globalAlpha = 0.28
    ctx.fillText(line, -lw / 2 + 0.5, 0.4)
    ctx.globalAlpha = 0.92
    ctx.fillText(line, -lw / 2, 0)
    ctx.globalAlpha = 1
    if (Math.random() < T.STRIKE_CHANCE) {
      ctx.strokeStyle = 'rgba(200, 36, 26, 0.85)'
      ctx.lineWidth = size * 0.13
      ctx.lineCap = 'round'
      const dy = rand(-size * 0.12, size * 0.12)
      ctx.beginPath()
      ctx.moveTo(-lw / 2 - 5, dy)
      ctx.quadraticCurveTo(0, -dy + rand(-2, 2), lw / 2 + 5, -dy * 0.6)
      ctx.stroke()
    }
    ctx.restore()
  })
  ctx.restore()

  // Back: the blank sheet mirrored, the ink faintly showing through.
  const back = document.createElement('canvas')
  back.width = W
  back.height = H
  const k = back.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
  k.translate(W, 0)
  k.scale(-1, 1)
  k.drawImage(blank, 0, 0)
  k.globalCompositeOperation = 'source-atop'
  k.globalAlpha = 0.09
  k.drawImage(front, 0, 0)
  k.setTransform(1, 0, 0, 1, 0, 0)
  k.globalAlpha = 1
  k.globalCompositeOperation = 'source-over'

  // Noise for the burn front (computed once; the burn map itself is built at ignition).
  const n1 = valueNoise(W, H, 22 * pr)
  const n2 = valueNoise(W, H, 7 * pr)
  const noise = new Float32Array(W * H)
  for (let i = 0; i < noise.length; i++) noise[i] = n1[i] * 0.72 + n2[i] * 0.28
  const grain = new Uint8Array(W * H)
  for (let i = 0; i < grain.length; i++) grain[i] = (Math.random() * 256) | 0

  const comp = document.createElement('canvas')
  comp.width = W
  comp.height = H
  return {
    front: surfaceFrom(front, ctx),
    back: surfaceFrom(back, k),
    noise,
    grain,
    W,
    H,
    w,
    h,
    pad,
    pr,
    comp,
    cctx: comp.getContext('2d') as CanvasRenderingContext2D,
  }
}

/** Build the burn maps: distance from the ignition point (local device px), roughened by noise. */
function igniteMaps(p: Pick<Paper, 'W' | 'H' | 'noise' | 'front' | 'back'>, ix: number, iy: number) {
  const { W, H, noise } = p
  const reach = Math.hypot(Math.max(ix, W - ix), Math.max(iy, H - iy)) || 1
  const map = new Float32Array(W * H)
  let lo = Infinity
  let hi = -Infinity
  for (const i of p.front.opaque) {
    const x = i % W
    const y = (i - x) / W
    const v = (Math.hypot(x - ix, y - iy) / reach) * 0.66 + noise[i] * 0.4
    map[i] = v
    if (v < lo) lo = v
    if (v > hi) hi = v
  }
  const span = hi - lo || 1
  for (const i of p.front.opaque) map[i] = (map[i] - lo) / span
  const backMap = new Float32Array(W * H)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) backMap[y * W + x] = map[y * W + (W - 1 - x)]
  p.front.map = map
  p.back.map = backMap
}

/** Repaint one side for burn progress (0 = untouched, ~1.15 = gone) at time t (s). */
function burnSurface(s: Surface, grain: Uint8Array, progress: number, t: number, T: PaperTuning, edge: number[] | null) {
  const map = s.map
  if (!map) return
  const { orig, opaque } = s
  const out = s.img.data
  const A = T.ASH_WIDTH
  const R = T.RIM_WIDTH
  const C = R + T.CHAR_WIDTH
  const S = C + T.TOAST_WIDTH
  const [hr, hg, hb] = rgb(T.RIM_HOT_RGB)
  const [rr, rg, rb] = rgb(T.RIM_RGB)
  const [cr, cg, cb] = rgb(T.CHAR_RGB)
  const flicker = 0.82 + 0.18 * Math.sin(t * 23) * Math.sin(t * 7.3)
  if (edge) edge.length = 0
  for (let k = 0; k < opaque.length; k++) {
    const i = opaque[k]
    const o = i * 4
    const d = map[i] - progress
    const a = orig[o + 3]
    const g = grain[i]
    if (d < -A) {
      out[o + 3] = 0
    } else if (d < 0) {
      // Crumbling ash: fewer grains survive the further behind the front.
      if (g / 255 < 1 + d / A) {
        const v = 46 + (g & 31)
        out[o] = v
        out[o + 1] = v - 4
        out[o + 2] = v - 8
        out[o + 3] = a * 0.85
      } else out[o + 3] = 0
    } else if (d < R) {
      // Glowing rim: hot yellow at the very front, orange behind it, flickering.
      const tt = d / R
      const f = flicker * (0.86 + 0.14 * Math.sin(t * 17 + g * 0.2))
      out[o] = hr + (rr - hr) * tt
      out[o + 1] = (hg + (rg - hg) * tt) * f
      out[o + 2] = (hb + (rb - hb) * tt) * f
      out[o + 3] = a
      if (edge && edge.length < 96 && g < 24) edge.push(i)
    } else if (d < C) {
      // Char: near-black into dark brown, with embers twinkling in it.
      const tt = (d - R) / (C - R)
      if (g > 249 && Math.sin(t * 9 + g) > 0.25) {
        out[o] = rr
        out[o + 1] = rg
        out[o + 2] = rb
      } else {
        out[o] = cr + 48 * tt
        out[o + 1] = cg + 24 * tt
        out[o + 2] = cb + 9 * tt
      }
      out[o + 3] = a
    } else if (d < S) {
      // Toasted paper easing back to the original.
      const k2 = 0.5 + 0.5 * ((d - C) / (S - C))
      out[o] = orig[o] * k2 + 125 * (1 - k2)
      out[o + 1] = orig[o + 1] * k2 + 70 * (1 - k2)
      out[o + 2] = orig[o + 2] * k2 + 22 * (1 - k2)
      out[o + 3] = a
    } else {
      out[o] = orig[o]
      out[o + 1] = orig[o + 1]
      out[o + 2] = orig[o + 2]
      out[o + 3] = a
    }
  }
  s.ctx.putImageData(s.img, 0, 0)
}

/** Soft round sprite in a colour (embers and their glow). */
function sprite(color: string, size = 32) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d') as CanvasRenderingContext2D
  const r = size / 2
  const grad = g.createRadialGradient(r, r, 0, r, r, r)
  grad.addColorStop(0, `rgba(${color},1)`)
  grad.addColorStop(0.4, `rgba(${color},0.55)`)
  grad.addColorStop(1, `rgba(${color},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

/** The hero text as obstacles: real line boxes (not the full-width blocks), relative to the stage. */
function textObstacles(stage: HTMLElement, clearance: number) {
  const box = stage.getBoundingClientRect()
  const rects: { l: number; r: number; t: number; b: number }[] = []
  const add = (r: DOMRect) => {
    if (r.width && r.height) rects.push({ l: r.left - box.left - clearance, r: r.right - box.left + clearance, t: r.top - box.top - clearance, b: r.bottom - box.top + clearance })
  }
  stage.querySelectorAll('.hero-copy :is(h1, h2, .eyebrow, .hero-sub, .hero-proof)').forEach((el) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    Array.from(range.getClientRects()).forEach(add)
  })
  stage.querySelectorAll('.hero-copy .btn-row > *').forEach((el) => add(el.getBoundingClientRect()))
  return rects
}

/* ───────────────────────── Component ───────────────────────── */
export function FlameWords({
  words,
  fonts,
  tuning,
}: {
  words: string[]
  /** Canvas font families: handwriting (Latin/Cyrillic) and Armenian. */
  fonts: { hand: string; armenian: string }
  /** Development preview only: overrides for PAPER_TUNING. */
  tuning?: Partial<PaperTuning>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const key = words.join('\u0000')
  const tuneKey = JSON.stringify(tuning ?? {})
  const { hand, armenian } = fonts

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = canvas?.closest<HTMLElement>('.hero-flame-stage')
    const ctx = canvas?.getContext('2d')
    const list = key.split('\u0000').filter(Boolean)
    if (!canvas || !stage || !ctx || list.length === 0) return
    const T: PaperTuning = { ...PAPER_TUNING, ...(JSON.parse(tuneKey) as Partial<PaperTuning>) }
    const faces = { hand, armenian }

    const ember = sprite('255,190,90')
    const emberGlow = sprite('255,110,25')
    const papers: Paper[] = []
    const particles: Particle[] = []
    let order: string[] = []
    let kindIndex = Math.floor(Math.random() * KINDS.length)
    let timer = 0
    let raf = 0
    let last = 0
    let onScreen = true
    let stopped = false
    let dropping = false
    let cssW = 0
    let cssH = 0
    let pr = 1
    const fire = rgb(T.FIRELIGHT_RGB)
    // Development aid: lets the preview page and tests inspect the scraps. Never in production builds.
    if (process.env.NODE_ENV !== 'production') (canvas as HTMLCanvasElement & { __papers?: Paper[] }).__papers = papers

    const resize = () => {
      cssW = stage.clientWidth
      cssH = stage.clientHeight
      pr = Math.min(window.devicePixelRatio || 1, T.CANVAS_PIXEL_RATIO)
      canvas.width = Math.round(cssW * pr)
      canvas.height = Math.round(cssH * pr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)

    const mobile = () => cssW < T.MOBILE_BREAKPOINT
    const paused = () => !onScreen || document.hidden

    /** Shuffled cycle, so every phrase appears before any repeats. */
    const nextWord = () => {
      if (order.length === 0) order = [...list].sort(() => Math.random() - 0.5)
      return order.pop() as string
    }

    const drop = async () => {
      const text = nextWord()
      const isArmenian = /[Ա-և]/.test(text)
      // Make sure the handwriting face is loaded before drawing (canvas does not wait for fonts).
      await document.fonts.load(isArmenian ? `800 16px ${faces.armenian}` : `700 20px ${faces.hand}`, text).catch(() => undefined)
      if (stopped) return
      const art = makePaper(text, KINDS[kindIndex++ % KINDS.length], mobile(), faces, T)
      // Radius that contains the scrap at any rotation (plus its shadow padding).
      const half = Math.hypot(art.w, art.h) / 2 + art.pad
      const span = half * 2
      const drift = T.DRIFT_PX[1] + 4
      const margin = Math.min(24, cssW * 0.04)
      const burnFrac = pickRange(T.BURN_LINE)
      let burnY = cssH * burnFrac

      // A column that clears every line of the text above the burn line (paper sway included).
      const obstacles = textObstacles(stage, T.TEXT_CLEARANCE)
      const clear = (x: number, fromY: number) =>
        obstacles.every((o) => o.b < fromY - half || o.t > burnY + half || o.r < x - half - drift || o.l > x + half + drift)
      const lo = margin + half + drift
      const hi = cssW - margin - half - drift
      if (hi <= lo) return
      const bias = mobile() ? T.RIGHT_BIAS_MOBILE : T.RIGHT_BIAS_DESKTOP
      const candidate = () => (Math.random() < bias ? rand(Math.max(lo, cssW * 0.55), hi) : rand(lo, hi))
      const apart = (x: number) => papers.every((o) => Math.abs(o.x0 - x) > (Math.max(o.w, o.h) + span) * 0.5)

      let x = -1
      let startY = -half
      for (let i = 0; i < 16 && x < 0; i++) {
        const c = candidate()
        if (clear(c, startY) && apart(c)) x = c
      }
      if (x < 0) {
        // No free column (phones): start just below the lowest line of text — far enough that even a fully
        // rotated scrap clears it — and burn soon after, near the bottom where the flames are.
        const radius = Math.hypot(art.w, art.h) / 2 + art.pad
        startY = Math.max(0, ...obstacles.map((o) => o.b)) + radius
        burnY = Math.max(burnY, startY + 28)
        if (burnY > cssH - 10) return
        for (let i = 0; i < 10 && x < 0; i++) {
          const c = candidate()
          if (apart(c)) x = c
        }
        if (x < 0) return
      }

      const vMin = T.FALL_SPEED[0] * rand(0.9, 1.1)
      // Scraps never tilt past ~25°, so the edge facing the fire is always the bottom one: fire starts at a
      // random point along it.
      const padPx = art.pad * art.pr
      igniteMaps(art, rand(padPx, art.W - padPx), art.H - padPx)
      papers.push({
        ...art,
        born: performance.now(),
        x0: x,
        y: startY,
        minY: startY,
        v: vMin * 0.5,
        vMin,
        vMax: T.FALL_SPEED[1] * rand(0.85, 1.05),
        phi: rand(0, Math.PI * 2),
        omega: (Math.random() < 0.5 ? -1 : 1) * pickRange(T.TUMBLE),
        flipAxis: Math.random() < 0.6 ? 'y' : 'x',
        drift: [pickRange(T.DRIFT_PX), rand(0.3, 0.5), rand(3, 7), rand(1.1, 1.7)],
        wobble: [pickRange(T.WOBBLE_DEG) * (Math.PI / 180), rand(0.4, 0.75), rand(0, Math.PI * 2)],
        rot0: rand(-0.2, 0.2),
        burnY,
        burnMs: pickRange(T.BURN_MS),
        ignitedAt: 0,
        frame: 0,
        x,
        rot: 0,
        sx: 1,
        sy: 1,
        edge: [],
      })
      loop()
    }

    /** Ignite. The burn maps were built when the scrap was made (off the animation frame, so ignition never stutters). */
    const ignite = (p: Paper, now: number) => {
      p.ignitedAt = now
      // The heat catches it: most of the fall speed goes at once.
      p.v = Math.min(p.v, p.vMin * T.BURN_SLOWDOWN * 1.5)
    }

    /** World position of a device-pixel index on the scrap. */
    const toWorld = (p: Paper, i: number) => {
      // The visible side is drawn with |scale| (the back is pre-mirrored), so positions use |scale| too.
      const lx = ((i % p.W) / p.pr - p.pad - p.w / 2) * Math.abs(p.sx)
      const ly = (Math.floor(i / p.W) / p.pr - p.pad - p.h / 2) * Math.abs(p.sy)
      const cos = Math.cos(p.rot)
      const sin = Math.sin(p.rot)
      return [p.x + lx * cos - ly * sin, p.y + lx * sin + ly * cos] as const
    }

    const emit = (p: Paper, dt: number) => {
      if (!p.edge.length || particles.length > T.MAX_PARTICLES) return
      const scale = (motion() === 'subtle' ? T.SUBTLE_PARTICLES : 1) * Math.min(1, p.edge.length / 50)
      const count = (rate: number) => {
        const n = rate * dt * scale
        return Math.floor(n) + (Math.random() < n % 1 ? 1 : 0)
      }
      for (let n = count(T.EMBERS_PER_SEC); n > 0; n--) {
        const [x, y] = toWorld(p, p.edge[(Math.random() * p.edge.length) | 0])
        particles.push({ ash: false, x, y, vx: rand(-14, 14), vy: -pickRange(T.EMBER_SPEED), life: 0, max: pickRange(T.EMBER_LIFE), size: rand(0.8, 2), a: 0, spin: 0, wob: rand(12, 30), ph: rand(0, 6.28) })
      }
      for (let n = count(T.ASH_PER_SEC); n > 0; n--) {
        const [x, y] = toWorld(p, p.edge[(Math.random() * p.edge.length) | 0])
        particles.push({ ash: true, x, y, vx: rand(-16, 16), vy: -rand(14, 44), life: 0, max: rand(1.4, 2.6), size: rand(1.5, 3.4), a: rand(0, 3.14), spin: rand(-6, 6), wob: rand(8, 18), ph: rand(0, 6.28) })
      }
    }

    /** Re-light a scrap into its compositing canvas: flip shading, top dimming, firelight from below. */
    const light = (p: Paper, src: HTMLCanvasElement, flat: boolean, burning: number) => {
      const c = p.cctx
      const yN = Math.min(1, Math.max(0, p.y / cssH))
      c.globalCompositeOperation = 'source-over'
      c.globalAlpha = 1
      c.clearRect(0, 0, p.W, p.H)
      c.drawImage(src, 0, 0)
      c.globalCompositeOperation = 'source-atop'
      const facing = Math.abs(p.flipAxis === 'y' ? p.sx : p.sy)
      const dim = (1 - T.LIGHT_TOP) * (1 - smooth(0.05, 0.6, yN))
      const shade = Math.min(0.8, dim + T.EDGE_DARKEN * (1 - facing) + (flat ? 0 : T.BACK_DARKEN)) * (1 - burning * 0.6)
      if (shade > 0.01) {
        c.fillStyle = `rgba(10,7,5,${shade})`
        c.fillRect(0, 0, p.W, p.H)
      }
      const glow = T.FIRELIGHT * smooth(0.3, 0.95, yN) + burning * 0.25
      if (glow > 0.01) {
        const g = c.createLinearGradient(0, p.H, 0, 0)
        g.addColorStop(0, `rgba(${fire[0]},${fire[1]},${fire[2]},${Math.min(0.75, glow)})`)
        g.addColorStop(1, `rgba(${fire[0]},${fire[1]},${fire[2]},${Math.min(0.75, glow) * 0.25})`)
        c.fillStyle = g
        c.fillRect(0, 0, p.W, p.H)
      }
      c.globalCompositeOperation = 'source-over'
    }

    const frame = (now: number) => {
      raf = 0
      if (paused()) {
        last = 0
        return
      }
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      const t = now / 1000
      if (!isDark() || motion() === 'off') {
        papers.length = 0
        particles.length = 0
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(pr, 0, 0, pr, 0, 0)

      for (let k = papers.length - 1; k >= 0; k--) {
        const p = papers[k]
        const age = (now - p.born) / 1000
        p.frame++
        const burning = p.ignitedAt ? Math.min(1, (now - p.ignitedAt) / p.burnMs) : 0

        // Fall: flat-on catches air (slow), edge-on slices down (fast); heat lifts a burning scrap.
        p.phi += p.omega * (p.ignitedAt ? 1.25 : 1) * dt
        const c = Math.cos(p.phi)
        let target = p.vMin + (p.vMax - p.vMin) * (1 - Math.abs(c))
        // Burning: slow drift, then lifted by the heat towards the end.
        if (p.ignitedAt) target = target * T.BURN_SLOWDOWN * (1 - burning) - 18 * burning
        p.v += (target - p.v) * Math.min(1, dt * T.SPEED_EASE * (p.ignitedAt ? 3 : 1))
        const prevY = p.y
        p.y = Math.max(p.minY, p.y + p.v * dt)
        const [da, df, db, dg] = p.drift
        p.x = p.x0 + Math.sin(age * df * Math.PI * 2 + p.phi * 0.25) * da + Math.sin(age * dg * Math.PI * 2) * db
        const [wa, wf, wp] = p.wobble
        p.rot = p.rot0 + Math.sin(age * wf * Math.PI * 2 + wp) * wa
        const fold = Math.max(0.05, Math.abs(c))
        p.sx = p.flipAxis === 'y' ? fold * Math.sign(c || 1) : 1
        p.sy = p.flipAxis === 'x' ? fold * Math.sign(c || 1) : 1

        if (!p.ignitedAt && p.y >= p.burnY) ignite(p, now)
        if (p.y - Math.max(p.w, p.h) > cssH || burning >= 1) {
          papers.splice(k, 1)
          continue
        }

        const showBack = c < 0
        const visible = showBack ? p.back : p.front
        if (p.ignitedAt) {
          const progress = -0.05 + 1.2 * Math.pow(burning, 1.15)
          burnSurface(visible, p.grain, progress, t, T, p.edge)
          if (p.frame % 3 === 0) burnSurface(showBack ? p.front : p.back, p.grain, progress, t, T, null)
        }
        light(p, visible.canvas, !showBack, burning)

        // Local brightening of the fire where the scrap burns.
        if (p.ignitedAt && T.GLOW > 0) {
          const r = Math.max(p.w, p.h) * 1.2
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
          const flick = 0.8 + 0.2 * Math.sin(t * 19) * Math.sin(t * 5.3)
          g.addColorStop(0, `rgba(255,140,40,${T.GLOW * flick * Math.sin(Math.PI * Math.min(1, burning * 1.15))})`)
          g.addColorStop(1, 'rgba(255,90,0,0)')
          ctx.globalCompositeOperation = 'lighter'
          ctx.fillStyle = g
          ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2)
          ctx.globalCompositeOperation = 'source-over'
        }

        const fw = p.w + p.pad * 2
        const fh = p.h + p.pad * 2
        const draw = (y: number, alpha: number) => {
          ctx.save()
          ctx.globalAlpha = alpha
          ctx.translate(p.x, y)
          ctx.rotate(p.rot)
          ctx.scale(Math.abs(p.sx), Math.abs(p.sy))
          if (fold < 0.22) ctx.filter = 'blur(0.7px)'
          if (p.ignitedAt && T.CURL > 0) {
            // Curl / crumple: the sheet is drawn in strips whose ends lift and squeeze as it burns.
            const strips = 8
            const amt = T.CURL * Math.sqrt(burning)
            for (let s = 0; s < strips; s++) {
              const e = (2 * (s + 0.5)) / strips - 1
              const lift = amt * fh * e * e
              const squash = 1 - amt * 0.6 * Math.abs(e)
              ctx.drawImage(p.comp, (s * p.W) / strips, 0, p.W / strips + 1, p.H, -fw / 2 + (s * fw) / strips, -fh / 2 - lift + (fh * (1 - squash)) / 2, fw / strips + 0.6, fh * squash)
            }
          } else ctx.drawImage(p.comp, -fw / 2, -fh / 2, fw, fh)
          ctx.restore()
        }
        // A faint trailing copy when moving fast reads as motion blur.
        if (p.v > T.MOTION_BLUR_SPEED) draw(prevY - (p.y - prevY) * 1.5, 0.22)
        draw(p.y, 1)
        if (p.ignitedAt) emit(p, dt)
      }

      // Embers (additive, rising with a wobble) and ash flakes (drifting up, tumbling).
      for (let k = particles.length - 1; k >= 0; k--) {
        const q = particles[k]
        q.life += dt
        if (q.life >= q.max) {
          particles.splice(k, 1)
          continue
        }
        const f = q.life / q.max
        q.x += (q.vx + Math.sin(t * 3 + q.ph) * q.wob) * dt
        q.y += q.vy * dt
        q.vy *= q.ash ? 0.995 : 0.985
        if (q.ash) {
          q.a += q.spin * dt
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = 0.7 * (1 - f)
          ctx.fillStyle = '#3a3330'
          ctx.save()
          ctx.translate(q.x, q.y)
          ctx.rotate(q.a)
          ctx.scale(1, Math.abs(Math.cos(q.a * 1.6)) + 0.15)
          ctx.fillRect(-q.size, -q.size * 0.6, q.size * 2, q.size * 1.2)
          ctx.restore()
        } else {
          const fade = (1 - Math.pow(f, 1.5)) * (0.75 + 0.25 * Math.sin(t * 20 + q.ph))
          ctx.globalCompositeOperation = 'lighter'
          ctx.globalAlpha = fade * 0.5
          const g = q.size * 5
          ctx.drawImage(emberGlow, q.x - g, q.y - g, g * 2, g * 2)
          ctx.globalAlpha = fade
          const s = q.size * 1.6
          ctx.drawImage(ember, q.x - s, q.y - s, s * 2, s * 2)
        }
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      if (!stopped && (papers.length || particles.length)) loop()
      else last = 0
    }
    const loop = () => {
      if (!raf && !stopped && !paused()) raf = requestAnimationFrame(frame)
    }

    const schedule = (first = false) => {
      window.clearTimeout(timer)
      if (stopped) return
      const subtle = motion() === 'subtle'
      const gap = first ? T.FIRST_DROP_MS : pickRange(T.GAP_MS) * (subtle ? T.SUBTLE_GAP_FACTOR : 1)
      timer = window.setTimeout(async () => {
        const max = Math.max(1, (mobile() ? T.MAX_ACTIVE_MOBILE : T.MAX_ACTIVE) - (subtle ? 1 : 0))
        if (!dropping && isDark() && motion() !== 'off' && !paused() && papers.length < max) {
          dropping = true
          try {
            await drop()
          } catch (err) {
            // Decoration only: switch the effect off rather than break the page.
            console.error('[FlameWords]', err)
            stopped = true
            return
          } finally {
            dropping = false
          }
        }
        schedule()
      }, gap)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        loop()
      },
      { threshold: 0.1 },
    )
    io.observe(stage)
    const onVisibility = () => loop()
    document.addEventListener('visibilitychange', onVisibility)
    schedule(true)

    return () => {
      stopped = true
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [key, tuneKey, hand, armenian])

  return (
    <div className="flame-words" aria-hidden="true">
      <canvas ref={canvasRef} className="flame-words-canvas" />
    </div>
  )
}
