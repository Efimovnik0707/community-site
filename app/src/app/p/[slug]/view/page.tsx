import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser, hasPurchased } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { LicenseKeyForm } from '@/components/products/LicenseKeyForm'
import { AdminEditBar } from '@/components/admin/AdminEditBar'
import { CodeCopyButton } from '@/components/content/CodeCopyButton'

export const metadata: Metadata = { title: 'Ваш продукт' }

interface AttachedFile {
  url: string
  name: string
  size: number
}

function ProductAttachments({ attachments }: { attachments: AttachedFile[] | null }) {
  if (!attachments || attachments.length === 0) return null

  return (
    <div className="mt-10 rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border/40">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
          <svg className="text-primary" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5l-4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold">Файлы продукта</h3>
        <span className="text-xs text-muted-foreground/50 ml-auto">
          {attachments.length} {attachments.length === 1 ? 'файл' : attachments.length < 5 ? 'файла' : 'файлов'}
        </span>
      </div>
      <div className="space-y-0.5">
        {attachments.map((f: AttachedFile) => (
          <a
            key={f.url}
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:bg-primary/5 transition-colors"
          >
            <svg className="shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="group-hover:text-foreground transition-colors">{f.name}</span>
            <span className="text-[11px] text-muted-foreground/40 ml-auto shrink-0">
              {f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

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
    .select('id, slug, title, content_html, attachments, lemon_squeezy_product_id, membership_included, lemon_squeezy_url, stripe_payment_link')
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
          Режим превью: контент продукта
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
              <>
                <div
                  id="product-content-preview"
                  className="prose prose-invert prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.content_html }}
                />
                <CodeCopyButton containerId="product-content-preview" />
              </>
            ) : (
              <p className="text-muted-foreground">Контент продукта скоро появится.</p>
            )}
            <ProductAttachments attachments={product.attachments} />
          </div>
        </main>
      </>
    )
  }

  const isMember = user?.role === 'member' || user?.role === 'admin'
  const memberAccess = isMember && product.membership_included
  const isFree = !product.stripe_payment_link && !product.lemon_squeezy_url
  const purchaseAccess = !isFree && user?.supabaseUid
    ? await hasPurchased(user.supabaseUid, product.id, user.email)
    : false
  const hasAccess = isFree || memberAccess || purchaseAccess

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
                <a href={product.stripe_payment_link || product.lemon_squeezy_url} target="_blank" rel="noopener noreferrer">
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
      <main className={`pt-24 ${isAdmin ? 'pb-32' : 'pb-20'}`}>
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-8">
            <Link href={`/p/${slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← {product.title}
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-8">{product.title}</h1>

          {product.content_html ? (
            <>
              <div
                id="product-content"
                className="prose prose-invert prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: product.content_html }}
              />
              <CodeCopyButton containerId="product-content" />
            </>
          ) : (
            <p className="text-muted-foreground">Контент продукта скоро появится.</p>
          )}

          <ProductAttachments attachments={product.attachments} />

          {/* Upsell блок */}
          <div className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="font-medium mb-1">Хочешь ещё больше?</p>
            <p className="text-sm text-muted-foreground mb-4">
              В комьюнити: курсы, живые эфиры, сообщество практиков и новый контент каждую неделю.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/join">Вступить в комьюнити</Link>
            </Button>
          </div>
        </div>
      </main>
      {isAdmin && (
        <AdminEditBar
          label={`Редактировать контент: ${product.title}`}
          href={`/admin/products/${product.id}`}
        />
      )}
    </>
  )
}
