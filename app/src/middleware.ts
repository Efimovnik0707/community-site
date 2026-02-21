import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'comm_session'

// Only these routes require auth — everything else is public
const AUTH_REQUIRED = ['/dashboard', '/start', '/admin']

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

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value

  let isAuthenticated = false

  if (sessionCookie) {
    try {
      const lastDot = sessionCookie.lastIndexOf('.')
      if (lastDot !== -1) {
        const payload = sessionCookie.slice(0, lastDot)
        JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
        isAuthenticated = true
      }
    } catch {
      // Invalid cookie
    }
  }

  const requiresAuth = AUTH_REQUIRED.some(r => pathname.startsWith(r))
  if (requiresAuth && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
