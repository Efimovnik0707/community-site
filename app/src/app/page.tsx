import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/Header'
import { createServiceClient } from '@/lib/supabase/server'

interface ProductCard {
  id: string
  slug: string
  title: string
  tagline: string | null
  price_display: string
  old_price_display: string | null
  stripe_payment_link: string | null
  lemon_squeezy_url: string | null
}

export default async function HomePage() {
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('comm_products')
    .select('id, slug, title, tagline, price_display, old_price_display, stripe_payment_link, lemon_squeezy_url')
    .eq('published', true)
    .order('sort_order')

  const publishedProducts: ProductCard[] = products ?? []

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-36 md:pb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-[0.15]"
            style={{ background: 'radial-gradient(ellipse, oklch(0.73 0.13 186) 0%, transparent 70%)' }}
          />
          <div className="relative mx-auto max-w-3xl px-4 text-center">
            <Badge variant="secondary" className="mb-6 text-xs font-medium tracking-wide">
              Никита Ефимов · AI-практик
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl leading-tight">
              Зарабатывай с AI.{' '}
              <span className="text-accent-brand">Я покажу как.</span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground md:text-xl leading-relaxed">
              За 3 месяца я заработал 50 000 EUR на AI-автоматизации. Без сотрудников.
              Здесь я показываю, как это работает. Конкретно, по шагам.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-base font-semibold px-10 h-12">
                <Link href="/join">Вступить в сообщество</Link>
              </Button>
              <span className="text-sm text-muted-foreground">$50/мес · отмена в любой момент</span>
            </div>
          </div>
        </section>

        {/* ── ПРОБЛЕМА ── */}
        <section className="py-16 border-t border-border">
          <div className="mx-auto max-w-3xl px-4">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-10">
              Узнаёшь себя?
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  q: 'Слышишь про AI повсюду',
                  a: 'Но не понимаешь, с чего конкретно начать. ChatGPT открывал, что-то написал, закрыл.',
                },
                {
                  q: 'Видишь что другие зарабатывают',
                  a: 'Кто-то автоматизировал бизнес, кто-то берёт клиентов на автоматизацию. А ты пока наблюдаешь.',
                },
                {
                  q: 'Пробовал курсы, не зашло',
                  a: 'Теория без практики. Практика не по твоим задачам. Или просто не доделал.',
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-semibold mb-2 text-sm">{item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ОСНОВАТЕЛЬ ── */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-3xl px-4">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="shrink-0">
                <Image
                  src="/nikita.png"
                  alt="Никита Ефимов"
                  width={424}
                  height={435}
                  sizes="200px"
                  className="w-40 md:w-48 h-auto"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-brand mb-3">Кто я такой и почему тебе стоит слушать</p>
                <p className="text-lg font-semibold mb-4">Никита Ефимов</p>
                <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
                  <p>
                    Год назад я не думал, что буду зарабатывать на AI. Занимался маркетингом и продажами 10 лет.
                    Потом переехал в Испанию и начал строить всё заново.
                  </p>
                  <p>
                    За последние 3 месяца я заработал 50 000 EUR на автоматизациях. Один построил проект,
                    который оценили в 100 000+ EUR. Без команды. Всё работает на AI.
                  </p>
                  <p>
                    Это сообщество я создал, чтобы показать как. На реальных задачах, не в теории.
                    Буду строить следующие проекты прямо здесь, у тебя на глазах.
                  </p>
                </div>
                <a
                  href="https://t.me/yefimov_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm text-accent-brand hover:opacity-80 transition-opacity"
                >
                  Telegram-канал →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── ЧТО ВНУТРИ ── */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-3xl px-4">
            <div className="mb-10">
              <p className="text-sm font-medium text-accent-brand mb-2">Членство</p>
              <h2 className="text-2xl font-bold md:text-3xl">
                Что получишь за $50 в месяц
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: '🎓',
                  title: 'Курсы с нуля до результата',
                  desc: 'N8N, ChatGPT, Claude Code и вайбкодинг. Реальные вещи с первого урока.',
                },
                {
                  icon: '🔴',
                  title: 'Живые сессии',
                  desc: 'Я строю проекты в прямом эфире, ты смотришь и задаёшь вопросы.',
                },
                {
                  icon: '⚙️',
                  title: 'Шаблоны и воркфлоу',
                  desc: 'Готовые автоматизации, промпты, скиллы для Claude Code. Берёшь и запускаешь.',
                },
                {
                  icon: '💬',
                  title: 'Telegram-сообщество',
                  desc: 'Закрытый чат с людьми, которые реально применяют AI. Вопросы, ответы, обратная связь.',
                },
                {
                  icon: '🗺',
                  title: 'Онбординг на 4 недели',
                  desc: 'Структура с первого дня. Каждый день понятное следующее действие.',
                },
                {
                  icon: '📥',
                  title: 'Все записи навсегда',
                  desc: 'Пропустил сессию? Все записи доступны, пока ты участник.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROOF ── */}
        <section className="py-16 border-t border-border bg-card/30">
          <div className="mx-auto max-w-3xl px-4">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-10">
              На этом я строю то, что преподаю
            </p>
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              {[
                { num: '50 000 EUR', label: 'заработано за 3 месяца на автоматизациях' },
                { num: '100 000+ EUR', label: 'оценка проекта, который я построил один' },
                { num: '0 сотрудников', label: 'всё работает только на AI-инструментах' },
              ].map((stat) => (
                <div key={stat.num} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-2xl font-bold text-accent-brand mb-2">{stat.num}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">
              Это мои результаты. Твои будут зависеть от тебя.
            </p>
          </div>
        </section>

        {/* ── ПРОДУКТЫ ── */}
        {publishedProducts.length > 0 && (
          <section className="py-20 border-t border-border">
            <div className="mx-auto max-w-3xl px-4">
              <div className="mb-8">
                <p className="text-sm font-medium text-muted-foreground mb-2">Не готов к $50/мес?</p>
                <h2 className="text-2xl font-bold">Начни с малого</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Разовая покупка. Попробуй, убедись что работает, потом решай.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {publishedProducts.map(p => (
                  <Link
                    key={p.id}
                    href={`/p/${p.slug}`}
                    className="group block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-sm leading-snug">{p.title}</h3>
                      <span className="shrink-0 flex items-center gap-1.5">
                        {p.old_price_display && (
                          <span className="text-muted-foreground/40 line-through text-xs">{p.old_price_display}</span>
                        )}
                        <span className="text-accent-brand font-bold text-sm">
                          {!p.stripe_payment_link && !p.lemon_squeezy_url ? 'Бесплатно' : p.price_display}
                        </span>
                      </span>
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

        {/* ── ЦЕНА ── */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold md:text-3xl">Членство</h2>
              <p className="mt-2 text-muted-foreground text-sm">Отменяешь в любой момент. Без объяснений.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 max-w-xl mx-auto mb-10">
              <div className="rounded-2xl border border-primary/60 bg-card p-6 relative">
                <Badge className="mb-3 text-xs absolute -top-3 left-4">Лучший старт</Badge>
                <p className="text-sm text-muted-foreground mb-1 mt-2">3 месяца</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">$130</span>
                  <span className="text-sm text-muted-foreground">/3 мес</span>
                </div>
                <p className="text-xs text-accent-brand">Экономия $20 по сравнению с помесячным</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground mb-1">Месяц</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">$50</span>
                  <span className="text-sm text-muted-foreground">/мес</span>
                </div>
                <p className="text-xs text-muted-foreground">Отмена в любой момент</p>
              </div>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="text-base font-semibold px-10 h-12">
                <Link href="/join">Вступить в сообщество</Link>
              </Button>
            </div>

            {/* FAQ */}
            <div className="mt-12 space-y-4 max-w-xl mx-auto">
              {[
                {
                  q: 'А вдруг не подойдёт?',
                  a: 'Отменяешь в один клик. Без звонков и объяснений. Попробуй первый месяц.',
                },
                {
                  q: 'У меня нет времени на курсы',
                  a: 'Онбординг рассчитан на 15-20 минут в день. Пропустил неделю — ничего не потерял, всё сохранено.',
                },
                {
                  q: 'Я уже пробовал курсы по AI — не работало',
                  a: 'Я строю проекты в реальном времени и отвечаю на вопросы. Что-то не понял, пишешь напрямую.',
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
        </section>

        {/* ── ФИНАЛЬНЫЙ CTA ── */}
        <section className="py-20 border-t border-border">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Другие уже зарабатывают с AI.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Покажу как. На реальных задачах. Первый месяц попробуй и реши сам.
            </p>
            <Button asChild size="lg" className="mt-8 text-base font-semibold px-10 h-12">
              <Link href="/join">Вступить за $50/мес</Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">Отмена в любой момент</p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>© 2026 Никита Ефимов</span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Условия
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">
              Возврат
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
