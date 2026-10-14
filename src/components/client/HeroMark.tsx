'use client'
/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'

const embers = Array.from({ length: 12 }, (_, i) => ({
  left: `${18 + ((i * 53) % 64)}%`,
  t: `${3.2 + ((i * 7) % 5) * 0.45}s`,
  delay: `${1.2 + i * 0.35}s`,
  dx: `${((i % 2 ? 1 : -1) * (8 + (i * 13) % 40))}px`,
  size: `${4 + (i % 4) * 2}px`,
}))

/** The B mark ignites, glows and leans toward the pointer (fine pointers, motion allowed). */
export function HeroMark({ src, darkSrc, alt }: { src: string; darkSrc: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.PointerEvent) => {
    const root = document.documentElement
    if (root.dataset.motion !== 'expressive' || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--rx', `${(x * 14).toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${(-y * 14).toFixed(2)}deg`)
  }
  const reset = () => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }
  return (
    <div className="hero-mark-wrap" onPointerMove={onMove} onPointerLeave={reset}>
      <div className="hero-ring" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-mark" ref={ref}>
        <img className="logo-light" src={src} alt={alt} width={709} height={1097} fetchPriority="high" />
        <img className="logo-dark" src={darkSrc} alt={alt} width={206} height={320} fetchPriority="high" />
      </div>
      <div className="embers" aria-hidden="true">
        {embers.map((e, i) => (
          <span
            key={i}
            style={{ left: e.left, width: e.size, height: e.size, ['--t' as string]: e.t, ['--delay' as string]: e.delay, ['--dx' as string]: e.dx }}
          />
        ))}
      </div>
    </div>
  )
}
