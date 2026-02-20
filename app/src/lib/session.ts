import { cookies } from 'next/headers'

export interface SessionUser {
  telegramId: number
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
  role: 'free' | 'member' | 'admin'
}

const COOKIE_NAME = 'comm_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

/**
 * Encode session as signed base64 JSON.
 * Simple signing — for production consider using jose/JWT.
 */
function sign(payload: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!.slice(0, 32)
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${hmac}`
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf('.')
  if (lastDot === -1) return null
  const payload = signed.slice(0, lastDot)
  const expected = sign(payload)
  if (expected !== signed) return null
  return payload
}

export async function setSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies()
  const payload = Buffer.from(JSON.stringify(user)).toString('base64')
  const signed = sign(payload)
  cookieStore.set(COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const signed = cookieStore.get(COOKIE_NAME)?.value
  if (!signed) return null

  const payload = verify(signed)
  if (!payload) return null

  try {
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as SessionUser
  } catch {
    return null
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
