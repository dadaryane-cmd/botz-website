/**
 * Renders the flame hero's fallback files on the CPU, using the same maths as
 * the WebGL shader in src/components/client/FlameBackground.tsx:
 *
 *   public/brand/hero-flame-poster-dark.webp   (transparent, dark-theme look)
 *   public/brand/hero-flame-poster-light.webp  (transparent, light-theme look)
 *   public/brand/hero-flame.webm / .mp4        (seamless loop on black, dark theme)
 *
 * Run: npm run flame:fallback   (needs the dev dependency @ffmpeg-installer/ffmpeg)
 * Re-run after changing the shader or its tuning values so the fallbacks match.
 */
import ffmpeg from '@ffmpeg-installer/ffmpeg'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = (f) => path.join(root, 'public', 'brand', f)

// Keep in sync with FLAME_TUNING in FlameBackground.tsx.
const TUNING = { HEIGHT: 0.62, TURBULENCE: 1, INTENSITY: 1, EMBERS: 1, STILL_TIME: 14 }
const VIDEO = { width: 960, height: 540, fps: 24, seconds: 8 }
const POSTER = { width: 1600, height: 960 }

/* ───────── GLSL helpers ───────── */
const fract = (x) => x - Math.floor(x)
const mod = (x, y) => x - y * Math.floor(x / y)
const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
const mix = (a, b, t) => a + (b - a) * t
const permute = (x) => mod((x * 34 + 1) * x, 289)

/** 2D simplex noise — direct port of the shader's snoise(). */
function snoise(vx, vy) {
  const Cx = 0.211324865405187,
    Cy = 0.366025403784439,
    Cz = -0.577350269189626,
    Cw = 0.024390243902439
  let ix = Math.floor(vx + (vx + vy) * Cy)
  let iy = Math.floor(vy + (vx + vy) * Cy)
  const x0x = vx - ix + (ix + iy) * Cx
  const x0y = vy - iy + (ix + iy) * Cx
  const i1x = x0x > x0y ? 1 : 0
  const i1y = x0x > x0y ? 0 : 1
  const x12x = x0x + Cx - i1x
  const x12y = x0y + Cx - i1y
  const x12z = x0x + Cz
  const x12w = x0y + Cz
  ix = mod(ix, 289)
  iy = mod(iy, 289)
  const p0 = permute(permute(iy + 0) + ix + 0)
  const p1 = permute(permute(iy + i1y) + ix + i1x)
  const p2 = permute(permute(iy + 1) + ix + 1)
  let m0 = Math.max(0.5 - (x0x * x0x + x0y * x0y), 0)
  let m1 = Math.max(0.5 - (x12x * x12x + x12y * x12y), 0)
  let m2 = Math.max(0.5 - (x12z * x12z + x12w * x12w), 0)
  m0 = m0 ** 4
  m1 = m1 ** 4
  m2 = m2 ** 4
  const g = (p, ax, ay) => {
    const x = 2 * fract(p * Cw) - 1
    const h = Math.abs(x) - 0.5
    const ox = Math.floor(x + 0.5)
    const a0 = x - ox
    return { a0, h, n: 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h), d: a0 * ax + h * ay }
  }
  const g0 = g(p0, x0x, x0y)
  const g1 = g(p1, x12x, x12y)
  const g2 = g(p2, x12z, x12w)
  return 130 * (m0 * g0.n * g0.d + m1 * g1.n * g1.d + m2 * g2.n * g2.d)
}

function fbm(x, y) {
  let s = 0,
    a = 0.5
  for (let i = 0; i < 4; i++) {
    s += a * snoise(x, y)
    x = x * 2.03 + 1.7
    y = y * 2.03 + 9.2
    a *= 0.48
  }
  return s
}
const hash = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453)

const STOPS = [
  [0.227, 0.039, 0.02],
  [0.702, 0.125, 0.055],
  [1, 0.353, 0.122],
  [1, 0.624, 0.11],
  [1, 0.906, 0.659],
]
function ramp(h) {
  h = clamp(h, 0, 1) * 4
  const i = Math.min(3, Math.floor(h))
  const t = h - i
  const a = STOPS[i],
    b = STOPS[i + 1]
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]
}

