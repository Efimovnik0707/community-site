import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Step 1: Generate a login token and return the bot deep-link
export async function POST() {
  const token = crypto.randomBytes(24).toString('hex')
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('comm_auth_tokens')
    .insert({ token })

  if (error) {
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
  }

  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
  const botLink = `https://t.me/${botUsername}?start=${token}`

  return NextResponse.json({ token, botLink })
}
