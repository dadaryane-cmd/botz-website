import { getTheme } from '../../lib/theme.js'

/** Text the light falls on: headings and the large statement (css/components/text-light.css). */
const LIT_TEXT = '.heading, .statement'

/**
 * In the dark theme the mouse lights the big text: headings glow brighter near it and dim a
 * little further away. Each lit block gets the pointer's position (--lx, --ly, in window
 * pixels) once per frame; only the blocks on screen are updated. Nothing covers the page.
 * <html class="text-light"> switches the effect on while the mouse is over the page.
 */
export function setUpTextLight() {
  const root = document.documentElement
  const onScreen = new Set()
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onScreen.add(entry.target)
      else onScreen.delete(entry.target)
    }
  })
  document.querySelectorAll(LIT_TEXT).forEach((element) => observer.observe(element))

  let pointerX = 0
  let pointerY = 0
  let frame = 0
  const place = () => {
    frame = 0
    for (const element of onScreen) {
      element.style.setProperty('--lx', `${pointerX}px`)
      element.style.setProperty('--ly', `${pointerY}px`)
    }
  }

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse' || getTheme() !== 'dark') return
      pointerX = event.clientX
      pointerY = event.clientY
      root.classList.add('text-light')
      if (!frame) frame = requestAnimationFrame(place)
    },
    { passive: true },
  )
  root.addEventListener('pointerleave', () => root.classList.remove('text-light'))
}
