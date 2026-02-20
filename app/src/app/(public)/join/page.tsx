import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { getSession } from '@/lib/session'
import { RefreshRoleButton } from '@/components/auth/RefreshRoleButton'

export const metadata: Metadata = {
  title: 'Стать участником',
  description: 'Доступ ко всем курсам, инструментам и AI-комьюнити Никиты Ефимова.',
}

const INVITE_MEMBER_URL = 'https://web.tribute.tg/s/ODh'

const features = [
  { icon: '🎓', text: 'Все курсы: N8N, ChatGPT, Claude Code и новые по мере выхода' },
  { icon: '🛠', text: 'Премиум-шаблоны, скиллы и воркфлоу — сразу готовые к использованию' },
  { icon: '💬', text: 'Закрытый Telegram-чат с разборами, ответами и живым общением' },
  { icon: '🎥', text: 'Записи живых сессий и вайбкодинг-стримов' },
  { icon: '🗺', text: 'Онбординг-программа на 4 недели — структура с первого дня' },
  { icon: '🚀', text: 'Новый контент каждую неделю' },
]

export default async function JoinPage() {
  const session = await getSession()
  const isLoggedIn = !!session
  const isMember = session?.role === 'member' || session?.role === 'admin'

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Header */}
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-4">AI Комьюнити</Badge>
            <h1 className="text-3xl font-bold md:text-4xl">
              Стань участником комьюнити
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Полный доступ к курсам, инструментам и живому сообществу практиков
            </p>
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-border bg-card p-8 mb-8">
            <h2 className="font-semibold mb-6">Что входит в членство:</h2>
            <ul className="space-y-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{f.icon}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            <PriceCard
              label="Месяц"
              price="$50"
              period="/ месяц"
              description="Полный доступ, отмена в любой момент"
            />
            <PriceCard
              label="3 месяца"
              price="$130"
              period="/ 3 месяца"
              description="Экономия $20 — лучший старт"
              highlighted
            />
          </div>

          {/* CTA */}
          <div className="text-center space-y-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-base font-semibold px-12">
              <a href={INVITE_MEMBER_URL} target="_blank" rel="noopener noreferrer">
                Оформить членство
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
              Оплата через Tribute · Отмена без штрафов ·{' '}
              {isLoggedIn ? (
                <span>Уже оплатил? Обнови доступ ниже</span>
              ) : (
                <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
                  Уже оплатил? Войди через Telegram
                </Link>
              )}
            </p>

            {/* Already paid — refresh role without re-logging in */}
            {isLoggedIn && !isMember && (
              <div className="pt-2 border-t border-border mt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Уже вступил в группу Telegram после оплаты?
                </p>
                <RefreshRoleButton />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

function PriceCard({
  label,
  price,
  period,
  description,
  highlighted = false,
}: {
  label: string
  price: string
  period: string
  description: string
  highlighted?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlighted
          ? 'border-primary/60 bg-card glow-accent'
          : 'border-border bg-card'
      }`}
    >
      {highlighted && (
        <Badge className="mb-3 text-xs">Популярный</Badge>
      )}
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
