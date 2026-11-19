import { h } from '../../lib/dom.js'

/** Room kept between a follower and the window's edge. */
const EDGE_PX = 8

/**
 * A decorative element that follows the mouse: hidden from screen readers and never in the way of
 * a click (css/components/cursor.css). It moves once per frame, and only while it is shown.
 * `offsetX` / `offsetY` place it beside the pointer; `keepInView` flips it to the pointer's other
 * side near the window's right or bottom edge.
 */
export function createFollower(className, { offsetX = 0, offsetY = 0, keepInView = false } = {}) {
  const element = h('div', { class: `cursor-follower ${className}`, 'aria-hidden': 'true' })
  document.body.append(element)

  let pointerX = 0
  let pointerY = 0
  let frame = 0
  let isShown = false

  // Measuring the element costs a layout read every frame: only followers that flip need it.
  const sideways = () => {
    if (!keepInView) return offsetX
    const fitsRight = pointerX + offsetX + element.offsetWidth + EDGE_PX < innerWidth
    return fitsRight ? offsetX : -offsetX - element.offsetWidth
  }
  const vertical = () => {
    if (!keepInView) return offsetY
    const fitsBelow = pointerY + offsetY + element.offsetHeight + EDGE_PX < innerHeight
    return fitsBelow ? offsetY : -offsetY - element.offsetHeight
  }
  const place = () => {
    frame = 0
    element.style.transform = `translate3d(${pointerX + sideways()}px, ${pointerY + vertical()}px, 0)`
  }
  const track = (event) => {
    pointerX = event.clientX
    pointerY = event.clientY
    if (!frame) frame = requestAnimationFrame(place)
  }

  return {
    element,
    show(event) {
      track(event)
      if (isShown) return
      isShown = true
      element.classList.add('is-shown')
      window.addEventListener('pointermove', track, { passive: true })
    },
    hide() {
      if (!isShown) return
      isShown = false
      element.classList.remove('is-shown')
      window.removeEventListener('pointermove', track)
      cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