/** Light theme (no fire): mirror of the shader's warmGlow(). */
function warmGlow(uvx, uvy, p, t) {
  const uH = TUNING.HEIGHT
  const g = fbm(p.x * 0.9 + t * 0.05, p.y * 0.7 - t * 0.07) * 0.5 + 0.5
  const g2 = fbm(p.x * 1.6 - t * 0.04 + 3.7, p.y * 1.6 - t * 0.11 + 3.7) * 0.5 + 0.5
  let shape = 1 - smoothstep(0, uH * 1.25, uvy)
  shape *= shape
  const m = g * 0.55 + g2 * 0.25
  const col = [1, mix(0.851, 0.624, m), mix(0.69, 0.11, m)]
  let a = shape * (0.26 + 0.5 * g * g2) * TUNING.INTENSITY
  let pm = col.map((c) => c * a)
  let motes = 0
  for (let i = 0; i < 2; i++) {
    const k = 7 + i * 6
    const stx = p.x * k
    const sty = (uvy - t * (0.03 + i * 0.02)) * k * 0.7
    const idx = Math.floor(stx), idy = Math.floor(sty)
    const fx = stx - idx, fy = sty - idy
    const rnd = hash(idx + i * 23.1, idy + i * 23.1)
    if (rnd > 0.78) {
      let posx = hash(idx + 2.3, idy + 2.3) * 0.7 + 0.15
      const posy = hash(idx + 5.9, idy + 5.9) * 0.7 + 0.15
      posx += Math.sin(t * 0.9 + rnd * 30) * 0.15
      const d = Math.hypot(fx - posx, fy - posy)
      const life = 1 - smoothstep(uH * 0.9, uH * 1.8, uvy)
      motes += smoothstep(0.06, 0, d) * life * (0.55 + 0.45 * Math.sin(t * 2 + rnd * 50))
    }
  }
  const ma = clamp(motes * 0.75 * TUNING.EMBERS, 0, 1)
  const mc = [1, 0.62, 0.18]
  pm = pm.map((c, i) => mc[i] * ma + c * (1 - ma))
  a = ma + a * (1 - ma)
  return [pm[0], pm[1], pm[2], a]
}

/** One pixel: returns premultiplied [r, g, b, a] in 0..1 (mirror of the shader's main()). */
function shade(px, py, W, H, t, light) {
  const uvx = (px + 0.5) / W
  const uvy = 1 - (py + 0.5) / H // GL origin is bottom-left
  const aspect = W / H
  const p = { x: uvx * aspect, y: uvy }
  const uH = TUNING.HEIGHT,
    uI = TUNING.INTENSITY,
    uFade = 1,
    uTurb = TUNING.TURBULENCE
  if (light) return warmGlow(uvx, uvy, p, t)

  const qx = fbm(p.x * 1.1, p.y * 0.8 - t * 0.22)
  const qy = fbm(p.x * 1.1 + 5.2, p.y * 0.8 + 1.3 - t * 0.19)
  const rx = p.x + uTurb * 0.42 * qx
  const ry = p.y + uTurb * 0.22 * qy
  const n = fbm(rx * 1.7, ry * 0.85 - t * 0.55) * 0.5 + 0.5

  const h = uH * (0.55 + 0.75 * n)
  const shape = Math.pow(1 - smoothstep(0, h, uvy), 1.35)
  let heat = shape * (0.3 + 0.95 * n)
  heat = smoothstep(0.2, 1.15, heat)
  heat = Math.min(heat, 0.93) * uI * uFade

  let fire = ramp(heat)
  const tipMix = light * (1 - smoothstep(0.2, 0.55, heat))
  const warm = ramp(0.25 + heat * 0.75)
  fire = fire.map((c, i) => mix(c, warm[i], tipMix))
  const bloom = Math.pow(clamp(heat, 0, 1), 3) * 0.22
  fire = [fire[0] + bloom, fire[1] + 0.86 * bloom, fire[2] + 0.6 * bloom]
  const fireA = smoothstep(0.02, mix(0.36, 0.26, light), heat)
  let pm = fire.map((c) => c * fireA)
  let alpha = fireA

  const glow = Math.exp(-uvy / Math.max(uH * 0.45, 0.01)) * 0.22 * uI * uFade * mix(1, 0.6, light)
  pm = [pm[0] + 1 * glow * (1 - alpha), pm[1] + 0.42 * glow * (1 - alpha), pm[2] + 0.12 * glow * (1 - alpha)]
  alpha += glow * (1 - alpha)

  const band = smoothstep(uH * 0.6, uH * 0.9, uvy) * (1 - smoothstep(uH * 0.9, uH * 1.3, uvy))
  const haze = (snoise(p.x * 7, p.y * 11 - t * 1.6) * 0.5 + 0.5) * band * 0.035 * uFade * mix(1, 0.5, light)
  pm = [pm[0] + 1 * haze * (1 - alpha), pm[1] + 0.62 * haze * (1 - alpha), pm[2] + 0.28 * haze * (1 - alpha)]
  alpha += haze * (1 - alpha)

  let sparks = 0
  for (let i = 0; i < 3; i++) {
    const k = 9 + i * 5
    const stx = p.x * k
    const sty = (uvy - t * (0.07 + i * 0.035)) * k * 0.6
    const idx = Math.floor(stx),
      idy = Math.floor(sty)
    const fx = stx - idx,
      fy = sty - idy
    const rnd = hash(idx + i * 17.3, idy + i * 17.3)
    if (rnd > 0.8) {
      let posx = hash(idx + 3.1, idy + 3.1) * 0.7 + 0.15
      const posy = hash(idx + 7.7, idy + 7.7) * 0.7 + 0.15
      posx += Math.sin(t * 1.7 + rnd * 40) * 0.12
      const d = Math.hypot(fx - posx, fy - posy)
      const life = smoothstep(0, 0.12, uvy) * (1 - smoothstep(uH * 0.55, uH * 1.5, uvy))
      const twinkle = 0.6 + 0.4 * Math.sin(t * 6 + rnd * 60)
      sparks += smoothstep(0.075 - i * 0.015, 0, d) * life * twinkle
    }
  }
  const sa = clamp(sparks * TUNING.EMBERS * uFade, 0, 1)
  const sc = light ? [1, 0.45, 0.12] : [1, 0.82, 0.45]
  pm = pm.map((c, i) => sc[i] * sa + c * (1 - sa))
  alpha = sa + alpha * (1 - sa)
  return [pm[0], pm[1], pm[2], alpha]
}

