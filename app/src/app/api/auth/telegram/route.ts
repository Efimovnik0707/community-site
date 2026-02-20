import { NextRequest, NextResponse } from 'next/server'
import { verifyTelegramAuth, checkPaidMembership, type TelegramAuthData } from '@/lib/telegram-auth'
import { setSession } from '@/lib/session'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  let body: TelegramAuthData

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // 1. Verify Telegram HMAC signature
  if (!verifyTelegramAuth(body)) {
    return NextResponse.json({ error: 'Invalid Telegram auth data' }, { status: 401 })
  }

  // 2. Check paid group membership
  const isMember = await checkPaidMembership(body.id)

  const role = isMember ? 'member' : 'free'

  // 3. Upsert profile in DB (service role — bypasses RLS)
  const supabase = createServiceClient()
  const { error } = await supabase.from('comm_profiles').upsert(
    {
      telegram_id: body.id,
      first_name: body.first_name,
      last_name: body.last_name ?? null,
      username: body.username ?? null,
      photo_url: body.photo_url ?? null,
      role,
      role_checked_at: new Date().toISOString(),
    },
    { onConflict: 'telegram_id' }
  )

  if (error) {
    console.error('Supabase upsert error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // 4. Set session cookie
  await setSession({
    telegramId: body.id,
    firstName: body.first_name,
    lastName: body.last_name,
    username: body.username,
    photoUrl: body.photo_url,
    role,
  })

  return NextResponse.json({ ok: true, role })
}
