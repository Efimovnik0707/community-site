import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { ContentCard } from '@/components/content/ContentCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TOOL_META, type ToolSlug, type ContentItem } from '@/types/content'

type AccessibleItem = ContentItem & { _accessible: boolean }
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = TOOL_META[slug as ToolSlug]
  if (!meta) return {}
  return {
    title: meta.label,
    description: meta.description,
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const meta = TOOL_META[slug as ToolSlug]

  if (!meta) notFound()

  if (meta.locked) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-3xl px-4 text-center py-20">
            <div className="text-5xl mb-6">🔒</div>
            <h1 className="text-2xl font-bold mb-3">{meta.label}</h1>
            <p className="text-muted-foreground mb-8">{meta.description}</p>
            <Button asChild variant="outline">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </main>
      </>
    )
  }

  const user = await getUnifiedUser()
  const isMember = user?.role === 'member' || user?.role === 'admin'

  // Free users: use anon client (RLS filters premium)
  // Members: use service client to get all published items
  let items: AccessibleItem[] = []

  if (isMember) {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('comm_content_items')
      .select('*')
      .eq('tool', slug)
      .eq('published', true)
      .order('sort_order', { ascending: true })
    items = (data ?? []).map((i: ContentItem) => ({ ...i, _accessible: true }))
  } else {
    const supabase = await createClient()
    const { data } = await supabase
      .from('comm_content_items')
      .select('*')
      .eq('tool', slug)
      .eq('published', true)
      .order('sort_order', { ascending: true })
    // Anon gets free items (RLS enforced). We also fetch locked items for display.
    // For locked preview, use service client separately:
    const serviceClient = createServiceClient()
    const { data: premiumData } = await serviceClient
      .from('comm_content_items')
      .select('id, slug, title, description, type, tool, is_premium, tags, sort_order, published, created_at')
      .eq('tool', slug)
      .eq('published', true)
      .eq('is_premium', true)
      .order('sort_order', { ascending: true })

    // Combine: free items (full) + premium items (metadata only, no content)
    items = [
      ...(data ?? []).map((i: ContentItem) => ({ ...i, _accessible: true })),
      ...(premiumData ?? []).map((i: ContentItem) => ({ ...i, content_url: null, content_body: null, _accessible: false })),
    ].sort((a, b) => a.sort_order - b.sort_order)
  }

  const freeItems = items.filter((i: AccessibleItem) => !i.is_premium)
  const premiumItems = items.filter((i: AccessibleItem) => i.is_premium)

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4">
          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{meta.icon}</span>
              <h1 className="text-3xl font-bold">{meta.label}</h1>
            </div>
            <p className="text-muted-foreground">{meta.description}</p>
          </div>

          {/* Free section */}
          {freeItems.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-lg font-semibold">Открытый доступ</h2>
                <Badge variant="secondary">{freeItems.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {freeItems.map(item => (
                  <ContentCard key={item.id} item={item} accessible />
                ))}
              </div>
            </section>
          )}

          {/* Premium section */}
          {premiumItems.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-lg font-semibold">Для участников</h2>
                <Badge variant="secondary">{premiumItems.length}</Badge>
                {!isMember && (
                  <Button asChild size="sm" className="ml-auto">
                    <Link href="/join">Получить доступ</Link>
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {premiumItems.map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    accessible={isMember}
                  />
                ))}
              </div>
            </section>
          )}

          {items.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-2">Контент скоро появится</p>
              <p className="text-sm">Добавляем ресурсы каждую неделю</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
