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
    // Grant member access
    const { error } = await supabase
      .from('comm_profiles')
      .upsert(
        {
          telegram_id: telegramId,
          role: 'member',
          role_checked_at: new Date().toISOString(),
        },
        { onConflict: 'telegram_id' }
      )

    if (error) {
      console.error('[tribute-webhook] DB error on upsert:', error)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    console.log('[tribute-webhook] Granted member role to', telegramId)
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
