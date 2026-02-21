import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import type { Stream } from '@/types/content'

export const metadata: Metadata = {
  title: 'Эфиры',
  description: 'Записи живых сессий и вайбкодинг-стримов',
}

export default async function StreamsPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  const isMember = session.role === 'member' || session.role === 'admin'
  if (!isMember) redirect('/join')

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_streams')
    .select('*')
    .eq('published', true)
    .order('recorded_at', { ascending: false })

  const streams: Stream[] = data ?? []

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Эфиры</h1>
            <p className="text-muted-foreground">Записи живых сессий и вайбкодинг-стримов</p>
          </div>

          {streams.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg mb-2">Эфиры скоро появятся</p>
              <p className="text-sm">Следи за анонсами в Telegram-канале</p>
            </div>
          ) : (
            <div className="space-y-4">
              {streams.map(stream => (
                <Link
                  key={stream.id}
                  href={`/streams/${stream.slug}`}
                  className="block rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
                >
                  {stream.youtube_id && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary mb-4">
                      <img
                        src={`https://img.youtube.com/vi/${stream.youtube_id}/hqdefault.jpg`}
                        alt={stream.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                            <path d="M6 4l12 6-12 6V4z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {stream.title}
                      </h2>
                      {stream.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {stream.description}
                        </p>
                      )}
                    </div>
                    {stream.recorded_at && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(stream.recorded_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  {stream.is_premium && (
                    <Badge className="mt-3 bg-primary/10 text-primary border-primary/20 text-xs">
                      Members
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
