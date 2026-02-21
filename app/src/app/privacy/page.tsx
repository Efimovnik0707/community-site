import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — AI Комьюнити',
}

export default function PrivacyPage() {
  const updated = '21 февраля 2026 г.'

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

          <h1 className="text-3xl font-bold mb-2">Политика конфиденциальности</h1>
          <p className="text-sm text-muted-foreground mb-10">Последнее обновление: {updated}</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-8">

            <section>
              <h2 className="text-lg font-semibold mb-3">1. Кто мы</h2>
              <p className="text-muted-foreground leading-relaxed">
                AI Комьюнити — образовательная платформа по искусственному интеллекту и автоматизации,
                доступная на сайте <strong>aipack.live</strong>. Владелец: Никита Ефимов
                (ИП / физическое лицо, Испания). По вопросам конфиденциальности: напишите в Telegram{' '}
                <a href="https://t.me/yefimov_comm_bot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @yefimov_comm_bot
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">2. Какие данные мы собираем</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-1">При входе через Telegram:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Telegram ID, имя, username</li>
                    <li>Роль (участник / гость / администратор)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">При входе через Email / Google:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Адрес электронной почты</li>
                    <li>Имя (если предоставлено Google)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">При покупке продукта:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Лицензионный ключ и ID транзакции (через Lemon Squeezy)</li>
                    <li>Платёжные данные обрабатывает Lemon Squeezy — мы их не получаем</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Технические данные:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Cookie сессии для авторизации (httpOnly, secure)</li>
                    <li>Логи запросов на серверах Vercel (автоматически, без возможности отключения)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">3. Для чего мы используем данные</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                <li>Авторизация и идентификация на платформе</li>
                <li>Предоставление доступа к курсам, инструментам и купленным продуктам</li>
                <li>Техническая поддержка и связь с вами</li>
                <li>Обеспечение безопасности платформы</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">4. Правовая основа (GDPR)</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Обработка данных осуществляется на основании:{' '}
                <strong>исполнения договора</strong> (ст. 6(1)(b) GDPR) — для предоставления доступа
                к платформе; <strong>законного интереса</strong> (ст. 6(1)(f)) — для обеспечения
                безопасности; <strong>согласия</strong> (ст. 6(1)(a)) — для связывания аккаунтов
                Telegram и email.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">5. Передача данных третьим сторонам</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Supabase</strong> — база данных и аутентификация (США, соглашение SCCs с ЕС)</p>
                <p><strong className="text-foreground">Vercel</strong> — хостинг (США, соглашение SCCs с ЕС)</p>
                <p><strong className="text-foreground">Lemon Squeezy / Stripe</strong> — приём платежей (Merchant of Record, обрабатывает платёжные данные)</p>
                <p><strong className="text-foreground">Telegram</strong> — авторизация через бота (данные по политике Telegram)</p>
                <p className="pt-1">Мы не продаём и не передаём ваши данные третьим лицам в маркетинговых целях.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">6. Хранение данных</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Данные хранятся, пока у вас есть аккаунт на платформе. После удаления аккаунта —
                в течение 30 дней, после чего удаляются безвозвратно. Логи Vercel хранятся не более
                30 дней согласно их политике.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">7. Ваши права (GDPR)</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                <li><strong className="text-foreground">Доступ</strong> — получить копию своих данных</li>
                <li><strong className="text-foreground">Исправление</strong> — обновить неточные данные</li>
                <li><strong className="text-foreground">Удаление</strong> — запросить удаление аккаунта и данных</li>
                <li><strong className="text-foreground">Ограничение</strong> — ограничить обработку данных</li>
                <li><strong className="text-foreground">Переносимость</strong> — получить данные в машиночитаемом формате</li>
                <li><strong className="text-foreground">Возражение</strong> — отозвать согласие</li>
              </ul>
              <p className="text-muted-foreground text-sm mt-3">
                Для реализации прав: напишите в Telegram{' '}
                <a href="https://t.me/yefimov_comm_bot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @yefimov_comm_bot
                </a>. Ответим в течение 30 дней.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Вы также можете подать жалобу в надзорный орган по защите данных (в Испании —
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">AEPD</a>).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">8. Cookie</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Мы используем только технически необходимые cookie для сессии авторизации.
                Маркетинговые или аналитические cookie не применяются.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">9. Изменения политики</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                При существенных изменениях мы уведомим пользователей через Telegram-канал.
                Дата последнего обновления указана вверху страницы.
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  )
}
