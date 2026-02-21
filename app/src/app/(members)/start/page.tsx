import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'С чего начать',
}

const WEEK_1 = [
  { step: 1, title: 'Познакомься с комьюнити', description: 'Зайди в Telegram-группу, напиши кто ты и чем занимаешься в закреплённом треде.', link: null },
  { step: 2, title: 'Пройди курс N8N с нуля', description: 'Начни с первого урока — за неделю освоишь базу автоматизации.', link: '/courses/n8n' },
  { step: 3, title: 'Скачай 3 шаблона N8N', description: 'Возьми готовые воркфлоу и адаптируй под свои задачи.', link: '/tools/n8n' },
]

const WEEK_2 = [
  { step: 1, title: 'ChatGPT для работы', description: 'Пройди курс ChatGPT с нуля — промпты, системные инструкции, применение в бизнесе.', link: '/courses/chatgpt' },
  { step: 2, title: 'Возьми промт-библиотеку', description: 'Скопируй системные промпты копирайтера и email-серии — используй сразу.', link: '/tools/chatgpt' },
]

const WEEK_3 = [
  { step: 1, title: 'Claude Code + вайбкодинг', description: 'Разберись с AI-разработкой: скиллы, паттерны, первый рабочий проект.', link: '/tools/claude-code' },
  { step: 2, title: 'Спроси в чате', description: 'Покажи что строишь — комьюнити поможет с разбором и идеями.', link: null },
]

const WEEK_4 = [
  { step: 1, title: 'Соедини всё вместе', description: 'Построй свою первую end-to-end автоматизацию: триггер → AI → результат.', link: null },
  { step: 2, title: 'Поучаствуй в живом разборе', description: 'Следи за расписанием в группе — разборы проходят раз в 2 недели.', link: null },
]

export default async function StartPage() {
  const user = await getUnifiedUser()
  if (!user) redirect('/login')

  const isMember = user.role === 'member' || user.role === 'admin'

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Welcome */}
          <div className="mb-12">
            <Badge variant="secondary" className="mb-4">Онбординг</Badge>
            <h1 className="text-3xl font-bold mb-3">
              Привет, {user.firstName ?? 'друг'} 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Добро пожаловать в AI Комьюнити. Вот план на первые 4 недели — следуй ему и сразу начнёшь применять AI в работе.
            </p>
          </div>

          {!isMember && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-sm">Ты вошёл как гость</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Часть контента доступна только участникам. Оформи членство чтобы открыть все курсы.
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/join">Стать участником</Link>
              </Button>
            </div>
          )}

          {/* Weeks */}
          <div className="space-y-10">
            <WeekBlock week={1} title="Знакомство и автоматизации" steps={WEEK_1} accessible={isMember} />
            <WeekBlock week={2} title="ChatGPT в работе" steps={WEEK_2} accessible={isMember} />
            <WeekBlock week={3} title="AI-разработка" steps={WEEK_3} accessible={isMember} />
            <WeekBlock week={4} title="Собираем всё вместе" steps={WEEK_4} accessible={isMember} />
          </div>

          {/* Quick links */}
          <div className="mt-14 pt-10 border-t border-border">
            <h2 className="text-lg font-semibold mb-5">Быстрые ссылки</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <QuickLink href="/courses" label="Все курсы" icon="🎓" />
              <QuickLink href="/tools/n8n" label="N8N шаблоны" icon="⚙️" />
              <QuickLink href="/tools/chatgpt" label="ChatGPT промпты" icon="💬" />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function WeekBlock({
  week,
  title,
  steps,
  accessible,
}: {
  week: number
  title: string
  steps: { step: number; title: string; description: string; link: string | null }[]
  accessible: boolean
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">{week}</span>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Неделя {week}</span>
          <h2 className="font-semibold text-sm">{title}</h2>
        </div>
      </div>

      <div className="space-y-3 pl-11">
        {steps.map(s => (
          <div
            key={s.step}
            className="rounded-lg border border-border bg-card p-4 flex items-start gap-4"
          >
            <span className="text-xs font-bold text-accent-brand shrink-0 mt-0.5 w-4">{s.step}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm mb-1">{s.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
            {s.link && accessible && (
              <Button asChild size="sm" variant="secondary" className="shrink-0 text-xs">
                <Link href={s.link}>Перейти</Link>
              </Button>
            )}
            {s.link && !accessible && (
              <span className="text-muted-foreground text-sm shrink-0">🔒</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors text-sm"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  )
}
