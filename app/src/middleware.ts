import { NextRequest, NextResponse } from 'next/server'

const COMM_SESSION = 'comm_session'

// Routes that require Telegram session (community content)
const TELEGRAM_ONLY = ['/dashboard', '/start']

// Routes that accept Telegram OR Supabase session
// Actual role check happens in server component via getUnifiedUser()
const ANY_AUTH = ['/admin']

// Supabase auth cookie name derived from project URL at runtime
function supabaseCookieName(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const ref = url.replace('https://', '').split('.')[0]
  return `sb-${ref}-auth-token`
}

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
  const hasSupabase = !!request.cookies.get(supabaseCookieName())?.value

  // Telegram-only routes (community content)
  if (TELEGRAM_ONLY.some(r => pathname.startsWith(r)) && !hasTelegram) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Admin — accepts either auth; server component validates role
  if (ANY_AUTH.some(r => pathname.startsWith(r)) && !hasTelegram && !hasSupabase) {
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
