import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

interface StreamRow {
  id: string
  title: string
  recorded_at: string | null
  published: boolean
}

export default async function AdminStreamsPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_streams')
    .select('id, title, recorded_at, published')
    .order('sort_order')
  const streams: StreamRow[] = data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Эфиры</h1>
        <Button asChild size="sm">
          <Link href="/admin/streams/new">+ Новый эфир</Link>
        </Button>
      </div>

      {streams.length === 0 ? (
        <p className="text-muted-foreground">Пока нет эфиров.</p>
      ) : (
        <div className="space-y-2">
          {streams.map(s => (
            <Link
              key={s.id}
              href={`/admin/streams/${s.id}`}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <span className="flex-1 font-medium text-sm truncate">{s.title}</span>
              {s.recorded_at && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(s.recorded_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
              <span className={`w-2 h-2 rounded-full shrink-0 ${s.published ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
