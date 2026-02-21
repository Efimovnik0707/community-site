import { NextRequest, NextResponse } from 'next/server'

const COMM_SESSION = 'comm_session'

// Community routes — require active Telegram session
// (actual role check happens in each layout/page)
const TELEGRAM_REQUIRED = ['/dashboard', '/start']

// /admin is intentionally excluded here — auth is handled in
// admin/layout.tsx via getUnifiedUser() which supports both
// Telegram session and email+linked-Telegram identity

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Intercept Supabase auth codes that land at wrong URL
  // (Supabase may redirect to Site URL instead of /auth/callback)
  if (pathname !== '/auth/callback') {
    const code = searchParams.get('code')
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (code || (tokenHash && type)) {
      const callbackUrl = new URL('/auth/callback', request.url)
      if (code) callbackUrl.searchParams.set('code', code)
      if (tokenHash) callbackUrl.searchParams.set('token_hash', tokenHash)
      if (type) callbackUrl.searchParams.set('type', type)
      return NextResponse.redirect(callbackUrl)
    }
  }

  const hasTelegram = !!request.cookies.get(COMM_SESSION)?.value

  if (TELEGRAM_REQUIRED.some(r => pathname.startsWith(r)) && !hasTelegram) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
