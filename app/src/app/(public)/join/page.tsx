import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { getSession } from '@/lib/session'
import { RefreshRoleButton } from '@/components/auth/RefreshRoleButton'

export const metadata: Metadata = {
  title: 'Вступить в сообщество',
  description: 'Научись зарабатывать с помощью AI. Курсы, живые сессии и сообщество практиков от Никиты Ефимова.',
}

const INVITE_MEMBER_URL = 'https://web.tribute.tg/s/ODh'

export default async function JoinPage() {
  const session = await getSession()
  const isLoggedIn = !!session
  const isMember = session?.role === 'member' || session?.role === 'admin'

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs">AI-сообщество</Badge>
            <h1 className="text-3xl font-bold md:text-4xl leading-tight">
              Начни зарабатывать с AI
            </h1>
            <p className="mt-4 text-muted-foreground">
              Я зарабатываю 50 000+ EUR в квартал на AI-автоматизациях. Покажу как: с нуля, по шагам.
            </p>
          </div>

          {/* What you get */}
          <div className="rounded-2xl border border-border bg-card p-8 mb-6">
            <p className="font-semibold mb-6 text-sm">Что входит:</p>
            <ul className="space-y-4">
              {[
                { icon: '🎓', text: 'Все курсы сразу: N8N, ChatGPT, Claude Code и вайбкодинг. Новые добавляю постоянно.' },
                { icon: '🔴', text: 'Живые сессии: смотришь как я строю реальные проекты и задаёшь вопросы.' },
                { icon: '⚙️', text: 'Шаблоны, воркфлоу и скиллы для Claude Code. Берёшь и запускаешь.' },
                { icon: '💬', text: 'Закрытый Telegram-чат с людьми, которые реально применяют AI.' },
                { icon: '🗺', text: 'Онбординг на 4 недели: 15-20 минут в день, понятное следующее действие с первого дня.' },
                { icon: '📥', text: 'Все записи сессий. Смотришь когда удобно, ничего не теряешь.' },
              ].map((f) => (
                <li key={f.icon} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{f.icon}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="grid gap-4 sm:grid-cols-2 mb-8">
            <div className="rounded-2xl border border-primary/60 bg-card p-6 relative">
              <Badge className="mb-3 text-xs absolute -top-3 left-4">Лучший старт</Badge>
              <div className="flex items-center gap-2 mt-2 mb-1">
                <p className="text-sm text-muted-foreground">3 месяца</p>
                <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-md">-50%</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-muted-foreground/50 line-through">$260</span>
                <span className="text-3xl font-bold">$130</span>
                <span className="text-sm text-muted-foreground">/3 мес</span>
              </div>
              <p className="text-xs text-accent-brand">Экономия $130 · скидка при оплате сразу 3 месяца</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">Месяц</p>
                <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-md">-50%</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm text-muted-foreground/50 line-through">$100</span>
                <span className="text-3xl font-bold">$50</span>
                <span className="text-sm text-muted-foreground">/мес</span>
              </div>
              <p className="text-xs text-muted-foreground">Цена запуска · отмена в любой момент</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-3">
            <Button asChild size="lg" className="w-full sm:w-auto text-base font-semibold px-12 h-12">
              <a href={INVITE_MEMBER_URL} target="_blank" rel="noopener noreferrer">
                Вступить в сообщество
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

            {isLoggedIn && (
              <div className="pt-4 border-t border-border mt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  {isMember ? 'Обновить статус доступа' : 'Уже вступил в группу Telegram после оплаты?'}
                </p>
                <RefreshRoleButton />
              </div>
            )}
          </div>

          {/* FAQ */}
          <div className="mt-12 space-y-3">
            <p className="text-sm font-semibold mb-4">Частые вопросы</p>
            {[
              {
                q: 'А вдруг не подойдёт?',
                a: 'Отменяешь в один клик. Без звонков и объяснений. Попробуй первый месяц и реши сам.',
              },
              {
                q: 'У меня совсем нет технического образования',
                a: 'Это нормально. Большинство участников начинают с нуля. Онбординг построен так, чтобы первые результаты были уже в первую неделю.',
              },
              {
                q: 'Чем это отличается от обычного курса?',
                a: 'Я строю реальные проекты прямо сейчас, ты видишь как это происходит. Записи тоже есть, но основа это живые сессии на текущих задачах.',
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-border bg-card">
                <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium list-none">
                  {item.q}
                  <svg className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}
