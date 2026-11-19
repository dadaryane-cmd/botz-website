/**
 * An image offered in the smallest format the browser reads: `<picture>` with an AVIF and/or a
 * WebP `<source>` before the `<img>` (whose `src` is the fallback, e.g. a JPEG). Without `avif`
 * and `webp` it is a plain `<img>`. `<picture>` takes no space of its own (reset.css), so styles
 * stay on the img. `avif` and `webp` may list several sizes like `srcset`
 * ("a-240.avif 240w, a.avif 600w"); `sizes` then applies to every format.
 */
import { h } from '../lib/dom.js'

export function picture({ avif, webp, ...attributes }) {
  const img = h('img', attributes)
  if (!avif && !webp) return img
  const source = (type, srcset) => srcset && h('source', { type, srcset, sizes: attributes.sizes })
  return h('picture', null, source('image/avif', avif), source('image/webp', webp), img)
}
