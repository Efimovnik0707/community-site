import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Условия использования — AI Комьюнити',
}

export default function TermsPage() {
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

          <h1 className="text-3xl font-bold mb-2">Условия использования</h1>
          <p className="text-sm text-muted-foreground mb-10">Последнее обновление: {updated}</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8">

            <section>
              <h2 className="text-lg font-semibold mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Настоящие условия регулируют использование платформы <strong>aipack.live</strong> (далее «Платформа»),
                принадлежащей Никите Ефимову (Испания). Используя Платформу или приобретая продукты,
                вы соглашаетесь с этими условиями.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Описание услуг</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Платформа предоставляет доступ к образовательным материалам по искусственному интеллекту
                и автоматизации: курсы, инструменты, цифровые продукты (шаблоны, промпты) и закрытое
                сообщество. Часть контента бесплатна, часть доступна по подписке или разовой покупке.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. Цифровые продукты</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  При покупке цифрового продукта вы получаете <strong className="text-foreground">персональную
                  лицензию</strong> на его использование. Вы не приобретаете права интеллектуальной
                  собственности на продукт.
                </p>
                <p>Запрещено:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Перепродавать, передавать или публично распространять купленные продукты</li>
                  <li>Использовать продукты для создания конкурирующих сервисов</li>
                  <li>Удалять указание на авторство</li>
                </ul>
                <p>
                  Одна покупка = одна лицензия для одного пользователя. Использование на нескольких
                  устройствах одного пользователя допускается.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Оплата</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Платежи обрабатываются через <strong className="text-foreground">Stripe</strong>.
                Цены указаны на странице каждого продукта. Оплата производится в момент покупки.
                Мы не храним данные банковских карт. Подробности о возврате средств:{' '}
                <Link href="/refund" className="text-primary hover:underline">Политика возврата</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Аккаунт и авторизация</h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Вход на Платформу возможен через Telegram или email (magic link / Google). Вы
                  несёте ответственность за безопасность своего аккаунта и действия, совершённые
                  от вашего имени.
                </p>
                <p>
                  Мы вправе заблокировать аккаунт при нарушении условий использования, попытках
                  мошенничества или злоупотребления системой возвратов.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Отказ от гарантий</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Цифровые продукты (промпты, шаблоны) являются инструментами. Конкретные результаты
                зависят от вашего применения. Мы не гарантируем определённый финансовый или иной
                результат от использования продуктов.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Ограничение ответственности</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Максимальная ответственность ограничена суммой, уплаченной вами за конкретный
                продукт или услугу. Мы не несём ответственности за косвенные, случайные или
                штрафные убытки в пределах, допускаемых применимым законодательством.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Изменения условий</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Мы можем обновлять эти условия. При существенных изменениях уведомим через
                Telegram-канал. Продолжая использовать Платформу, вы принимаете обновлённые условия.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. Применимое право</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Настоящие условия регулируются законодательством Испании. Для потребителей из ЕС
                сохраняется право обращения в суд по месту жительства в соответствии с Регламентом (ЕС) № 1215/2012.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">10. Контакты</h2>
              <p className="text-muted-foreground text-sm">
                По любым вопросам:{' '}
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
