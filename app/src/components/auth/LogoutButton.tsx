'use client'

import { createBrowserClient } from '@supabase/ssr'

export function LogoutButton() {
  const logout = async () => {
    // Clear Telegram session cookie
    await fetch('/api/auth/logout', { method: 'POST' })
    // Clear Supabase Auth session (if any)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <button
      onClick={logout}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      Выйти
    </button>
  )
}
