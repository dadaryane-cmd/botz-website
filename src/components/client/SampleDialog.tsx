'use client'

import { useId, useRef } from 'react'

/**
 * “Preview” opens the sample PDF in an accessible modal (native <dialog>: focus is kept inside,
 * Esc closes); “Download PDF” is always available as a plain link, so it works without JavaScript.
 */
export function SampleDialog({
  title,
  url,
  labels,
}: {
  title: string
  url: string
  labels: { preview: string; download: string; close: string; unavailable: string }
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  return (
    <>
      <div className="btn-row sample-actions">
        <button type="button" className="btn btn-sm" onClick={() => ref.current?.showModal()} aria-haspopup="dialog">
          {labels.preview}
        </button>
        <a className="btn btn-sm btn-secondary" href={url} download>
          {labels.download}
        </a>
      </div>
      <dialog
        ref={ref}
        className="sample-dialog"
        aria-labelledby={`${id}-title`}
        onClick={(e) => {
          // A click on the dimmed backdrop (the dialog element itself) closes it.
          if (e.target === ref.current) ref.current?.close()
        }}
      >
        <div className="sample-dialog-head">
          <h2 id={`${id}-title`} className="h3">
            {title}
          </h2>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => ref.current?.close()}>
            {labels.close}
          </button>
        </div>
        <object className="sample-dialog-frame" data={url} type="application/pdf" aria-label={title}>
          <p>
            {labels.unavailable}{' '}
            <a href={url} download>
              {labels.download}
            </a>
          </p>
        </object>
      </dialog>
    </>
  )
}
