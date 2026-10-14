/**
 * Prepares web brand assets from the untouched originals in /brand/originals.
 *
 * The supplied logos are flat RGB images with an embedded background
 * (warm white, near-black or white). We remove that background with a
 * "colour to alpha" transform (the same idea as GIMP's Color to Alpha):
 * every pixel keeps its exact appearance when composited back over the
 * original background, so anti-aliased edges and the orange-to-black
 * gradient of the B are preserved without redrawing anything. Then the
 * artwork is trimmed to its bounding box with a small, proportional margin.
 *
 * Run: node scripts/prepare-brand.mjs
 */
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = (f) => path.join(root, 'brand', 'originals', f)
const out = (f) => path.join(root, 'public', 'brand', f)

async function sampleBackground(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const pts = [
    [4, 4],
    [info.width - 5, 4],
    [4, info.height - 5],
    [info.width - 5, info.height - 5],
  ]
  const acc = [0, 0, 0]
  for (const [x, y] of pts) {
    const i = (y * info.width + x) * 3
    for (let c = 0; c < 3; c++) acc[c] += data[i + c]
  }
  return acc.map((v) => v / pts.length)
}

/** GIMP-style colour-to-alpha against a known background colour. */
async function colorToAlpha(file, bg) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const outBuf = Buffer.alloc(info.width * info.height * 4)
  let minX = info.width,
    minY = info.height,
    maxX = 0,
    maxY = 0
  for (let p = 0; p < info.width * info.height; p++) {
    const r = data[p * 3],
      g = data[p * 3 + 1],
      b = data[p * 3 + 2]
    const px = [r, g, b]
    const delta = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2]))
    let a = 0
    for (let c = 0; c < 3; c++) {
      const v = px[c] / 255
      const k = bg[c] / 255
      let ac
      if (v > k) ac = (v - k) / (1 - k || 1)
      else if (v < k) ac = (k - v) / (k || 1)
      else ac = 0
      if (ac > a) a = ac
    }
    // Treat tiny deviations as flat background noise (compression/gradient dither).
    if (delta < 10) a = 0
    const o = p * 4
    if (a === 0) {
      outBuf[o] = outBuf[o + 1] = outBuf[o + 2] = outBuf[o + 3] = 0
      continue
    }
    for (let c = 0; c < 3; c++) {
      const v = px[c] / 255
      const k = bg[c] / 255
      const col = (v - k) / a + k
      outBuf[o + c] = Math.max(0, Math.min(255, Math.round(col * 255)))
    }
    outBuf[o + 3] = Math.round(a * 255)
    if (delta > 24) {
      const x = p % info.width
      const y = (p / info.width) | 0
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  return { buf: outBuf, width: info.width, height: info.height, box: { minX, minY, maxX, maxY } }
}

async function trimmed(file, padRatio = 0.02) {
  const bg = await sampleBackground(file)
  const { buf, width, height, box } = await colorToAlpha(file, bg)
  const w = box.maxX - box.minX + 1
  const h = box.maxY - box.minY + 1
  const pad = Math.round(Math.max(w, h) * padRatio)
  const left = Math.max(0, box.minX - pad)
  const top = Math.max(0, box.minY - pad)
  const right = Math.min(width - 1, box.maxX + pad)
  const bottom = Math.min(height - 1, box.maxY + pad)
  const img = sharp(buf, { raw: { width, height, channels: 4 } }).extract({
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  })
  return { img, bg, w: right - left + 1, h: bottom - top + 1 }
}

async function writeBoth(sh, name) {
  const png = await sh.clone().png({ compressionLevel: 9 }).toBuffer()
  await fs.writeFile(out(`${name}.png`), png)
  await fs.writeFile(out(`${name}.webp`), await sh.clone().webp({ quality: 92, alphaQuality: 100 }).toBuffer())
  const m = await sharp(png).metadata()
  return { width: m.width, height: m.height }
}

/** Minimal ICO writer that embeds PNG payloads (supported by all modern browsers). */
function buildIco(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  const dir = Buffer.alloc(16 * pngs.length)
  let offset = 6 + dir.length
  pngs.forEach(({ size, buf }, i) => {
    const o = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, o)
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1)
    dir.writeUInt8(0, o + 2)
    dir.writeUInt8(0, o + 3)
    dir.writeUInt16LE(1, o + 4)
    dir.writeUInt16LE(32, o + 6)
    dir.writeUInt32LE(buf.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += buf.length
  })
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)])
}

