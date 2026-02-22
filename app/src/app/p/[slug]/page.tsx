import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminEditBar } from '@/components/admin/AdminEditBar'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase.from('comm_products').select('title, tagline').eq('slug', slug).single()
  if (!data) return { title: 'Продукт не найден' }
  return { title: data.title, description: data.tagline ?? undefined }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === '1'

  const user = await getUnifiedUser()
  const isAdmin = user?.role === 'admin'
  const isMember = user?.role === 'member' || user?.role === 'admin'

  const supabase = createServiceClient()
  const baseQuery = supabase
    .from('comm_products')
    .select('id, slug, title, tagline, description_html, price_display, lemon_squeezy_url, stripe_payment_link, membership_included, published')
    .eq('slug', slug)

  const { data: product } = await (isPreview && isAdmin
    ? baseQuery.single()
    : baseQuery.eq('published', true).single())

  if (!product) notFound()

  const hasAccess = isMember && product.membership_included

  return (
    <>
      <Header />
      <main className={`pt-24 ${isAdmin ? 'pb-32' : 'pb-20'}`}>
        {/* Preview banner */}
        {isPreview && isAdmin && !product.published && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 bg-yellow-500/90 text-black text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            Режим превью — продукт не опубликован
          </div>
        )}

        <div className="mx-auto max-w-2xl px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-xs">Продукт</Badge>
            <h1 className="text-3xl font-bold md:text-4xl mb-4 leading-tight">{product.title}</h1>
            {product.tagline && (
              <p className="text-lg text-muted-foreground">{product.tagline}</p>
            )}
          </div>

          {/* Description */}
          {product.description_html && (
            <div
              className="prose prose-invert prose-sm max-w-none mb-10 rounded-2xl border border-border bg-card p-8"
              dangerouslySetInnerHTML={{ __html: product.description_html }}
            />
          )}

          {/* CTA */}
          <div className="text-center space-y-4">
            {hasAccess ? (
              <>
                <p className="text-sm text-muted-foreground">Этот продукт доступен тебе как участнику сообщества</p>
                <Button asChild size="lg" className="text-base font-semibold px-10 h-12">
                  <Link href={`/p/${slug}/view${isPreview ? '?preview=1' : ''}`}>Открыть продукт</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-bold">{product.price_display}</span>
                  <span className="text-muted-foreground text-sm">разовая оплата</span>
                </div>
                <Button asChild size="lg" className="text-base font-semibold px-10 h-12">
                  <a href={product.stripe_payment_link || product.lemon_squeezy_url} target="_blank" rel="noopener noreferrer">
                    Купить сейчас
                  </a>
                </Button>

                {/* Why so cheap explanation */}
                <p className="text-xs text-muted-foreground max-w-sm mx-auto pt-1">
                  Хочу, чтобы ты попробовал и сам убедился.
                </p>

                <p className="text-xs text-muted-foreground pt-1">
                  Оплата через Lemon Squeezy · Карта, PayPal, Apple Pay
                  {product.membership_included && (
                    <> · Входит в{' '}
                      <Link href="/join" className="underline underline-offset-4 hover:text-foreground">членство</Link>
                    </>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Уже купил?{' '}
                  <Link href={`/p/${slug}/view`} className="underline underline-offset-4 hover:text-foreground">
                    Ввести лицензионный ключ →
                  </Link>
                </p>
              </>
            )}
          </div>

          {/* Upsell */}
          {!isMember && (
            <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="font-medium mb-2">Хочешь больше?</p>
              <p className="text-sm text-muted-foreground mb-4">
                В сообществе: все курсы, живые сессии и Telegram-чат практиков.
                {product.membership_included ? ' Плюс этот продукт уже включён.' : ''}
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/join">Вступить за $50/мес</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      {isAdmin && (
        <AdminEditBar
          label={`Редактировать продукт: ${product.title}`}
          href={`/admin/products/${product.id}`}
        />
      )}
    </>
  )
}
