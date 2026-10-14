'use client'
/**
 * <FlameBackground /> — a living, stylised flame rendered by a WebGL fragment
 * shader on a full-bleed canvas behind the hero content.
 *
 * Technique: 2D simplex noise → fBm, domain-warped so the tongues sway and curl,
 * scrolling upward; intensity strongest at the bottom edge and falling off with
 * height. Plus a faint heat-haze shimmer above the flames, procedural embers
 * drifting upward, and a soft bloom on the hottest parts.
 *
 * Fallbacks (no WebGL / shader failure): a pre-rendered seamless loop video
 * (dark theme), then a static poster image. The poster is also painted by CSS
 * before JavaScript runs, so the first paint already shows fire.
 *
 * The same maths is mirrored on the CPU in scripts/render-flame-fallback.mjs to
 * produce those fallback files — keep the two in sync when tuning.
 */
import { useEffect, useRef } from 'react'

/* ───────────────────────── Tunable values ───────────────────────── */
export const FLAME_TUNING = {
  /** Animation speed (1 = default, calm and hypnotic). */
  SPEED: 1,
  /** Flame height as a fraction of the hero (0.4–0.55 recommended). */
  HEIGHT: 0.62,
  /** Flame height on phones, where the copy takes more of the screen. */
  MOBILE_HEIGHT: 0.5,
  /** Domain-warp strength: how much the tongues curl (0.5 calm – 1.6 wild). */
  TURBULENCE: 1,
  /** Overall brightness / opacity of the fire. */
  INTENSITY: 1,
  /** Ember amount (0 = none, 1 = default). */
  EMBERS: 1,
  /** Max sideways lean toward the cursor, as a fraction of the hero width. */
  MAX_LEAN: 0.1,
  /** How quickly the lean follows the cursor (0–1 per frame). */
  LEAN_EASE: 0.04,
  /** Rendering resolution relative to CSS pixels (flames are soft, so lower is fine). */
  RENDER_SCALE: 0.5,
  MAX_RENDER_WIDTH: 1280,
  /** Speed multiplier when the site's Animation setting is "Subtle". */
  SUBTLE_SPEED: 0.6,
  /**
   * Light theme: 'glow' = soft drifting warm light with golden motes (no fire);
   * 'none' = no animation at all on the light theme.
   */
  LIGHT_STYLE: 'glow' as 'glow' | 'none',
  /** Fixed time used for the single still frame under reduced motion. */
  STILL_TIME: 14,
} as const
const T = FLAME_TUNING

