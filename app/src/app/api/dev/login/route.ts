import { NextRequest, NextResponse } from 'next/server'
import { setSession } from '@/lib/session'

/**
 * DEV ONLY — bypass login for local testing.
 * Protected by DEV_SECRET env variable.
 * Remove this file before going to production.
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.DEV_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await setSession({
    telegramId: 383996218,
    firstName: 'Никита',
    username: 'yefimov',
    role: 'member',
  })

  return NextResponse.redirect(new URL('/courses', req.url))
}
