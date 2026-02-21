import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TOOL_META, TYPE_LABELS, type ToolSlug, type ContentItem } from '@/types/content'
import { CopyButton } from '@/components/content/CopyButton'

interface Props {
  params: Promise<{ slug: string; itemSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { itemSlug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_content_items')
    .select('title, description')
    .eq('slug', itemSlug)
    .single()
  if (!data) return {}
  return { title: data.title, description: data.description }
}

export default async function ContentItemPage({ params }: Props) {
  const { slug, itemSlug } = await params
  const user = await getUnifiedUser()
  const isMember = user?.role === 'member' || user?.role === 'admin'

  const supabase = createServiceClient()
  const { data: item } = await supabase
    .from('comm_content_items')
    .select('*')
    .eq('slug', itemSlug)
    .eq('tool', slug)
    .eq('published', true)
    .single()

  if (!item) notFound()

  // Premium content requires membership
  if ((item as ContentItem).is_premium && !isMember) {
    redirect('/join')
  }

  const toolMeta = TOOL_META[slug as ToolSlug]
  const typedItem = item as ContentItem

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/tools" className="hover:text-foreground transition-colors">Инструменты</Link>
            <span>/</span>
            <Link href={`/tools/${slug}`} className="hover:text-foreground transition-colors">
              {toolMeta?.label ?? slug}
            </Link>
            <span>/</span>
            <span className="text-foreground">{typedItem.title}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="outline">{TYPE_LABELS[typedItem.type]}</Badge>
              {typedItem.is_premium && (
                <Badge className="bg-primary/10 text-primary border-primary/20">Members</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-3">{typedItem.title}</h1>
            {typedItem.description && (
              <p className="text-muted-foreground leading-relaxed">{typedItem.description}</p>
            )}
            {typedItem.tags && typedItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {typedItem.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons: external link + download */}
          {(typedItem.content_url || typedItem.download_url) && (
            <div className="flex flex-wrap gap-3 mb-8">
              {typedItem.content_url && (
                <Button asChild size="lg" className="gap-2">
                  <a href={typedItem.content_url} target="_blank" rel="noopener noreferrer">
                    Открыть ресурс →
                  </a>
                </Button>
              )}
              {typedItem.download_url && (
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <a href={typedItem.download_url} target="_blank" rel="noopener noreferrer" download>
                    ↓ Скачать
                  </a>
                </Button>
              )}
            </div>
          )}

          {/* Content body */}
          {typedItem.content_body && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Контент</span>
                <CopyButton text={typedItem.content_body} />
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground/90 overflow-x-auto">
                {typedItem.content_body}
              </pre>
            </div>
          )}

          {/* Empty state */}
          {!typedItem.content_url && !typedItem.content_body && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground mb-2">Контент скоро появится</p>
              <p className="text-sm text-muted-foreground">Мы добавляем материалы каждую неделю</p>
            </div>
          )}

          {/* Back */}
          <div className="mt-10 pt-8 border-t border-border">
            <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
              <Link href={`/tools/${slug}`}>← Назад к {toolMeta?.label ?? slug}</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