function renderFrame(W, H, t, light) {
  const buf = new Float32Array(W * H * 4)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const v = shade(x, y, W, H, t, light)
      const o = (y * W + x) * 4
      buf[o] = v[0]
      buf[o + 1] = v[1]
      buf[o + 2] = v[2]
      buf[o + 3] = v[3]
    }
  return buf
}

/** Transparent poster: un-premultiply into straight-alpha RGBA. */
async function poster(light, file) {
  const { width: W, height: H } = POSTER
  const f = renderFrame(W, H, TUNING.STILL_TIME, light)
  const px = Buffer.alloc(W * H * 4)
  for (let i = 0; i < W * H; i++) {
    const a = f[i * 4 + 3]
    for (let c = 0; c < 3; c++) px[i * 4 + c] = a > 0.001 ? Math.round(clamp(f[i * 4 + c] / a, 0, 1) * 255) : 0
    px[i * 4 + 3] = Math.round(clamp(a, 0, 1) * 255)
  }
  await sharp(px, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 80, alphaQuality: 100, effort: 6 })
    .toFile(out(file))
  console.log('poster', file)
}

/** Seamless loop on black: crossfade F(T0+t) into F(T0+t−L) so the last frame flows into the first. */
async function video() {
  const { width: W, height: H, fps, seconds: L } = VIDEO
  const frames = fps * L
  const T0 = TUNING.STILL_TIME
  const tmp = path.join(root, 'public', 'brand', '.flame-frames.rgb')
  const fh = await fs.open(tmp, 'w')
  const started = Date.now()
  for (let f = 0; f < frames; f++) {
    const t = f / fps
    const w = t / L
    const a = renderFrame(W, H, T0 + t, 0)
    const b = renderFrame(W, H, T0 + t - L, 0)
    const rgb = Buffer.alloc(W * H * 3)
    for (let i = 0; i < W * H; i++)
      for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(clamp(a[i * 4 + c] * (1 - w) + b[i * 4 + c] * w, 0, 1) * 255)
    await fh.write(rgb)
    if (f % 24 === 0) console.log(`frame ${f}/${frames} (${Math.round((Date.now() - started) / 1000)}s)`)
  }
  await fh.close()

  const encode = (args) =>
    new Promise((resolve, reject) => {
      const p = spawn(ffmpeg.path, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-r', String(fps), '-i', tmp, ...args], { stdio: 'inherit' })
      p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
    })
  await encode(['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-pix_fmt', 'yuv420p', '-an', out('hero-flame.webm')])
  await encode(['-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out('hero-flame.mp4')])
  await fs.rm(tmp, { force: true })
  for (const f of ['hero-flame.webm', 'hero-flame.mp4']) console.log(f, `${((await fs.stat(out(f))).size / 1024 / 1024).toFixed(2)} MB`)
}

const only = process.argv[2]
if (!only || only === 'posters') {
  await poster(0, 'hero-flame-poster-dark.webp')
  await poster(1, 'hero-flame-poster-light.webp')
}
if (!only || only === 'video') await video()
