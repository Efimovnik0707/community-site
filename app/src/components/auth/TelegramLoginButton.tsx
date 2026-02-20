'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface TelegramAuthData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export function TelegramLoginButton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME

  useEffect(() => {
    if (!containerRef.current || !botUsername) return

    // Expose callback for Telegram widget
    ;(window as unknown as Record<string, unknown>).onTelegramAuth = async (user: TelegramAuthData) => {
      const res = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })

      if (res.ok) {
        const { role } = await res.json()
        // Redirect based on role
        router.push(role === 'member' || role === 'admin' ? '/courses' : '/join')
      } else {
        console.error('Auth failed')
      }
    }

    // Inject Telegram widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    // data-request-access omitted — only basic profile needed
    script.async = true

    containerRef.current.appendChild(script)

    return () => {
      delete (window as unknown as Record<string, unknown>).onTelegramAuth
    }
  }, [botUsername, router])

  if (!botUsername) {
    return (
      <p className="text-sm text-destructive">
        NEXT_PUBLIC_TELEGRAM_BOT_USERNAME не задан
      </p>
    )
  }

  return <div ref={containerRef} className="flex justify-center" />
}
