import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'comm_session'

// Only these routes require auth — everything else is public
const AUTH_REQUIRED = ['/dashboard', '/start', '/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
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
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/start/:path*',
    '/admin/:path*',
  ],
}
