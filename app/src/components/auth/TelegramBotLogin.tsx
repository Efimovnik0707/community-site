'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Step = 'idle' | 'loading' | 'waiting' | 'error'

export function TelegramBotLogin() {
  const [step, setStep] = useState<Step>('idle')
  const [botLink, setBotLink] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')

  const start = async () => {
    setStep('loading')
    const res = await fetch('/api/auth/telegram-start', { method: 'POST' })
    if (!res.ok) { setStep('error'); return }
    const { token, botLink } = await res.json()
    setToken(token)
    setBotLink(botLink)
    setStep('waiting')
    window.open(botLink, '_blank')
  }

  useEffect(() => {
    if (step !== 'waiting' || !token) return

    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/auth/telegram-poll?token=${token}`)
      const data = await res.json()

      if (data.status === 'ok') {
        clearInterval(pollRef.current!)
        if (redirectTo) {
          router.push(redirectTo)
        } else if (data.role === 'admin') {
          router.push('/admin')
        } else if (data.role === 'member') {
          router.push('/courses')
        } else {
          router.push('/join')
        }
      } else if (data.status === 'expired' || data.status === 'invalid') {
        clearInterval(pollRef.current!)
        setStep('error')
      }
    }, 2000)

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, token, router])

  if (step === 'idle') {
    return (
      <Button size="lg" onClick={start} className="gap-2">
        <TelegramIcon />
        Войти через Telegram
      </Button>
    )
  }

  if (step === 'loading') {
    return <Button size="lg" disabled>Создаём ссылку...</Button>
  }

  if (step === 'waiting') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="font-medium mb-1">Откройте бота в Telegram и нажмите Start</p>
          <p className="text-sm text-muted-foreground">Страница обновится автоматически после подтверждения</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="default" size="sm">
            <a href={botLink!} target="_blank" rel="noopener noreferrer">
              Открыть бота
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStep('idle')}>
            Отмена
          </Button>
        </div>
        <div className="flex gap-1 mt-2">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-destructive">Что-то пошло не так. Попробуйте ещё раз.</p>
        <Button size="lg" onClick={start}>Попробовать снова</Button>
      </div>
    )
  }
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.617l-2.95-.924c-.642-.204-.654-.642.136-.953l11.527-4.444c.535-.194 1.003.131.369.952z"/>
    </svg>
  )
}
