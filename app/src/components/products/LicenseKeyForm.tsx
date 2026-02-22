'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LicenseKeyForm({ slug }: { slug: string }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/products/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), slug }),
      })

      const json = await res.json()

      if (!res.ok || !json.ok) {
        const messages: Record<string, string> = {
          invalid_key: 'Ключ не найден. Проверь и попробуй снова.',
          inactive_key: 'Этот ключ уже использован или отозван.',
          product_mismatch: 'Этот ключ от другого продукта.',
          no_api_key: 'Ошибка конфигурации сервера.',
          fetch_error: 'Ошибка соединения. Попробуй снова.',
        }
        setError(messages[json.reason] ?? 'Неверный ключ. Попробуй снова.')
        setLoading(false)
        return
      }

      // Hard navigate to force server re-check of comm_purchases
      router.push(`/p/${slug}/view`)
      router.refresh()
    } catch {
      setError('Ошибка соединения. Попробуй снова.')
      setLoading(false)
    }
  }

  return (
    <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center">
      <div className="text-4xl mb-4">🔑</div>
      <h2 className="text-xl font-semibold mb-2">Введи лицензионный ключ</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ключ был отправлен на твой email после оплаты.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-mono text-center placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          required
          disabled={loading}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <Button type="submit" disabled={loading || !key.trim()}>
          {loading ? 'Проверяем...' : 'Активировать'}
        </Button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">
        Оплатил через Stripe? Войди с тем же email, и доступ откроется автоматически.
      </p>
    </div>
  )
}
