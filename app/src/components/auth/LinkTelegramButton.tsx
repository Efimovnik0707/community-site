'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Step = 'idle' | 'loading' | 'waiting' | 'done' | 'error'

export function LinkTelegramButton() {
  const [step, setStep] = useState<Step>('idle')
  const [botLink, setBotLink] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()

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
      const res = await fetch(`/api/auth/telegram-link?token=${token}`)
      const data = await res.json()

      if (data.status === 'ok') {
        clearInterval(pollRef.current!)
        setStep('done')
        router.refresh()
      } else if (data.status === 'expired' || data.status === 'invalid' || data.status === 'error') {
        clearInterval(pollRef.current!)
        setStep('error')
      }
      // 'pending' → keep polling
    }, 2000)

    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, token, router])

  if (step === 'done') {
    return <p className="text-sm text-green-600">Telegram привязан ✓</p>
  }

  if (step === 'idle') {
    return (
      <Button variant="outline" size="sm" onClick={start} className="gap-2">
        <TelegramIcon />
        Привязать Telegram
      </Button>
    )
  }

  if (step === 'loading') {
    return <Button variant="outline" size="sm" disabled>Создаём ссылку...</Button>
  }

  if (step === 'waiting') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Откройте бота в Telegram и нажмите Start
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={botLink!} target="_blank" rel="noopener noreferrer">
              <TelegramIcon className="mr-2" />
              Открыть бота
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStep('idle')}>
            Отмена
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-destructive">Что-то пошло не так.</p>
        <Button variant="outline" size="sm" onClick={start}>Повторить</Button>
      </div>
    )
  }
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 14.617l-2.95-.924c-.642-.204-.654-.642.136-.953l11.527-4.444c.535-.194 1.003.131.369.952z"/>
    </svg>
  )
}
