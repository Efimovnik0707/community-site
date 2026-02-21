import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Temporary debug endpoint — remove after fixing auth
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const allParams = Object.fromEntries(searchParams.entries())
  const allCookies = req.cookies.getAll().map(c => c.name)

  // Try to get supabase user from current cookies
  let supabaseUser = null
  try {
    const dummyResponse = new NextResponse()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll() },
          setAll() {},
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    supabaseUser = user ? { id: user.id, email: user.email } : null
  } catch (e) {
    supabaseUser = { error: String(e) }
  }

  return NextResponse.json({
    params: allParams,
    cookies: allCookies,
    supabaseUser,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}
