import { NextResponse } from 'next/server'
import { getSession, setSession } from '@/lib/session'
import { checkPaidMembership } from '@/lib/telegram-auth'
import { createServiceClient } from '@/lib/supabase/server'

// POST — re-check Telegram group membership and update session cookie
export async function POST() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Check DB role first (may have been manually set to admin)
  const { data: profile } = await supabase
    .from('comm_profiles')
    .select('role')
    .eq('telegram_id', session.telegramId)
    .single()

  let newRole: 'free' | 'member' | 'admin'

  if (profile?.role === 'admin') {
    newRole = 'admin'
  } else if (profile?.role === 'member') {
    // Already member in DB — just refresh the cookie
    newRole = 'member'
  } else {
    // Check live Telegram group membership
    const isMember = await checkPaidMembership(session.telegramId)
    newRole = isMember ? 'member' : 'free'

    // Update DB profile if role changed
    if (newRole !== session.role) {
      await supabase
        .from('comm_profiles')
        .update({ role: newRole, role_checked_at: new Date().toISOString() })
        .eq('telegram_id', session.telegramId)
    }
  }

  // Rewrite session cookie with updated role
  await setSession({ ...session, role: newRole })

  return NextResponse.json({ ok: true, role: newRole })
}
