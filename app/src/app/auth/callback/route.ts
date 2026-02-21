import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'magiclink' | 'email' | 'recovery' | null
  const next = searchParams.get('next') ?? '/my'

  const response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  let supabaseUid: string | null = null

  // OAuth flow (Google etc.) — exchanges code for session
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=exchange_failed&msg=${encodeURIComponent(error.message)}`)
    }
    supabaseUid = data.user?.id ?? null
  }

  // Magic link / email OTP flow — verifies token_hash
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=otp_failed&msg=${encodeURIComponent(error.message)}`)
    }
    supabaseUid = data.user?.id ?? null
  }

  if (!supabaseUid) {
    return NextResponse.redirect(`${origin}/login?error=no_params`)
  }

  // Auto-link Telegram session if active — merge identities in comm_auth_users
  const telegramSession = await getSession()
  if (telegramSession?.telegramId) {
    const service = createServiceClient()
    await service
      .from('comm_auth_users')
      .upsert(
        { supabase_uid: supabaseUid, telegram_id: telegramSession.telegramId },
        { onConflict: 'supabase_uid' }
      )
  }

  return response
}
