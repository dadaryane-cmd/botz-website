'use client'

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'

/** Below this width the package groups become tabs (one group at a time). */
const QUERY = '(max-width: 767px)'

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/**
 * Package groups (SMM / SEO / SMM + SEO / Website). On phones: an ARIA tablist with arrow-key,
 * Home and End navigation. On larger screens — and before JavaScript runs — every group is shown,
 * so nothing is ever hidden from people or search engines without a way to reach it.
 */
export function PackageTabs({ labels, ariaLabel, panels }: { labels: string[]; ariaLabel: string; panels: ReactNode[] }) {
  const narrow = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
  const [active, setActive] = useState(0)
  const id = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  if (!narrow || panels.length < 2) return <div className="pkg-groups">{panels}</div>

  const select = (i: number) => {
    const next = (i + panels.length) % panels.length
    setActive(next)
    tabs.current[next]?.focus()
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(active + 1),
      ArrowLeft: () => select(active - 1),
      Home: () => select(0),
      End: () => select(panels.length - 1),
    }
    if (keys[e.key]) {
      e.preventDefault()
      keys[e.key]()
    }
  }

  return (
    <div className="pkg-tabs">
      <div className="pkg-tablist" role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}>
        {labels.map((label, i) => (
          <button
            key={i}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className="pkg-tab"
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div key={i} role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={i !== active} tabIndex={0} className="pkg-tabpanel">
          {panel}
        </div>
      ))}
    </div>
  )
}
