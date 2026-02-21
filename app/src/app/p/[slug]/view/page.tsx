import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { verifyOrder } from '@/lib/lemon-squeezy'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Ваш продукт' }

export default async function ProductViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order_id?: string }>
}) {
  const { slug } = await params
  const { order_id } = await searchParams

  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('comm_products')
    .select('id, slug, title, content_html, lemon_squeezy_product_id, membership_included, lemon_squeezy_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!product) notFound()

  // Check access: member with included product OR valid order
  const session = await getSession()
  const isMember = session?.role === 'member' || session?.role === 'admin'
  const memberAccess = isMember && product.membership_included

  let orderAccess = false
  if (!memberAccess && order_id) {
    const result = await verifyOrder(order_id, product.lemon_squeezy_product_id)
    orderAccess = result.valid
  }

  const hasAccess = memberAccess || orderAccess

  if (!hasAccess) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-xl px-4 text-center">
            <div className="text-4xl mb-6">🔒</div>
            <h1 className="text-2xl font-bold mb-3">Доступ закрыт</h1>
            <p className="text-muted-foreground mb-8">
              {order_id
                ? 'Не удалось подтвердить оплату. Попробуй открыть ссылку из письма Lemon Squeezy.'
                : 'Для просмотра этого продукта нужно его купить.'}
            </p>
            <Button asChild>
              <Link href={`/p/${slug}`}>← Вернуться к продукту</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-8">
            <Link href={`/p/${slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← {product.title}
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-8">{product.title}</h1>

          {product.content_html ? (
            <div
              className="prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.content_html }}
            />
          ) : (
            <p className="text-muted-foreground">Контент продукта скоро появится.</p>
          )}

          {/* Upsell блок */}
          <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="font-medium mb-1">Хочешь ещё больше?</p>
            <p className="text-sm text-muted-foreground mb-4">
              В комьюнити — курсы, живые эфиры, сообщество практиков и новый контент каждую неделю.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/join">Вступить — $50/мес</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
