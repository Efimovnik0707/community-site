import { Metadata } from 'next'
import { Suspense } from 'react'
import { TelegramBotLogin } from '@/components/auth/TelegramBotLogin'
import { EmailLogin } from '@/components/auth/EmailLogin'

export const metadata: Metadata = {
  title: 'Войти',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string; msg?: string }>
}) {
  const { error, msg } = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Войти</h1>
          <p className="text-sm text-muted-foreground">
            Выбери удобный способ
          </p>
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded p-2">
              {error}{msg ? `: ${msg}` : ''}
            </p>
          )}
        </div>

        {/* Telegram — для членов сообщества */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Члены сообщества</p>
          <Suspense>
            <TelegramBotLogin />
          </Suspense>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="bg-background px-3">или</span>
          </div>
        </div>

        {/* Email/Google — для покупателей продуктов */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Покупатели продуктов</p>
          <Suspense>
            <EmailLoginWrapper />
          </Suspense>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Нажимая кнопку, ты соглашаешься с{' '}
          <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            политикой конфиденциальности
          </a>
        </p>
      </div>
    </main>
  )
}

// Async wrapper to read searchParams for redirect
async function EmailLoginWrapper({}: {}) {
  return <EmailLogin />
}
