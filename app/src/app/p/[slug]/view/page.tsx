import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser, hasPurchased } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { LicenseKeyForm } from '@/components/products/LicenseKeyForm'

export const metadata: Metadata = { title: 'Ваш продукт' }

export default async function ProductViewPage({
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

  const supabase = createServiceClient()
  const baseQuery = supabase
    .from('comm_products')
    .select('id, slug, title, content_html, lemon_squeezy_product_id, membership_included, lemon_squeezy_url')
    .eq('slug', slug)

  const { data: product } = await (isPreview && isAdmin
    ? baseQuery.single()
    : baseQuery.eq('published', true).single())

  if (!product) notFound()

  // Admin preview mode: bypass all access checks
  if (isPreview && isAdmin) {
    return (
      <>
        <Header />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500/90 text-black text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          Режим превью — контент продукта
        </div>
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-2xl px-4">
            <div className="mb-8">
              <Link href={`/p/${slug}?preview=1`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
          </div>
        </main>
      </>
    )
  }

  const isMember = user?.role === 'member' || user?.role === 'admin'
  const memberAccess = isMember && product.membership_included
  const purchaseAccess = user?.supabaseUid
    ? await hasPurchased(user.supabaseUid, product.id)
    : false
  const hasAccess = memberAccess || purchaseAccess

  // Not logged in at all — redirect to login with return URL
  if (!hasAccess && !user) {
    redirect(`/login?redirect=/p/${slug}/view`)
  }

  if (!hasAccess) {
    // Telegram-only user has no supabaseUid → can't activate key, prompt to link email
    const canActivate = !!user?.supabaseUid

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
            {canActivate ? (
              <LicenseKeyForm slug={slug} />
            ) : (
              <div className="rounded-xl border border-border bg-card p-6 text-center space-y-3">
                <p className="font-medium">Активация через ключ</p>
                <p className="text-sm text-muted-foreground">
                  Для активации лицензионного ключа нужен аккаунт по email.
                  После входа аккаунты объединятся автоматически.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/login?redirect=/p/${slug}/view`}>
                    Войти через Email / Google →
                  </Link>
                </Button>
              </div>
            )}
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
