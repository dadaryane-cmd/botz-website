'use client'
import Link from 'next/link'
import { useRef, useState, type ReactNode } from 'react'

/**
 * Portfolio card with a hover preview (mouse) and a tap-to-preview first tap
 * on touch screens; a second tap opens the case study.
 */
export function WorkCard({ href, video, image, children }: { href: string; video?: string | null; image: ReactNode; children: ReactNode }) {
  const [previewing, setPreviewing] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const pointer = useRef<string>('mouse')
  const play = () => {
    if (document.documentElement.dataset.motion === 'off') return
    ref.current?.play().catch(() => undefined)
  }
  return (
    <Link
      href={href}
      className={`work-card${previewing ? ' is-previewing' : ''}`}
      onMouseEnter={play}
      onMouseLeave={() => ref.current?.pause()}
      onFocus={play}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onClick={(e) => {
        if (video && !previewing && pointer.current === 'touch') {
          e.preventDefault()
          setPreviewing(true)
          play()
        }
      }}
    >
      <div className="work-media">
        {image}
        {video && <video ref={ref} src={video} muted loop playsInline preload="none" aria-hidden="true" />}
      </div>
      {children}
    </Link>
  )
}
