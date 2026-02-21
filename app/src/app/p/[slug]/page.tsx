import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase.from('comm_products').select('title, tagline').eq('slug', slug).eq('published', true).single()
  if (!data) return { title: 'Продукт не найден' }
  return { title: data.title, description: data.tagline ?? undefined }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('comm_products')
    .select('id, slug, title, tagline, description_html, price_display, lemon_squeezy_url, membership_included')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!product) notFound()

  const session = await getSession()
  const isMember = session?.role === 'member' || session?.role === 'admin'
  const hasAccess = isMember && product.membership_included

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-2xl px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Продукт</Badge>
            <h1 className="text-3xl font-bold md:text-4xl mb-4">{product.title}</h1>
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
                <p className="text-sm text-muted-foreground">Как участник комьюнити, у тебя есть доступ к этому продукту</p>
                <Button asChild size="lg" className="text-base font-semibold px-10">
                  <Link href={`/p/${slug}/view`}>Открыть продукт</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-bold">{product.price_display}</span>
                  <span className="text-muted-foreground">— разовая оплата</span>
                </div>
                <Button asChild size="lg" className="text-base font-semibold px-10">
                  <a href={product.lemon_squeezy_url} target="_blank" rel="noopener noreferrer">
                    Купить сейчас
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Оплата через Lemon Squeezy · Карта, PayPal, Apple Pay
                  {product.membership_included && (
                    <> · Входит в{' '}
                      <Link href="/join" className="underline underline-offset-4 hover:text-foreground">membership</Link>
                    </>
                  )}
                </p>
              </>
            )}
          </div>

          {/* Upsell */}
          {!isMember && (
            <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="font-medium mb-1">Хочешь больше?</p>
              <p className="text-sm text-muted-foreground mb-4">
                В комьюнити — все курсы, живые эфиры и разборы. Плюс этот продукт{product.membership_included ? ' — бесплатно' : ' в скидку не входит'}.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/join">Вступить в сообщество — $50/мес</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
