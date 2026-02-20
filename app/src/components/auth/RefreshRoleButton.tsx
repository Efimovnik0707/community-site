'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function RefreshRoleButton() {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'notyet'>('idle')

  const refresh = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/auth/refresh-role', { method: 'POST' })
      const data = await res.json()

      if (data.role === 'member' || data.role === 'admin') {
        setState('success')
        router.refresh()
        setTimeout(() => router.push('/courses'), 800)
      } else {
        setState('notyet')
        setTimeout(() => setState('idle'), 3000)
      }
    } catch {
      setState('idle')
    }
  }

  if (state === 'success') {
    return (
      <p className="text-sm text-emerald-400 font-medium">
        ✓ Доступ открыт — переходим к курсам...
      </p>
    )
  }

  if (state === 'notyet') {
    return (
      <p className="text-sm text-muted-foreground">
        Членство пока не обнаружено. Убедись, что вступил в закрытую группу Telegram и попробуй снова.
      </p>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={refresh}
      disabled={state === 'loading'}
      className="text-sm"
    >
      {state === 'loading' ? 'Проверяем...' : 'Я оплатил — обновить доступ'}
    </Button>
  )
}
