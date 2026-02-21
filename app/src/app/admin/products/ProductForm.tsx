'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RichEditor } from '@/components/admin/RichEditor'

interface Product {
  id: string
  slug: string
  title: string
  tagline: string | null
  description_html: string | null
  price_display: string
  lemon_squeezy_url: string
  lemon_squeezy_product_id: string | null
  content_html: string | null
  membership_included: boolean
  published: boolean
  sort_order: number
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(product?.title ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [tagline, setTagline] = useState(product?.tagline ?? '')
  const [descriptionHtml, setDescriptionHtml] = useState(product?.description_html ?? '')
  const [priceDisplay, setPriceDisplay] = useState(product?.price_display ?? '$5')
  const [lsUrl, setLsUrl] = useState(product?.lemon_squeezy_url ?? '')
  const [lsProductId, setLsProductId] = useState(product?.lemon_squeezy_product_id ?? '')
  const [contentHtml, setContentHtml] = useState(product?.content_html ?? '')
  const [membershipIncluded, setMembershipIncluded] = useState(product?.membership_included ?? false)
  const [published, setPublished] = useState(product?.published ?? false)
  const [sortOrder, setSortOrder] = useState(product?.sort_order ?? 0)

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) { setError('Укажите название и slug'); return }
    if (!lsUrl.trim()) { setError('Укажите ссылку Lemon Squeezy'); return }
    setSaving(true)
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      tagline: tagline.trim() || null,
      description_html: descriptionHtml || null,
      price_display: priceDisplay.trim(),
      lemon_squeezy_url: lsUrl.trim(),
      lemon_squeezy_product_id: lsProductId.trim() || null,
      content_html: contentHtml || null,
      membership_included: membershipIncluded,
      published,
      sort_order: sortOrder,
    }
    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const res = await fetch(url, { method: product ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const data = await res.json()
      router.push(`/admin/products/${data.id}`)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Ошибка')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{product ? 'Редактировать продукт' : 'Новый продукт'}</h1>
        <div className="flex items-center gap-2">
          {product?.slug && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/p/${product.slug}?preview=1`, '_blank')}
              >
                Превью лендинга
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/p/${product.slug}/view?preview=1`, '_blank')}
              >
                Превью контента
              </Button>
            </>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Сохраняю...' : 'Сохранить'}</Button>
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Название</label>
            <input value={title} onChange={e => { setTitle(e.target.value); if (!product) setSlug(autoSlug(e.target.value)) }}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input value={slug} onChange={e => setSlug(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Подзаголовок (tagline)</label>
          <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Одна строка — главный буллет под заголовком"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Цена (для отображения)</label>
            <input value={priceDisplay} onChange={e => setPriceDisplay(e.target.value)} placeholder="$5"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Порядок</label>
            <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Lemon Squeezy — ссылка на checkout</label>
          <input value={lsUrl} onChange={e => setLsUrl(e.target.value)} placeholder="https://your-store.lemonsqueezy.com/buy/..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Lemon Squeezy — Product ID (для верификации)</label>
          <input value={lsProductId} onChange={e => setLsProductId(e.target.value)} placeholder="12345"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
          <p className="mt-1 text-xs text-muted-foreground">Найди в LS: Store → Products → Product ID</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Описание продукта (лендинг)</label>
          <p className="text-xs text-muted-foreground mb-2">Показывается на странице /p/[slug] — продающий текст, список преимуществ</p>
          <RichEditor content={descriptionHtml} onChange={setDescriptionHtml} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Контент продукта (после покупки)</label>
          <p className="text-xs text-muted-foreground mb-2">Показывается на /p/[slug]/view после верификации оплаты</p>
          <RichEditor content={contentHtml} onChange={setContentHtml} />
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={membershipIncluded} onChange={e => setMembershipIncluded(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Включён в membership (members видят бесплатно)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Опубликовать</span>
          </label>
        </div>
      </div>
    </div>
  )
}
