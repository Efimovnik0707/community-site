import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { createServiceClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('comm_products')
    .select('id, slug, title, tagline, price_display')
    .eq('published', true)
    .order('sort_order')

  const publishedProducts = products ?? []

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
          {/* Glow backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, oklch(0.73 0.13 186) 0%, transparent 70%)' }}
          />

          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <Badge variant="secondary" className="mb-6 text-xs font-medium">
              AI Комьюнити · Никита Ефимов
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Применяй AI{' '}
              <span className="text-accent-brand">в реальной работе</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl leading-relaxed">
              Инструменты, шаблоны и курсы по AI-автоматизации.
              Бесплатные ресурсы — открыто. Глубокий контент, живые разборы и сообщество — для участников.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base font-semibold px-8">
                <Link href="/join">Стать участником</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-8">
                <Link href="/tools/n8n">Смотреть ресурсы</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Products — only shown if published products exist */}
        {publishedProducts.length > 0 && (
          <section className="py-20 border-t border-border">
            <div className="mx-auto max-w-5xl px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold md:text-3xl">Продукты</h2>
                <p className="mt-2 text-muted-foreground">Готовые инструменты и инструкции — разовая покупка</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {publishedProducts.map(p => (
                  <Link
                    key={p.id}
                    href={`/p/${p.slug}`}
                    className="group block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-sm leading-snug">{p.title}</h3>
                      <span className="text-accent-brand font-bold text-sm shrink-0">{p.price_display}</span>
                    </div>
                    {p.tagline && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.tagline}</p>
                    )}
                    <p className="mt-4 text-xs text-primary group-hover:underline">Купить →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* What's inside */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-center mb-12 md:text-3xl">
              Что внутри
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon="⚙️"
                title="N8N автоматизации"
                description="Готовые воркфлоу-шаблоны, промпты для агентов, разборы реальных кейсов."
                href="/tools/n8n"
                badge="Доступно сейчас"
              />
              <FeatureCard
                icon="🤖"
                title="Claude Code"
                description="Скиллы, паттерны вайбкодинга, шаблоны для разработки с AI-ассистентом."
                href="/tools/claude-code"
                badge="Доступно сейчас"
              />
              <FeatureCard
                icon="💬"
                title="ChatGPT"
                description="Промт-библиотека для бизнеса и маркетинга. Системные промпты и шаблоны."
                href="/tools/chatgpt"
                badge="Доступно сейчас"
              />
            </div>
          </div>
        </section>

        {/* Courses teaser */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Курсы</h2>
                <p className="mt-2 text-muted-foreground">
                  Структурированные программы — от основ до продвинутой автоматизации
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/courses">Все курсы</Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <CourseCard
                num={1}
                title="N8N автоматизации"
                description="Строим рабочие автоматизации с нуля — триггеры, API, AI-агенты."
                available
              />
              <CourseCard
                num={2}
                title="ChatGPT с нуля"
                description="Практический курс по работе с ChatGPT для задач бизнеса и маркетинга."
                available
              />
              <CourseCard
                num={3}
                title="Claude Code + Вайбкодинг"
                description="Разработка с AI-ассистентом: от идеи до рабочего продукта."
                available={false}
              />
              <CourseCard
                num={4}
                title="Агентные системы для бизнеса"
                description="Проектирование и запуск многоагентных систем для реальных задач."
                available={false}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Готов применять AI на практике?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Вступай в комьюнити — получи доступ ко всем курсам, инструментам и живым разборам.
            </p>
            <Button asChild size="lg" className="mt-8 text-base font-semibold px-10">
              <Link href="/join">Стать участником</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>© 2026 Никита Ефимов · AI Комьюнити</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Конфиденциальность
            </Link>
            <a
              href="https://t.me/yefimov_comm_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  badge,
}: {
  icon: string
  title: string
  description: string
  href: string
  badge: string
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-card/80"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="secondary" className="text-xs shrink-0">{badge}</Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Link>
  )
}

function CourseCard({
  num,
  title,
  description,
  available,
}: {
  num: number
  title: string
  description: string
  available: boolean
}) {
  return (
    <div className={`rounded-xl border p-5 flex gap-4 ${available ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-60'}`}>
      <span className="text-2xl font-bold text-accent-brand shrink-0 w-8">{num}</span>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          {!available && (
            <Badge variant="secondary" className="text-xs">Скоро</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
