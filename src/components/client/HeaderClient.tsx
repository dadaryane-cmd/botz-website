'use client'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

const subscribeScroll = (cb: () => void) => {
  window.addEventListener('scroll', cb, { passive: true })
  return () => window.removeEventListener('scroll', cb)
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 12, () => false)
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>{children}</header>
}

export function MobileMenu({ label, closeLabel, children }: { label: string; closeLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close the menu after navigating (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }
  useEffect(() => {
    const root = document.documentElement
    if (open) {
      root.dataset.overlayOpen = 'true'
      document.body.style.overflow = 'hidden'
      panelRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    } else {
      delete root.dataset.overlayOpen
      document.body.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        btnRef.current?.focus()
      }
      // Keep focus inside the open menu.
      if (e.key === 'Tab' && open && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a,button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button ref={btnRef} type="button" className="icon-btn menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
        <span className="sr-only">{label}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M4 8h16M4 16h11" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label={label} ref={panelRef}>
          <div className="mobile-menu-top">
            <span aria-hidden="true" />
            <button
              type="button"
              className="icon-btn"
              onClick={() => {
                setOpen(false)
                btnRef.current?.focus()
              }}
            >
              <span className="sr-only">{closeLabel}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      )}
    </>
  )
}
