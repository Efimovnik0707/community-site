import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import type { Stream } from '@/types/content'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_streams')
    .select('title, description')
    .eq('slug', slug)
    .single()
  if (!data) return {}
  return { title: data.title, description: data.description }
}

export default async function StreamPage({ params }: Props) {
  const { slug } = await params
  const user = await getUnifiedUser()
  if (!user) redirect('/login')
  const isMember = user.role === 'member' || user.role === 'admin'
  if (!isMember) redirect('/join')

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_streams')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) notFound()
  const stream = data as Stream

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <Link href="/streams" className="hover:text-foreground transition-colors">Эфиры</Link>
            <span>/</span>
            <span className="text-foreground">{stream.title}</span>
          </div>

          {/* Video */}
          {stream.youtube_id && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border mb-8">
              <iframe
                src={`https://www.youtube.com/embed/${stream.youtube_id}`}
                title={stream.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/* Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">{stream.title}</h1>
            {stream.recorded_at && (
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(stream.recorded_at).toLocaleDateString('ru-RU', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            )}
            {stream.description && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {stream.description}
              </p>
            )}
          </div>

          {/* Back */}
          <div className="pt-8 border-t border-border">
            <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
              <Link href="/streams">← Все эфиры</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
