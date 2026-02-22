import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Политика возврата — AI Комьюнити',
}

export default function RefundPage() {
  const updated = '22 февраля 2026 г.'

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-10">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← На главную
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">Политика возврата</h1>
          <p className="text-sm text-muted-foreground mb-10">Последнее обновление: {updated}</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8">

            <section>
              <h2 className="text-lg font-semibold mb-3">Цифровые продукты</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Мы продаём цифровые продукты (промпты, шаблоны, инструкции), которые доставляются
                мгновенно после оплаты. Поскольку цифровой контент нельзя «вернуть» после
                просмотра, действуют следующие правила.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Когда возврат возможен</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <p className="font-medium text-foreground mb-2">До получения доступа к контенту</p>
                  <p>
                    Если вы оплатили продукт, но ещё не получили доступ к контенту (не
                    активировали ключ, не открывали страницу продукта), вы можете запросить
                    полный возврат в течение <strong className="text-foreground">14 дней</strong> с момента покупки.
                    Это соответствует праву на отказ от договора по Директиве ЕС 2011/83/EU.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-4">
                  <p className="font-medium text-foreground mb-2">Продукт не соответствует описанию</p>
                  <p>
                    Если продукт существенно отличается от заявленного описания на странице покупки,
                    вы можете запросить возврат независимо от того, получили ли вы доступ к контенту.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Когда возврат невозможен</h2>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-muted-foreground">
                  После получения доступа к цифровому контенту (открытие страницы продукта,
                  активация ключа) право на возврат утрачивается. Совершая покупку, вы
                  соглашаетесь на немедленное предоставление цифрового контента и подтверждаете,
                  что понимаете: после получения доступа право на отказ от договора не применяется
                  (ст. 16(m) Директивы 2011/83/EU).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Как запросить возврат</h2>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 text-sm">
                <li>
                  Напишите в{' '}
                  <a href="https://t.me/yefimov_comm_bot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    @yefimov_comm_bot
                  </a>{' '}
                  в Telegram
                </li>
                <li>Укажите email, который использовался при оплате</li>
                <li>Опишите причину возврата</li>
              </ol>
              <p className="text-muted-foreground text-sm mt-3">
                Мы рассмотрим запрос в течение 5 рабочих дней. Возврат осуществляется
                на исходный метод оплаты через Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Подписка на сообщество</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Подписка на сообщество оплачивается помесячно. Вы можете отменить подписку
                в любое время. После отмены доступ сохраняется до конца оплаченного периода.
                Возврат за уже использованный период не производится.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Chargebacks</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Мы просим сначала связаться с нами напрямую для решения вопроса. Подача
                необоснованного chargeback через банк может привести к блокировке аккаунта
                на Платформе.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Контакты</h2>
              <p className="text-muted-foreground text-sm">
                Все вопросы по возвратам:{' '}
                <a href="https://t.me/yefimov_comm_bot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @yefimov_comm_bot
                </a> в Telegram.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  )
}
