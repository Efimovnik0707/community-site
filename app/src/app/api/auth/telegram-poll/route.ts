import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { setSession } from '@/lib/session'

// Step 3: Frontend polls this to check if token was confirmed by bot
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ status: 'invalid' }, { status: 400 })

  const supabase = createServiceClient()

  const { data } = await supabase
    .from('comm_auth_tokens')
    .select('used, telegram_id, first_name, last_name, username, role, expires_at')
    .eq('token', token)
    .single()

  if (!data) return NextResponse.json({ status: 'invalid' })

  // Check expiry
  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ status: 'expired' })
  }

  // Not yet confirmed by bot
  if (!data.used || !data.telegram_id) {
    return NextResponse.json({ status: 'pending' })
  }

  // Confirmed — create session
  await setSession({
    telegramId: data.telegram_id,
    firstName: data.first_name,
    lastName: data.last_name ?? undefined,
    username: data.username ?? undefined,
    role: data.role,
  })

  return NextResponse.json({ status: 'ok', role: data.role })
}
