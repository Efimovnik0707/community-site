'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RichEditor } from '@/components/admin/RichEditor'

interface Stream {
  id: string
  slug: string
  title: string
  description: string | null
  youtube_id: string | null
  recorded_at: string | null
  is_premium: boolean
  published: boolean
  sort_order: number
}

function parseVideoUrl(input: string): { youtube_id?: string; loom_id?: string } {
  const yt = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return { youtube_id: yt[1] }
  const loom = input.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loom) return { loom_id: loom[1] }
  return {}
}

interface StreamFormProps {
  stream?: Stream
}

export function StreamForm({ stream }: StreamFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(stream?.title ?? '')
  const [slug, setSlug] = useState(stream?.slug ?? '')
  const [description, setDescription] = useState(stream?.description ?? '')
  const [videoUrl, setVideoUrl] = useState(
    stream?.youtube_id ? `https://www.youtube.com/watch?v=${stream.youtube_id}` : ''
  )
  const [recordedAt, setRecordedAt] = useState(
    stream?.recorded_at ? stream.recorded_at.slice(0, 10) : ''
  )
  const [isPremium, setIsPremium] = useState(stream?.is_premium ?? true)
  const [published, setPublished] = useState(stream?.published ?? false)
  const [sortOrder, setSortOrder] = useState(stream?.sort_order ?? 0)

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSave() {
    if (!title.trim()) { setError('Укажите название'); return }
    if (!slug.trim()) { setError('Укажите slug'); return }

    setSaving(true)
    setError(null)

    const video = parseVideoUrl(videoUrl.trim())
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      youtube_id: video.youtube_id ?? null,
      recorded_at: recordedAt || null,
      is_premium: isPremium,
      published,
      sort_order: sortOrder,
    }

    const url = stream ? `/api/admin/streams/${stream.id}` : '/api/admin/streams'
    const method = stream ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/streams')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Ошибка сохранения')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!stream) return
    if (!confirm('Удалить эфир?')) return
    await fetch(`/api/admin/streams/${stream.id}`, { method: 'DELETE' })
    router.push('/admin/streams')
    router.refresh()
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{stream ? 'Редактировать эфир' : 'Новый эфир'}</h1>
        <div className="flex gap-2">
          {stream && <Button variant="destructive" size="sm" onClick={handleDelete}>Удалить</Button>}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Сохраняю...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Название</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); if (!stream) setSlug(autoSlug(e.target.value)) }}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Название эфира"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Дата эфира</label>
            <input
              type="date"
              value={recordedAt}
              onChange={e => setRecordedAt(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Видео (YouTube или Loom URL)</label>
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="https://youtube.com/watch?v=... или https://loom.com/share/..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Описание</label>
          <RichEditor
            content={description}
            onChange={setDescription}
            placeholder="Описание эфира..."
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Premium</span>
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
