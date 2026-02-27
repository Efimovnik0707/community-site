'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RichEditor } from '@/components/admin/RichEditor'
import { FileUploader, AttachedFile } from '@/components/admin/FileUploader'

interface Lesson {
  id: string
  module_id: string
  slug: string
  title: string
  youtube_id: string | null
  loom_id: string | null
  content: string | null
  duration: number | null
  sort_order: number
  published: boolean
  is_free: boolean
  attachments: AttachedFile[]
}

interface LessonFormProps {
  courseId: string
  moduleId?: string
  lesson?: Lesson
}

function parseVideoUrl(input: string): { youtube_id: string | null; loom_id: string | null } {
  const yt = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return { youtube_id: yt[1], loom_id: null }
  const loom = input.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loom) return { youtube_id: null, loom_id: loom[1] }
  return { youtube_id: null, loom_id: null }
}

function videoToUrl(lesson: Lesson): string {
  if (lesson.youtube_id) return `https://www.youtube.com/watch?v=${lesson.youtube_id}`
  if (lesson.loom_id) return `https://www.loom.com/share/${lesson.loom_id}`
  return ''
}

export function LessonForm({ courseId, moduleId, lesson }: LessonFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(lesson?.title ?? '')
  const [slug, setSlug] = useState(lesson?.slug ?? '')
  const [videoUrl, setVideoUrl] = useState(lesson ? videoToUrl(lesson) : '')
  const [content, setContent] = useState(lesson?.content ?? '')
  const [duration, setDuration] = useState(lesson?.duration ? Math.floor(lesson.duration / 60).toString() : '')
  const [attachments, setAttachments] = useState<AttachedFile[]>(lesson?.attachments ?? [])
  const [published, setPublished] = useState(lesson?.published ?? false)
  const [isFree, setIsFree] = useState(lesson?.is_free ?? false)
  const [sortOrder, setSortOrder] = useState(lesson?.sort_order ?? 0)

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) { setError('Укажите название и slug'); return }
    setSaving(true)
    setError(null)

    const { youtube_id, loom_id } = parseVideoUrl(videoUrl.trim())
    const payload = {
      module_id: lesson?.module_id ?? moduleId,
      title: title.trim(),
      slug: slug.trim(),
      youtube_id,
      loom_id,
      content: content || null,
      duration: duration ? Number(duration) * 60 : null,
      attachments,
      published,
      is_free: isFree,
      sort_order: sortOrder,
    }

    const url = lesson ? `/api/admin/lessons/${lesson.id}` : '/api/admin/lessons'
    const method = lesson ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push(`/admin/courses/${courseId}`)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Ошибка')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!lesson) return
    if (!confirm('Удалить урок?')) return
    await fetch(`/api/admin/lessons/${lesson.id}`, { method: 'DELETE' })
    router.push(`/admin/courses/${courseId}`)
    router.refresh()
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{lesson ? 'Редактировать урок' : 'Новый урок'}</h1>
        <div className="flex gap-2">
          {lesson && <Button variant="destructive" size="sm" onClick={handleDelete}>Удалить</Button>}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Сохраняю...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Название урока</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); if (!lesson) setSlug(autoSlug(e.target.value)) }}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Название урока"
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
            <label className="block text-sm font-medium mb-1.5">Длительность (минут)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="30"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Видео (YouTube или Loom)</label>
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="https://youtube.com/watch?v=... или https://loom.com/share/..."
            />
            {videoUrl && (() => {
              const { youtube_id, loom_id } = parseVideoUrl(videoUrl.trim())
              if (youtube_id) return <p className="mt-1 text-xs text-green-500">✓ YouTube: {youtube_id}</p>
              if (loom_id) return <p className="mt-1 text-xs text-green-500">✓ Loom: {loom_id}</p>
              return <p className="mt-1 text-xs text-destructive">Не распознан URL</p>
            })()}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Контент урока</label>
          <RichEditor
            content={content}
            onChange={setContent}
            placeholder="Описание, текстовые материалы, промпты..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Файлы для скачивания</label>
          <p className="text-xs text-muted-foreground mb-3">Студент увидит список файлов под видео урока</p>
          <FileUploader files={attachments} onChange={setAttachments} />
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Опубликовать</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Бесплатный урок</span>
          </label>
        </div>
        {isFree && (
          <p className="text-xs text-muted-foreground -mt-2">
            Этот урок будет виден всем (даже в платном курсе)
          </p>
        )}
      </div>
    </div>
  )
}
