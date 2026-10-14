'use client'
import { useField } from '@payloadcms/ui'

type Snap = {
  packageName?: string
  duration?: number
  monthly?: number
  recurringTotal?: number
  savings?: number
  oneTimePackage?: number
  addons?: { name: string; qty: number; total: number }[]
  combinedTotal?: number
  isMinimum?: boolean
  calculatedAt?: string
}

const amd = (n?: number) => (typeof n === 'number' ? `AMD ${n.toLocaleString('en-US')}` : '—')

export const SelectionSummary = () => {
  const { value } = useField<{ snapshot?: Snap } | null>({ path: 'selection' })
  const s = value?.snapshot
  return (
    <div style={{ marginBottom: 24 }}>
      <label className="field-label">Selected estimate (server-calculated snapshot)</label>
      {!s ? (
        <p style={{ color: 'var(--theme-elevation-500)' }}>No package or add-on was attached.</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', minWidth: 320 }}>
          <tbody>
            {s.packageName && (
              <tr>
                <td>Package</td>
                <td>
                  <b>{s.packageName}</b>
                  {s.duration ? ` · ${s.duration} month(s)` : ''}
                </td>
              </tr>
            )}
            {s.monthly && (
              <tr>
                <td>Monthly / total</td>
                <td>
                  {amd(s.monthly)} · {amd(s.recurringTotal)} (saves {amd(s.savings)})
                </td>
              </tr>
            )}
            {s.oneTimePackage && (
              <tr>
                <td>One-time package</td>
                <td>{amd(s.oneTimePackage)}</td>
              </tr>
            )}
            {s.addons?.map((a) => (
              <tr key={a.name}>
                <td>Add-on</td>
                <td>
                  {a.name} ×{a.qty} = {amd(a.total)}
                </td>
              </tr>
            ))}
            <tr>
              <td>Combined</td>
              <td>
                <b>{amd(s.combinedTotal)}</b>
                {s.isMinimum ? ' (minimum estimate)' : ''}
              </td>
            </tr>
            <tr>
              <td>Calculated</td>
              <td>{s.calculatedAt ? new Date(s.calculatedAt).toLocaleString() : '—'}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
