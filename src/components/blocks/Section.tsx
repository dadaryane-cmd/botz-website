import type { ReactNode } from 'react'

export type BlockSettings = {
  background?: 'default' | 'surface' | 'inverse' | 'accent' | null
  align?: 'start' | 'center' | null
  width?: 'narrow' | 'normal' | 'wide' | null
  anchor?: string | null
  paddingTop?: string | null
  paddingBottom?: string | null
  hidden?: boolean | null
}

export function Section({ settings, children, className = '', label }: { settings?: BlockSettings | null; children: ReactNode; className?: string; label?: string }) {
  const s = settings ?? {}
  const bg = s.background && s.background !== 'default' ? `bg-${s.background}` : ''
  const width = s.width === 'narrow' ? 'w-narrow' : s.width === 'wide' ? 'w-wide' : ''
  return (
    <section
      id={s.anchor || undefined}
      aria-label={label}
      className={`section ${bg} pt-${s.paddingTop ?? 'md'} pb-${s.paddingBottom ?? 'md'} ${s.align === 'center' ? 'align-center' : ''} ${className}`}
    >
      <div className={`container ${width}`}>{children}</div>
    </section>
  )
}
