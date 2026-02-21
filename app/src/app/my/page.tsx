import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUserPurchases } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { LogoutEmailButton } from '@/components/auth/LogoutEmailButton'

export const metadata: Metadata = { title: 'Мои продукты' }

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my')
  }

  const purchases = await getUserPurchases(user.id)

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold">Мои продукты</h1>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            </div>
            <LogoutEmailButton />
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-border bg-card/40">
              <div className="text-4xl mb-4">📦</div>
              <p className="font-medium mb-2">Пока нет купленных продуктов</p>
              <p className="text-sm text-muted-foreground mb-6">
                После покупки и активации ключа продукт появится здесь
              </p>
              <Button asChild variant="outline">
                <Link href="/">Смотреть продукты</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase: {
                id: string
                created_at: string
                comm_products: { slug: string; title: string; tagline: string | null } | null
              }) => {
                const product = purchase.comm_products
                if (!product) return null
                return (
                  <Link
                    key={purchase.id}
                    href={`/p/${product.slug}/view`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <h2 className="font-semibold text-sm">{product.title}</h2>
                      {product.tagline && (
                        <p className="text-xs text-muted-foreground mt-0.5">{product.tagline}</p>
                      )}
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Куплено {new Date(purchase.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <span className="text-xs text-primary group-hover:underline shrink-0 ml-4">
                      Открыть →
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
