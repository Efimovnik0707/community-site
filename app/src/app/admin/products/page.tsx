import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

interface ProductRow {
  id: string
  title: string
  price_display: string
  membership_included: boolean
  published: boolean
}

export default async function AdminProductsPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_products')
    .select('id, title, price_display, membership_included, published')
    .order('sort_order')
  const products: ProductRow[] = data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Продукты</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/new">+ Новый продукт</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">Пока нет продуктов.</p>
      ) : (
        <div className="space-y-2">
          {products.map(p => (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <span className="flex-1 font-medium text-sm truncate">{p.title}</span>
              <span className="text-sm font-semibold text-accent-brand shrink-0">{p.price_display}</span>
              {p.membership_included && (
                <span className="text-xs text-muted-foreground shrink-0">Members free</span>
              )}
              <span className={`w-2 h-2 rounded-full shrink-0 ${p.published ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
