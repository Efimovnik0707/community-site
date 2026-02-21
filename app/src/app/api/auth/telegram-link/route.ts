import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

// Links a confirmed Telegram identity to the current Supabase user session
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ status: 'invalid' }, { status: 400 })

  // Must be logged in via email/Google
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ status: 'unauthenticated' }, { status: 401 })

  const service = createServiceClient()

  const { data } = await service
    .from('comm_auth_tokens')
    .select('used, telegram_id, expires_at')
    .eq('token', token)
    .single()

  if (!data) return NextResponse.json({ status: 'invalid' })
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ status: 'expired' })
  if (!data.used || !data.telegram_id) return NextResponse.json({ status: 'pending' })

  // Link supabase user to telegram_id
  const { error } = await service
    .from('comm_auth_users')
    .upsert(
      { supabase_uid: user.id, telegram_id: data.telegram_id },
      { onConflict: 'supabase_uid' }
    )

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }

  return NextResponse.json({ status: 'ok' })
}
