'use client'

export function LogoutButton() {
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
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
