import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { themeCss } from '@/lib/themeCss'
import { fontStack, fontVariables } from '../../../(frontend)/fonts'
import '../../../(frontend)/styles.css'
import '../../../(frontend)/flame.css'

/** Development-only preview (see page.tsx): its own minimal root layout, dark theme, full motion. */
export const metadata: Metadata = { title: 'Falling papers — dev preview', robots: { index: false, follow: false } }

const css = themeCss({}, { display: fontStack('unbounded', 'unbounded'), body: fontStack('manrope', 'manrope') })

export default function DevLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fontVariables} js-motion`} data-theme="dark" data-motion="expressive">
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
