'use client'
import { useRowLabel } from '@payloadcms/ui'

type Row = { key?: string; name?: string; label?: string; featureKey?: string; status?: string; quantity?: number; quantityMax?: number }

export const PackageRowLabel = () => {
  const { data, rowNumber } = useRowLabel<Row>()
  const title = typeof data?.name === 'string' ? data.name : typeof data?.label === 'string' ? data.label : ''
  return (
    <span>
      {data?.key ? <code style={{ marginRight: 8 }}>{data.key}</code> : `Row ${(rowNumber ?? 0) + 1}`}
      {title}
    </span>
  )
}

const statusLabel: Record<string, string> = {
  included: '✓',
  not_included: '— not included',
  not_specified: '? not specified',
  replaced: '↳ replaced',
}

export const FeatureRowLabel = () => {
  const { data, rowNumber } = useRowLabel<Row>()
  const qty =
    data?.quantity != null ? ` · ${data.quantity}${data.quantityMax != null ? `–${data.quantityMax}` : ''}` : ''
  return (
    <span>
      <code style={{ marginRight: 8 }}>{data?.featureKey || `Row ${(rowNumber ?? 0) + 1}`}</code>
      {statusLabel[data?.status ?? 'included']}
      {qty}
    </span>
  )
}
