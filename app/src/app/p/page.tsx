import { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Продукты',
  description: 'Цифровые продукты по AI и автоматизации',
}

export default async function ProductsPage() {
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('comm_products')
    .select('id, slug, title, tagline, price_display, membership_included')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  const user = await getUnifiedUser()
  const isMember = user?.role === 'member' || user?.role === 'admin'

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Продукты</h1>
            <p className="text-muted-foreground">
              Цифровые инструменты по AI и автоматизации — разовая покупка, навсегда твой
            </p>
          </div>

          {(!products || products.length === 0) ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-2">Продукты скоро появятся</p>
              <p className="text-sm">Следи за анонсами в Telegram-канале</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(product => {
                const memberHasFree = isMember && product.membership_included
                return (
                  <Link
                    key={product.id}
                    href={`/p/${product.slug}`}
                    className="group flex items-center gap-5 rounded-2xl border border-border bg-card px-6 py-5 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold mb-0.5 group-hover:text-primary transition-colors">
                        {product.title}
                      </h2>
                      {product.tagline && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {product.tagline}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {memberHasFree ? (
                        <span className="text-xs text-primary font-medium">Входит в членство</span>
                      ) : (
                        <span className="text-lg font-bold">{product.price_display}</span>
                      )}
                    </div>
                    <svg className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                )
              })}
            </div>
          )}

          {!isMember && (
            <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="font-medium mb-1">Участники получают продукты со скидкой или бесплатно</p>
              <p className="text-sm text-muted-foreground mb-4">
                Членство открывает доступ к курсам, эфирам и части продуктов без доплаты
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/join">Вступить — $50/мес</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