/* ───────────────────────── Shaders ───────────────────────── */
const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`

export const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uLean;
uniform float uFade;
uniform float uIntensity;
uniform float uHeight;
uniform float uTurb;
uniform float uEmbers;
uniform float uLight; // 1.0 on the light theme

// 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT).
vec3 permute(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){
  float s = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++){ s += a * snoise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.48; }
  return s;
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Heat → colour: #3A0A05 → #B3200E → #FF5A1F → #FF9F1C → #FFE7A8
vec3 ramp(float h){
  vec3 c0 = vec3(0.227, 0.039, 0.020);
  vec3 c1 = vec3(0.702, 0.125, 0.055);
  vec3 c2 = vec3(1.000, 0.353, 0.122);
  vec3 c3 = vec3(1.000, 0.624, 0.110);
  vec3 c4 = vec3(1.000, 0.906, 0.659);
  h = clamp(h, 0.0, 1.0) * 4.0;
  if (h < 1.0) return mix(c0, c1, h);
  if (h < 2.0) return mix(c1, c2, h - 1.0);
  if (h < 3.0) return mix(c2, c3, h - 2.0);
  return mix(c3, c4, h - 3.0);
}

// Light theme: no fire — a calm wash of warm light rising from the bottom, with golden motes.
vec4 warmGlow(vec2 uv, vec2 p, float t){
  float g = fbm(p * vec2(0.9, 0.7) + vec2(t * 0.05, -t * 0.07)) * 0.5 + 0.5;
  float g2 = fbm(p * 1.6 + vec2(-t * 0.04, -t * 0.11) + 3.7) * 0.5 + 0.5;
  float shape = 1.0 - smoothstep(0.0, uHeight * 1.25, uv.y);
  shape *= shape;
  vec3 col = mix(vec3(1.0, 0.851, 0.69), vec3(1.0, 0.624, 0.11), g * 0.55 + g2 * 0.25);
  float a = shape * (0.26 + 0.5 * g * g2) * uIntensity * uFade;
  vec3 pm = col * a;
  // Golden dust motes drifting slowly upward.
  float motes = 0.0;
  for (int i = 0; i < 2; i++){
    float fi = float(i);
    float k = 7.0 + fi * 6.0;
    vec2 st = vec2(p.x * k, (uv.y - t * (0.03 + fi * 0.02)) * k * 0.7);
    vec2 id = floor(st);
    vec2 f = fract(st);
    float rnd = hash(id + fi * 23.1);
    if (rnd > 0.78){
      vec2 pos = vec2(hash(id + 2.3), hash(id + 5.9)) * 0.7 + 0.15;
      pos.x += sin(t * 0.9 + rnd * 30.0) * 0.15;
      float d = length(f - pos);
      float life = 1.0 - smoothstep(uHeight * 0.9, uHeight * 1.8, uv.y);
      motes += smoothstep(0.06, 0.0, d) * life * (0.55 + 0.45 * sin(t * 2.0 + rnd * 50.0));
    }
  }
  float ma = clamp(motes * 0.75 * uEmbers * uFade, 0.0, 1.0);
  vec3 moteCol = vec3(1.0, 0.62, 0.18);
  pm = moteCol * ma + pm * (1.0 - ma);
  a = ma + a * (1.0 - ma);
  return vec4(pm, a);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;          // (0,0) bottom-left
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;
  p.x -= uLean * uv.y * aspect;               // lean grows with height
  if (uLight > 0.5) { gl_FragColor = warmGlow(uv, p, t); return; }

  // Domain warp: the flow field that makes the tongues sway and curl.
  vec2 q = vec2(fbm(p * vec2(1.1, 0.8) + vec2(0.0, -t * 0.22)), fbm(p * vec2(1.1, 0.8) + vec2(5.2, 1.3 - t * 0.19)));
  vec2 r = p + uTurb * vec2(0.42, 0.22) * q;
  // Stretched vertically → long, flowing tongues rather than noisy blobs.
  float n = fbm(vec2(r.x * 1.7, r.y * 0.85 - t * 0.55)) * 0.5 + 0.5;

  // Shape: hottest at the bottom edge, fading out with height.
  float h = uHeight * (0.55 + 0.75 * n);
  float shape = pow(1.0 - smoothstep(0.0, h, uv.y), 1.35);
  float heat = shape * (0.3 + 0.95 * n);
  heat = smoothstep(0.2, 1.15, heat);
  heat = min(heat, 0.93) * uIntensity * uFade;   // white-hot only at rare peaks

  // Compose layers in premultiplied space with "over", so nothing darkens the page.
  vec3 fireCol = ramp(heat);
  // On the light theme the coolest tips lean ember-red instead of near-black.
  fireCol = mix(fireCol, ramp(0.25 + heat * 0.75), uLight * (1.0 - smoothstep(0.2, 0.55, heat)));
  fireCol += vec3(1.0, 0.86, 0.6) * pow(clamp(heat, 0.0, 1.0), 3.0) * 0.22;   // bloom on hottest parts
  float fireA = smoothstep(0.02, mix(0.36, 0.26, uLight), heat);
  vec3 pm = fireCol * fireA;
  float alpha = fireA;

  // Soft glow hugging the bottom edge (behind the flames).
  float glow = exp(-uv.y / max(uHeight * 0.45, 0.01)) * 0.22 * uIntensity * uFade * mix(1.0, 0.6, uLight);
  pm += vec3(1.0, 0.42, 0.12) * glow * (1.0 - alpha);
  alpha += glow * (1.0 - alpha);

  // Heat haze: a faint shimmering band just above the flames.
  float band = smoothstep(uHeight * 0.6, uHeight * 0.9, uv.y) * (1.0 - smoothstep(uHeight * 0.9, uHeight * 1.3, uv.y));
  float haze = (snoise(vec2(p.x * 7.0, p.y * 11.0 - t * 1.6)) * 0.5 + 0.5) * band * 0.035 * uFade * mix(1.0, 0.5, uLight);
  pm += vec3(1.0, 0.62, 0.28) * haze * (1.0 - alpha);
  alpha += haze * (1.0 - alpha);

  // Embers: sparse procedural sparks rising at different speeds, fading out (drawn on top).
  float sparks = 0.0;
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float k = 9.0 + fi * 5.0;
    vec2 st = vec2(p.x * k, (uv.y - t * (0.07 + fi * 0.035)) * k * 0.6);
    vec2 id = floor(st);
    vec2 f = fract(st);
    float rnd = hash(id + fi * 17.3);
    if (rnd > 0.8){
      vec2 pos = vec2(hash(id + 3.1), hash(id + 7.7)) * 0.7 + 0.15;
      pos.x += sin(t * 1.7 + rnd * 40.0) * 0.12;
      float d = length(f - pos);
      float life = smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(uHeight * 0.55, uHeight * 1.5, uv.y));
      float twinkle = 0.6 + 0.4 * sin(t * 6.0 + rnd * 60.0);
      sparks += smoothstep(0.075 - fi * 0.015, 0.0, d) * life * twinkle;
    }
  }
  float sa = clamp(sparks * uEmbers * uFade, 0.0, 1.0);
  vec3 sparkCol = mix(vec3(1.0, 0.82, 0.45), vec3(1.0, 0.45, 0.12), uLight);
  pm = sparkCol * sa + pm * (1.0 - sa);
  alpha = sa + alpha * (1.0 - sa);

  gl_FragColor = vec4(pm, alpha);   // premultiplied
}
`

