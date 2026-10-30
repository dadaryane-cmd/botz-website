/**
 * Animated fire behind the home hero.
 *
 * Layers, from first paint to best available: a CSS poster image → a live WebGL canvas,
 * or (no WebGL, dark theme only) a looping video. The animation pauses while the hero is
 * off-screen or the tab is hidden, calms and fades as the visitor scrolls, leans slightly
 * toward the mouse, and shows a single still frame when reduced motion is preferred.
 */
import { prefersReducedMotion } from '../../lib/animation.js'
import { h } from '../../lib/dom.js'
import { getTheme } from '../../lib/theme.js'
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders.js'

const TUNING = {
  /** Animation speed (1 = calm and hypnotic). */
  speed: 1,
  /** Flame height as a fraction of the hero; heroes narrower than `narrowWidth` get a lower strip. */
  height: 0.62,
  narrowHeight: 0.5,
  narrowWidth: 760,
  /** How much the tongues curl (0.5 calm – 1.6 wild). */
  turbulence: 1,
  intensity: 1,
  embers: 1,
  /** Max sideways lean toward the cursor (fraction of the hero width) and how fast it follows. */
  maxLean: 0.1,
  leanEase: 0.04,
  /** Flames are soft, so rendering below screen resolution is fine and much cheaper. */
  renderScale: 0.5,
  maxRenderWidth: 1280,
  /** Shader time used for the poster image and the reduced-motion still frame. */
  stillTime: 14,
  /** Scrolling this share of the hero's height fades the fire out completely… */
  fadeDistance: 0.85,
  /** …and slows it down by up to this share, so it calms as it fades. */
  scrollCalm: 0.6,
  /** Longest step between frames (s), so a paused tab does not make the fire jump. */
  maxFrameStep: 0.05,
}

export function renderFlameBackground() {
  const canvas = h('canvas', { class: 'flame-canvas' })
  const video = h('video', {
    class: 'flame-video',
    muted: true,
    loop: true,
    playsinline: true,
    preload: 'none',
  })
  const layer = h(
    'div',
    { class: 'flame-background', 'data-mode': 'poster', 'aria-hidden': 'true' },
    canvas,
    video,
  )
  video.muted = true // the attribute alone does not allow autoplay in every browser

  const flame = createWebGlFlame(canvas, layer)
  if (flame) {
    layer.dataset.mode = 'webgl'
    flame.start()
  } else {
    playVideoFallback(layer, video)
  }
  return layer
}

/** Pre-rendered loop on a black background, so it only suits the dark theme. */
function playVideoFallback(layer, video) {
  if (getTheme() !== 'dark' || prefersReducedMotion()) return
  const showPoster = () => {
    layer.dataset.mode = 'poster'
  }
  const webm = video.canPlayType('video/webm; codecs="vp9"')
  video.src = webm ? 'media/hero-flame.webm' : 'media/hero-flame.mp4'
  video.onerror = showPoster
  layer.dataset.mode = 'video'
  video.play().catch(showPoster)
}

/** Compile the shaders and return `{ start }`, or null when WebGL is unavailable. */
function createWebGlFlame(canvas, layer) {
  let gl
  try {
    gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
    if (!gl) return null
    const program = linkProgram(gl)
    gl.useProgram(program)
    // One oversized triangle covers the whole canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    return animate(gl, program, canvas, layer)
  } catch {
    return null
  }
}

function linkProgram(gl) {
  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader))
    }
    return shader
  }
  const program = gl.createProgram()
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SHADER))
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program))
  }
  return program
}

