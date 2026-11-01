/**
 * An image offered as AVIF (smallest) with the WebP as fallback: `<picture>` with an AVIF
 * `<source>` and the WebP `<img>`. Browsers without AVIF use the `<img>`. Without `avif` it is a
 * plain `<img>`. `<picture>` takes no space of its own (reset.css), so styles stay on the img.
 * `avif` may list several sizes like `srcset` ("a-240.avif 240w, a.avif 600w"); `sizes` then
 * applies to both formats.
 */
import { h } from '../lib/dom.js'

export function picture({ avif, ...attributes }) {
  const img = h('img', attributes)
  if (!avif) return img
  return h(
    'picture',
    null,
    h('source', { type: 'image/avif', srcset: avif, sizes: attributes.sizes }),
    img,
  )
}
