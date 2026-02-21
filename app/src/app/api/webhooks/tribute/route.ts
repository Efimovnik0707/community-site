import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'

// Tribute webhook — handles subscription events
// Docs: https://wiki.tribute.tg/for-content-creators/api-documentation/webhooks
//
// Events we care about:
//   new_subscription      → set role = 'member'
//   renewed_subscription  → set role = 'member'
//   cancelled_subscription → set role = 'free'

function verifySignature(body: string, signature: string | null, apiKey: string): boolean {
  if (!signature) return false
  const expected = crypto
    .createHmac('sha256', apiKey)
    .update(body)
    .digest('hex')
  return expected === signature
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.TRIBUTE_API_KEY
  if (!apiKey) {
    console.error('[tribute-webhook] TRIBUTE_API_KEY not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  // Read raw body for signature verification
  const body = await req.text()
  const signature = req.headers.get('trbt-signature')

  if (!verifySignature(body, signature, apiKey)) {
    console.warn('[tribute-webhook] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { name: string; payload: { telegram_user_id?: number } }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, payload } = event
  const telegramId = payload?.telegram_user_id

  // Log all events for debugging
  console.log('[tribute-webhook]', name, { telegramId })

  // Only process subscription events with a telegram_user_id
  if (!telegramId) {
    return NextResponse.json({ status: 'ok' })
  }

  const supabase = createServiceClient()

  if (name === 'new_subscription' || name === 'renewed_subscription') {
    // Try to update existing profile first
    const { data: existing } = await supabase
      .from('comm_profiles')
      .select('telegram_id')
      .eq('telegram_id', telegramId)
      .single()

    let error
    if (existing) {
      // Profile exists — just update role
      const { error: updateError } = await supabase
        .from('comm_profiles')
        .update({ role: 'member', role_checked_at: new Date().toISOString() })
        .eq('telegram_id', telegramId)
      error = updateError
    } else {
      // New profile — insert with placeholder first_name
      const { error: insertError } = await supabase
        .from('comm_profiles')
        .insert({
          telegram_id: telegramId,
          first_name: 'Участник',
          role: 'member',
          role_checked_at: new Date().toISOString(),
        })
      error = insertError
    }

    if (error) {
      console.error('[tribute-webhook] DB error:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    console.log('[tribute-webhook] Granted member role to', telegramId)

    // Notify owner in Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const ownerChatId = process.env.TELEGRAM_OWNER_ID
    if (botToken && ownerChatId) {
      const eventLabel = name === 'new_subscription' ? '🎉 Новая подписка' : '🔄 Продление подписки'
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ownerChatId,
          text: `${eventLabel}\n\nTelegram ID: ${telegramId}\nСумма: ${(event as any).payload?.amount ?? '?'} ${((event as any).payload?.currency ?? '').toUpperCase()}`,
        }),
      }).catch(() => {}) // не блокируем если не отправилось
    }
  } else if (name === 'cancelled_subscription') {
    // Only downgrade if not manually set to admin
    const { data: profile } = await supabase
      .from('comm_profiles')
      .select('role')
      .eq('telegram_id', telegramId)
      .single()

    if (profile?.role !== 'admin') {
      await supabase
        .from('comm_profiles')
        .update({ role: 'free', role_checked_at: new Date().toISOString() })
        .eq('telegram_id', telegramId)

      console.log('[tribute-webhook] Revoked member role for', telegramId)
    }
  }

  return NextResponse.json({ status: 'ok' })
}
