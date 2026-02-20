import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkPaidMembership } from '@/lib/telegram-auth'

// Step 2: Telegram sends /start <token> to our bot → we verify and store the user
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Verify this is from Telegram (secret token header)
  const secret = req.headers.get('x-telegram-bot-api-secret-token')
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const message = body?.message
  if (!message) return NextResponse.json({ ok: true })

  const text: string = message.text ?? ''
  const from = message.from

  // Only handle /start <token>
  if (!text.startsWith('/start ')) return NextResponse.json({ ok: true })

  const token = text.replace('/start ', '').trim()
  if (!token || !from?.id) return NextResponse.json({ ok: true })

  const supabase = createServiceClient()

  // Validate token (not used, not expired)
  const { data: tokenRow } = await supabase
    .from('comm_auth_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!tokenRow) return NextResponse.json({ ok: true })

  // Mark token as used and attach telegram user
  const isMember = await checkPaidMembership(from.id)
  const role = isMember ? 'member' : 'free'

  await supabase
    .from('comm_auth_tokens')
    .update({
      used: true,
      telegram_id: from.id,
      first_name: from.first_name,
      last_name: from.last_name ?? null,
      username: from.username ?? null,
      role,
    })
    .eq('token', token)

  // Upsert profile
  await supabase.from('comm_profiles').upsert({
    telegram_id: from.id,
    first_name: from.first_name,
    last_name: from.last_name ?? null,
    username: from.username ?? null,
    role,
    role_checked_at: new Date().toISOString(),
  }, { onConflict: 'telegram_id' })

  // Send confirmation message to user in Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: from.id,
      text: `✅ Вы успешно вошли! Вернитесь на сайт — страница обновится автоматически.`,
    }),
  })

  return NextResponse.json({ ok: true })
}
