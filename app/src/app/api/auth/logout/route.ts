import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/session'

export async function POST() {
  await clearSession()
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://community-site-gilt-seven.vercel.app'), 303)
}
