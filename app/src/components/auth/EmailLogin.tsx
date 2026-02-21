'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

export function EmailLogin({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (redirectTo) callbackUrl.searchParams.set('next', redirectTo)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl.toString() },
    })

    setLoading(false)
    if (error) {
      setError('Не удалось отправить письмо. Попробуй снова.')
    } else {
      setSent(true)
    }
  }

  async function handleGoogle() {
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (redirectTo) callbackUrl.searchParams.set('next', redirectTo)

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl.toString() },
    })
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-3">📬</div>
        <p className="font-medium mb-1">Письмо отправлено</p>
        <p className="text-sm text-muted-foreground">
          Открой <strong>{email}</strong> и кликни по ссылке в письме.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleEmail} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="твой@email.com"
          required
          disabled={loading}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <Button type="submit" variant="outline" disabled={loading || !email}>
          {loading ? 'Отправляем...' : 'Войти по Email'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-background px-2">или</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Войти через Google
      </Button>
    </div>
  )
}
