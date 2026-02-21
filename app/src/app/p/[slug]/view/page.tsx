import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { LicenseKeyForm } from '@/components/products/LicenseKeyForm'

export const metadata: Metadata = { title: 'Ваш продукт' }

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = createServiceClient()
  const { data: product } = await supabase
    .from('comm_products')
    .select('id, slug, title, content_html, lemon_squeezy_product_id, membership_included, lemon_squeezy_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!product) notFound()

  // Check member access
  const session = await getSession()
  const isMember = session?.role === 'member' || session?.role === 'admin'
  const memberAccess = isMember && product.membership_included

  // Check license key cookie
  const cookieStore = await cookies()
  const cookieKey = cookieStore.get(`ls_access_${slug}`)?.value
  const cookieAccess = Boolean(cookieKey)

  const hasAccess = memberAccess || cookieAccess

  if (!hasAccess) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-xl px-4">
            <div className="text-center mb-4">
              <Link href={`/p/${slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← {product.title}
              </Link>
            </div>
            <LicenseKeyForm slug={slug} />
            <div className="mt-6 text-center">
              <Button asChild variant="outline" size="sm">
                <a href={product.lemon_squeezy_url} target="_blank" rel="noopener noreferrer">
                  Купить продукт →
                </a>
              </Button>
            </div>
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