type GL = WebGLRenderingContext

function compile(gl: GL, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) throw new Error('shader')
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'compile')
  return s
}

function motionMode(): 'off' | 'subtle' | 'expressive' {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
  const m = document.documentElement.dataset.motion
  return m === 'off' || m === 'subtle' ? m : 'expressive'
}

export function FlameBackground({ video, poster }: { video: { webm: string; mp4: string }; poster: { dark: string; light: string } }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    /** No WebGL: loop the pre-rendered video (dark theme only — it is rendered on black), else keep the poster. */
    const fallback = () => {
      const v = videoRef.current
      const dark = document.documentElement.dataset.theme === 'dark'
      if (!v || !dark || motionMode() === 'off') {
        wrap.dataset.mode = 'poster'
        return
      }
      wrap.dataset.mode = 'video'
      v.src = window.MediaSource && v.canPlayType('video/webm; codecs="vp9"') ? video.webm : video.mp4
      v.play().catch(() => (wrap.dataset.mode = 'poster'))
      v.onerror = () => (wrap.dataset.mode = 'poster')
    }

    let gl: GL | null = null
    try {
      gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' }) as GL | null
    } catch {
      gl = null
    }
    if (!gl) {
      fallback()
      return
    }

    let program: WebGLProgram
    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link')
    } catch {
      fallback()
      return
    }
    gl.useProgram(program)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    // One oversized triangle covers the whole viewport.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    const u = (n: string) => gl!.getUniformLocation(program, n)
    const uRes = u('uRes'),
      uTime = u('uTime'),
      uLean = u('uLean'),
      uFade = u('uFade'),
      uIntensity = u('uIntensity'),
      uHeight = u('uHeight'),
      uTurb = u('uTurb'),
      uEmbers = u('uEmbers'),
      uLight = u('uLight')

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      const scale = Math.min(T.RENDER_SCALE * Math.min(window.devicePixelRatio || 1, 2), T.MAX_RENDER_WIDTH / Math.max(r.width, 1))
      const w = Math.max(1, Math.round(r.width * scale))
      const h = Math.max(1, Math.round(r.height * scale))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl!.viewport(0, 0, w, h)
      }
    }

    // Start at the poster's moment so the switch from poster to live canvas is seamless.
    const state = { time: T.STILL_TIME as number, lean: 0, leanTarget: 0, fade: 1, visible: true, last: performance.now(), raf: 0 }
    const finePointer = window.matchMedia('(pointer: fine)').matches

    const draw = () => {
      const g = gl!
      g.uniform2f(uRes, canvas.width, canvas.height)
      g.uniform1f(uTime, state.time)
      g.uniform1f(uLean, state.lean)
      g.uniform1f(uFade, state.fade)
      g.uniform1f(uIntensity, T.INTENSITY)
      g.uniform1f(uHeight, wrap.offsetWidth < 760 ? T.MOBILE_HEIGHT : T.HEIGHT)
      g.uniform1f(uTurb, T.TURBULENCE)
      g.uniform1f(uEmbers, T.EMBERS)
      g.uniform1f(uLight, document.documentElement.dataset.theme === 'light' ? 1 : 0)
      g.clearColor(0, 0, 0, 0)
      g.clear(g.COLOR_BUFFER_BIT)
      if (T.LIGHT_STYLE === 'none' && document.documentElement.dataset.theme === 'light') return
      g.drawArrays(g.TRIANGLES, 0, 3)
    }

    const readScroll = () => {
      // Scrolling down calms the fire and fades it out.
      const h = wrap.offsetHeight || 1
      return Math.min(1, Math.max(0, window.scrollY / (h * 0.85)))
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - state.last) / 1000)
      state.last = now
      const mode = motionMode()
      const s = readScroll()
      state.fade = 1 - s
      const speed = T.SPEED * (mode === 'subtle' ? T.SUBTLE_SPEED : 1) * (1 - 0.6 * s)
      state.time += dt * speed
      state.lean += (state.leanTarget - state.lean) * T.LEAN_EASE
      draw()
      if (state.visible) state.raf = requestAnimationFrame(frame)
    }

    const stillFrame = () => {
      state.time = T.STILL_TIME
      state.fade = 1 - readScroll()
      draw()
    }

    const start = () => {
      cancelAnimationFrame(state.raf)
      if (motionMode() === 'off') return stillFrame()
      state.last = performance.now()
      state.raf = requestAnimationFrame(frame)
    }

    resize()
    wrap.dataset.mode = 'webgl'
    start()

    const ro = new ResizeObserver(() => {
      resize()
      if (motionMode() === 'off') stillFrame()
    })
    ro.observe(wrap)

    // Pause when the hero is off-screen or the tab is hidden.
    const io = new IntersectionObserver(([e]) => {
      state.visible = e.isIntersecting && !document.hidden
      if (state.visible) start()
      else cancelAnimationFrame(state.raf)
    })
    io.observe(wrap)
    const onVisibility = () => {
      state.visible = !document.hidden
      if (state.visible) start()
      else cancelAnimationFrame(state.raf)
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onPointer = (e: PointerEvent) => {
      if (!finePointer || e.pointerType !== 'mouse') return
      const r = wrap.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      state.leanTarget = Math.max(-1, Math.min(1, x * 2)) * T.MAX_LEAN
    }
    const onLeave = () => (state.leanTarget = 0)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    const onScroll = () => {
      if (motionMode() === 'off') stillFrame()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const themeObserver = new MutationObserver(() => {
      if (motionMode() === 'off') stillFrame()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-motion'] })

    const onLost = (e: Event) => {
      e.preventDefault()
      cancelAnimationFrame(state.raf)
      fallback()
    }
    canvas.addEventListener('webglcontextlost', onLost)

    return () => {
      cancelAnimationFrame(state.raf)
      ro.disconnect()
      io.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      canvas.removeEventListener('webglcontextlost', onLost)
    }
  }, [video.webm, video.mp4])

  return (
    <div
      ref={wrapRef}
      className="flame-bg"
      data-mode="poster"
      aria-hidden="true"
      style={{ ['--flame-poster-dark' as string]: `url(${poster.dark})`, ['--flame-poster-light' as string]: `url(${poster.light})` }}
    >
      <video ref={videoRef} className="flame-video" muted loop playsInline preload="none" poster={poster.dark} />
      <canvas ref={canvasRef} className="flame-canvas" />
    </div>
  )
}