async function main() {
  await fs.mkdir(path.join(root, 'public', 'brand'), { recursive: true })
  const manifest = {}

  const light = await trimmed(src('botz-logo-light.png'))
  manifest.logoLight = await writeBoth(light.img, 'botz-logo-light')
  manifest.logoLight.sourceBackground = light.bg.map(Math.round)

  const dark = await trimmed(src('botz-logo-dark.png'))
  manifest.logoDark = await writeBoth(dark.img, 'botz-logo-dark')
  manifest.logoDark.sourceBackground = dark.bg.map(Math.round)

  const mark = await trimmed(src('botz-b-mark.png'), 0.01)
  manifest.mark = await writeBoth(mark.img, 'botz-mark')

  // Dark-theme mark: the B exactly as it appears in the supplied dark logo
  // (its gradient is designed for black backgrounds). Cropped, not redrawn.
  {
    const darkPng = await sharp(out('botz-logo-dark.png')).raw().toBuffer({ resolveWithObject: true })
    const { data, info } = darkPng
    const colHasInk = (x) => {
      for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] > 40) return true
      return false
    }
    let x = 0
    while (x < info.width && !colHasInk(x)) x++
    const start = x
    while (x < info.width && colHasInk(x)) x++
    const end = x // first empty column after the B
    const pad = Math.round((end - start) * 0.02)
    const left = Math.max(0, start - pad)
    const b = sharp(out('botz-logo-dark.png')).extract({ left, top: 0, width: Math.min(info.width - left, end - start + pad * 2), height: info.height }).png().toBuffer()
    const bTrim = sharp(await b).trim({ threshold: 1 })
    manifest.markDark = await writeBoth(bTrim, 'botz-mark-dark')
  }

  // Square, padded mark for icons (keeps proportions; centred on transparent canvas).
  const markPng = await sharp(out('botz-mark.png')).toBuffer()
  const square = async (size, padRatio, background) =>
    sharp(markPng)
      .resize({
        width: Math.round(size * (1 - padRatio * 2)),
        height: Math.round(size * (1 - padRatio * 2)),
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .extend({
        top: Math.round(size * padRatio),
        bottom: size - Math.round(size * (1 - padRatio * 2)) - Math.round(size * padRatio),
        left: Math.round(size * padRatio),
        right: size - Math.round(size * (1 - padRatio * 2)) - Math.round(size * padRatio),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer()
      // sharp applies flatten before resize/extend in one pipeline, so flatten in a second pass.
      .then((buf) => (background ? sharp(buf).flatten({ background }).png().toBuffer() : buf))

  const fav16 = await square(16, 0.02)
  const fav32 = await square(32, 0.03)
  const fav48 = await square(48, 0.04)
  await fs.writeFile(path.join(root, 'public', 'favicon.ico'), buildIco([
    { size: 16, buf: fav16 },
    { size: 32, buf: fav32 },
    { size: 48, buf: fav48 },
  ]))
  await fs.writeFile(out('icon-32.png'), fav32)
  await fs.writeFile(out('icon-192.png'), await square(192, 0.08))
  await fs.writeFile(out('icon-512.png'), await square(512, 0.08))
  // Apple touch icons cannot be transparent: use the warm-white brand background.
  await fs.writeFile(out('apple-touch-icon.png'), await square(180, 0.12, { r: 253, g: 246, b: 236 }))

  // Default social image: dark logo centred on the brand black.
  const ogW = 1200,
    ogH = 630
  const logoForOg = await sharp(out('botz-logo-dark.png')).resize({ width: 760 }).toBuffer()
  const lm = await sharp(logoForOg).metadata()
  await sharp({ create: { width: ogW, height: ogH, channels: 4, background: { r: 14, g: 14, b: 15, alpha: 1 } } })
    .composite([{ input: logoForOg, left: Math.round((ogW - lm.width) / 2), top: Math.round((ogH - lm.height) / 2) }])
    .png()
    .toFile(out('og-default.png'))

  await fs.writeFile(out('manifest.json'), JSON.stringify(manifest, null, 2))
  console.log('Brand assets written to public/brand', manifest)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
