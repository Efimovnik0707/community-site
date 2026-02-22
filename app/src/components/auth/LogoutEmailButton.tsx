'use client'

import { createBrowserClient } from '@supabase/ssr'

export function LogoutEmailButton() {
  async function handleLogout() {
    // Clear Supabase Auth session
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    // Clear Telegram session cookie too (if any)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      Выйти
    </button>
  )
}
