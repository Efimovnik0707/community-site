'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface CourseFormProps {
  course?: { id: string; slug: string; title: string; description: string | null; is_premium: boolean; published: boolean; sort_order: number; status: string }
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(course?.title ?? '')
  const [slug, setSlug] = useState(course?.slug ?? '')
  const [description, setDescription] = useState(course?.description ?? '')
  const [isPremium, setIsPremium] = useState(course?.is_premium ?? true)
  const [published, setPublished] = useState(course?.published ?? false)
  const [sortOrder, setSortOrder] = useState(course?.sort_order ?? 0)
  const [status, setStatus] = useState<'active' | 'coming_soon'>(
    (course?.status as 'active' | 'coming_soon') ?? 'active'
  )

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) { setError('Укажите название и slug'); return }
    setSaving(true)
    const payload = { title: title.trim(), slug: slug.trim(), description: description.trim() || null, is_premium: isPremium, published, sort_order: sortOrder, status }
    const url = course ? `/api/admin/courses/${course.id}` : '/api/admin/courses'
    const res = await fetch(url, { method: course ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      const data = await res.json()
      router.push(`/admin/courses/${data.id}`)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Ошибка')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{course ? 'Настройки курса' : 'Новый курс'}</h1>
        <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? 'Сохраняю...' : 'Сохранить'}</Button>
      </div>
      {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Название</label>
          <input value={title} onChange={e => { setTitle(e.target.value); if (!course) setSlug(autoSlug(e.target.value)) }}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Описание</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Порядок (sort order)</label>
          <input
            type="number"
            value={sortOrder}
            onChange={e => setSortOrder(Number(e.target.value))}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-muted-foreground">Меньшее число = выше в списке</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Статус</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as 'active' | 'coming_soon')}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="active">Активный (доступен)</option>
            <option value="coming_soon">Скоро (заглушка)</option>
          </select>
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
