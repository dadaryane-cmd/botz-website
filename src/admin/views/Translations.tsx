import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { AdminViewServerProps } from 'payload'
import { translationReport } from '@/lib/translations'

export async function TranslationsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req } = initPageResult
  if (!req.user) redirect('/admin/login')
  const report = await translationReport(req.payload)
  const byWhere = new Map<string, typeof report>()
  for (const r of report) byWhere.set(r.where, [...(byWhere.get(r.where) ?? []), r])

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
        <h1 style={{ marginTop: 24 }}>Translation report</h1>
        <p style={{ maxWidth: 720 }}>
          Texts that are filled in at least one language but empty in another (drafts included). Open the item, switch the
          language selector at the top of the editor, fill the text and save. Pages can also hide an unfinished language
          with “Published languages”.
        </p>
        {report.length === 0 ? (
          <p>
            <b>Everything is translated.</b>
          </p>
        ) : (
          Array.from(byWhere.entries()).map(([where, rows]) => (
            <section key={where} style={{ margin: '24px 0' }}>
              <h3 style={{ marginBottom: 8 }}>
                <Link href={rows[0].editUrl}>{where}</Link> <small>({rows.length})</small>
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {rows.slice(0, 60).map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 13 }}>{r.path}</td>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>missing: {r.missing.join(', ').toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 60 && <p>…and {rows.length - 60} more.</p>}
            </section>
          ))
        )}
      </Gutter>
    </DefaultTemplate>
  )
}
