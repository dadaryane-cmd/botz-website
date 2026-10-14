import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const path = url.searchParams.get('path') ?? '/'
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL(path.startsWith('/') && !path.startsWith('//') ? path : '/', url.origin), 307)
}
