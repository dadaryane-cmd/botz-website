import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import fs from 'node:fs/promises'
import path from 'node:path'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import type { ReactNode } from 'react'

/** Tiny Markdown renderer for the editing guide (headings, lists, paragraphs, bold, code). */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith('**') ? <b key={i}>{part.slice(2, -2)}</b> : part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part,
  )
}

function render(md: string) {
  const out: ReactNode[] = []
  let list: string[] = []
  let ordered = false
  const flush = () => {
    if (!list.length) return
    const items = list.map((l, i) => <li key={i}>{inline(l)}</li>)
    out.push(ordered ? <ol key={out.length}>{items}</ol> : <ul key={out.length}>{items}</ul>)
    list = []
  }
  for (const line of md.split(/\r?\n/)) {
    const h = /^(#{1,3})\s+(.*)/.exec(line)
    const li = /^\s*[-*]\s+(.*)/.exec(line)
    const oli = /^\s*\d+\.\s+(.*)/.exec(line)
    if (h) {
      flush()
      const Tag = (['h1', 'h2', 'h3'] as const)[h[1].length - 1]
      out.push(<Tag key={out.length}>{inline(h[2])}</Tag>)
    } else if (li || oli) {
      if (list.length && ordered !== Boolean(oli)) flush()
      ordered = Boolean(oli)
      list.push((li ?? oli)![1])
    } else if (line.trim()) {
      flush()
      out.push(<p key={out.length}>{inline(line)}</p>)
    } else flush()
  }
  flush()
  return out
}

export async function HelpView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login')
  let md = '# Editing guide\n\nThe guide file was not found.'
  try {
    md = await fs.readFile(path.join(process.cwd(), 'docs', 'ADMIN_GUIDE.md'), 'utf8')
  } catch {
    // keep fallback
  }
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <article style={{ maxWidth: 760, lineHeight: 1.6, paddingBottom: 64 }}>{render(md)}</article>
      </Gutter>
    </DefaultTemplate>
  )
}