function animate(gl, program, canvas, layer) {
  const uniform = Object.fromEntries(
    ['uRes', 'uTime', 'uLean', 'uFade', 'uIntensity', 'uHeight', 'uTurb', 'uEmbers', 'uLight'].map(
      (name) => [name, gl.getUniformLocation(program, name)],
    ),
  )
  const state = {
    time: TUNING.stillTime,
    lean: 0,
    leanTarget: 0,
    fade: 1,
    visible: true,
    mounted: false,
    destroyed: false,
    last: 0,
    frame: 0,
  }
  const cleanups = []
  const isRemoved = () => state.mounted && !layer.isConnected
  /** Event listener that tears everything down once the hero has been removed from the page. */
  const listen = (target, type, handler, options) => {
    const guarded = (event) => {
      if (isRemoved()) destroy()
      else handler(event)
    }
    target.addEventListener(type, guarded, options)
    cleanups.push(() => target.removeEventListener(type, guarded, options))
  }

  function resize() {
    const { width, height } = layer.getBoundingClientRect()
    const scale = Math.min(
      TUNING.renderScale * Math.min(window.devicePixelRatio || 1, 2),
      TUNING.maxRenderWidth / Math.max(width, 1),
    )
    const pixelWidth = Math.max(1, Math.round(width * scale))
    const pixelHeight = Math.max(1, Math.round(height * scale))
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
      gl.viewport(0, 0, pixelWidth, pixelHeight)
    }
  }

  /** 0 at the top of the page, 1 once the hero has mostly scrolled away. */
  const scrollProgress = () =>
    Math.min(1, Math.max(0, window.scrollY / ((layer.offsetHeight || 1) * TUNING.fadeDistance)))

  const flameHeight = () =>
    layer.offsetWidth < TUNING.narrowWidth ? TUNING.narrowHeight : TUNING.height

  function draw() {
    gl.uniform2f(uniform.uRes, canvas.width, canvas.height)
    gl.uniform1f(uniform.uTime, state.time)
    gl.uniform1f(uniform.uLean, state.lean)
    gl.uniform1f(uniform.uFade, state.fade)
    gl.uniform1f(uniform.uIntensity, TUNING.intensity)
    gl.uniform1f(uniform.uHeight, flameHeight())
    gl.uniform1f(uniform.uTurb, TUNING.turbulence)
    gl.uniform1f(uniform.uEmbers, TUNING.embers)
    gl.uniform1f(uniform.uLight, getTheme() === 'light' ? 1 : 0)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function tick(now) {
    // The hero is rebuilt when the language changes: stop and free the old canvas.
    if (isRemoved()) {
      destroy()
      return
    }
    if (layer.isConnected && !state.mounted) {
      state.mounted = true
      resize()
    }
    const elapsed = Math.min(TUNING.maxFrameStep, (now - state.last) / 1000)
    state.last = now
    const scrolled = scrollProgress()
    state.fade = 1 - scrolled
    state.time += elapsed * TUNING.speed * (1 - TUNING.scrollCalm * scrolled)
    state.lean += (state.leanTarget - state.lean) * TUNING.leanEase
    draw()
    if (state.visible) state.frame = requestAnimationFrame(tick)
  }

  function stillFrame() {
    state.time = TUNING.stillTime
    state.fade = 1 - scrollProgress()
    draw()
  }

  function start() {
    cancelAnimationFrame(state.frame)
    if (prefersReducedMotion()) {
      requestAnimationFrame(() => {
        resize()
        stillFrame()
      })
      return
    }
    state.last = performance.now()
    state.frame = requestAnimationFrame(tick)
  }

  function setVisible(visible) {
    if (isRemoved()) {
      destroy()
      return
    }
    state.visible = visible
    if (visible) start()
    else cancelAnimationFrame(state.frame)
  }

  function destroy() {
    if (state.destroyed) return
    state.destroyed = true
    cancelAnimationFrame(state.frame)
    cleanups.forEach((cleanup) => cleanup())
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  const resizeObserver = new ResizeObserver(() => {
    resize()
    if (prefersReducedMotion()) stillFrame()
  })
  resizeObserver.observe(layer)
  cleanups.push(() => resizeObserver.disconnect())

  const intersectionObserver = new IntersectionObserver(([entry]) =>
    setVisible(entry.isIntersecting && !document.hidden),
  )
  intersectionObserver.observe(layer)
  cleanups.push(() => intersectionObserver.disconnect())

  listen(document, 'visibilitychange', () => setVisible(!document.hidden))
  // With reduced motion the still frame is redrawn as scrolling fades it.
  const redrawStill = () => {
    if (prefersReducedMotion()) stillFrame()
  }
  listen(window, 'scroll', redrawStill, { passive: true })
  if (window.matchMedia('(pointer: fine)').matches) {
    listen(
      window,
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return
        const { left, width } = layer.getBoundingClientRect()
        const offset = (event.clientX - left) / width - 0.5
        state.leanTarget = Math.max(-1, Math.min(1, offset * 2)) * TUNING.maxLean
      },
      { passive: true },
    )
    listen(document, 'pointerleave', () => {
      state.leanTarget = 0
    })
  }

  return { start }
}
