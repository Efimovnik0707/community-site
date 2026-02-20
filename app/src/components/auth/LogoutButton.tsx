'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
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
