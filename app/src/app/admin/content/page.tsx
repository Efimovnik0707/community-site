import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TOOL_META, TYPE_LABELS } from '@/types/content'

interface ContentRow {
  id: string
  title: string
  tool: string
  type: string
  is_premium: boolean
  published: boolean
}

export default async function AdminContentPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_content_items')
    .select('id, title, tool, type, is_premium, published')
    .order('tool')
    .order('sort_order')

  const items: ContentRow[] = data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Материалы</h1>
        <Button asChild size="sm">
          <Link href="/admin/content/new">+ Новый материал</Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Пока нет материалов.</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <Link
              key={item.id}
              href={`/admin/content/${item.id}`}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <span className="text-xs text-muted-foreground w-20 shrink-0">
                {TOOL_META[item.tool as keyof typeof TOOL_META]?.label ?? item.tool}
              </span>
              <span className="flex-1 font-medium text-sm truncate">{item.title}</span>
              <Badge variant="outline" className="text-xs shrink-0">
                {TYPE_LABELS[item.type as keyof typeof TYPE_LABELS] ?? item.type}
              </Badge>
              {item.is_premium && (
                <Badge className="text-xs shrink-0 bg-primary/10 text-primary border-primary/20">Premium</Badge>
              )}
              <span className={`w-2 h-2 rounded-full shrink-0 ${item.published ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
