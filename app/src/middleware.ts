import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'comm_session'

// Routes that require any auth (free or member)
const AUTH_ROUTES = ['/dashboard', '/start']

// Routes that require paid membership
const MEMBER_ROUTES = ['/courses', '/tools']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value

  // Parse session without crypto (middleware runs in Edge runtime)
  // We only need to check existence and role — full verification happens in API routes
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
  const isMember = role === 'member' || role === 'admin'

  // Check member-only routes
  const requiresMembership = MEMBER_ROUTES.some(r => pathname.startsWith(r))
  if (requiresMembership && !isMember) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Logged in but not a member — redirect to join page
    return NextResponse.redirect(new URL('/join', request.url))
  }

  // Check auth-required routes
  const requiresAuth = AUTH_ROUTES.some(r => pathname.startsWith(r))
  if (requiresAuth && !isAuthenticated) {
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
