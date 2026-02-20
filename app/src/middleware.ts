import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'comm_session'

// Routes that require any auth (redirect to /login if not logged in)
const AUTH_ROUTES = ['/dashboard', '/start']

// Routes that require auth but NOT membership — free users see locked UI
// (blur/lock is handled in the page itself)
const SOFT_AUTH_ROUTES = ['/courses', '/tools']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value

  let role: string | null = null

  if (sessionCookie) {
    try {
      const lastDot = sessionCookie.lastIndexOf('.')
      if (lastDot !== -1) {
        const payload = sessionCookie.slice(0, lastDot)
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
        role = decoded.role ?? null
      }
    } catch {
      // Invalid cookie — treat as unauthenticated
    }
  }

  const isAuthenticated = role !== null

  // /start, /dashboard — must be logged in
  const requiresAuth = AUTH_ROUTES.some(r => pathname.startsWith(r))
  if (requiresAuth && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // /courses, /tools — must be logged in, free users see locked UI
  const requiresSoftAuth = SOFT_AUTH_ROUTES.some(r => pathname.startsWith(r))
  if (requiresSoftAuth && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/start/:path*',
    '/courses/:path*',
    '/tools/:path*',
  ],
}
