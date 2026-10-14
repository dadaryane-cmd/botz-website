import Link from 'next/link'

const style = { display: 'block', padding: '4px 0', color: 'var(--theme-elevation-800)', textDecoration: 'none' } as const

export const NavLinks = () => (
  <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--theme-elevation-100)' }}>
    <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--theme-elevation-500)' }}>Tools</span>
    <Link href="/admin/translations" style={style}>
      Translation report
    </Link>
    <Link href="/admin/help" style={style}>
      Editing guide
    </Link>
    <a href="/" target="_blank" rel="noreferrer" style={style}>
      Open website ↗
    </a>
  </div>
)
