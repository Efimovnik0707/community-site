import { Metadata } from 'next'
import { TelegramBotLogin } from '@/components/auth/TelegramBotLogin'

export const metadata: Metadata = {
  title: 'Войти',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Войти в комьюнити
          </h1>
          <p className="text-sm text-muted-foreground">
            Используй Telegram-аккаунт — никаких паролей
          </p>
        </div>

        <TelegramBotLogin />

        <p className="text-xs text-muted-foreground">
          Нажимая кнопку, ты соглашаешься с{' '}
          <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            политикой конфиденциальности
          </a>
        </p>
      </div>
    </main>
  )
}
