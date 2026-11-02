/**
 * The warm pool of light the lamp casts over the page in light mode. One fixed layer that
 * ignores the pointer; CSS (css/components/lamp-light.css) draws it and hides it in dark mode.
 * The header, and with it the bulb, is re-rendered on language change, so the layer is shared.
 */
import { h } from '../../lib/dom.js'

let layer = null
let findCentre = null
let pending = false

function placeLight() {
  pending = false
  if (!findCentre) return
  const { x, y } = findCentre()
  layer.style.setProperty('--lamp-x', `${Math.round(x)}px`)
  layer.style.setProperty('--lamp-y', `${Math.round(y)}px`)
}

/**
 * At most one measurement per frame, however often the window resizes, and only after the frame
 * is painted: then the layout is already done and reading the bulb's position costs nothing.
 * (Measured before, it made the browser lay out the whole new page early, inside the script.)
 */
function schedulePlacement() {
  if (pending) return
  pending = true
  requestAnimationFrame(() => setTimeout(placeLight))
}

/** Centre the light on the bulb; `getCentre` returns the bulb's centre in viewport px. */
export function attachLampLight(getCentre) {
  findCentre = getCentre
  if (!layer) {
    layer = h('div', { class: 'lamp-light', 'aria-hidden': 'true' })
    document.body.prepend(layer)
    window.addEventListener('resize', schedulePlacement)
  }
  // After the header is in the document and laid out.
  schedulePlacement()
}
