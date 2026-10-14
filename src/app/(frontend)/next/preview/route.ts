import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { hasRole } from '@/access'
import { payloadClient } from '@/lib/data'

/**
 * Enables draft preview for signed-in staff only, then opens the page.
 * Draft content is also re-checked against the session on every request.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') ?? '/'
  if (!path.startsWith('/') || path.startsWith('//')) return new NextResponse('Invalid path', { status: 400 })
  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: req.headers })
  if (!hasRole(user as never, 'admin', 'editor', 'sales')) {
    return new NextResponse('Sign in to the admin to preview drafts.', { status: 401 })
  }
  const dm = await draftMode()
  dm.enable()
  return NextResponse.redirect(new URL(path, url.origin), 307)
}
