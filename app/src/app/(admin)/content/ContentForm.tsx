'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RichEditor } from '@/components/admin/RichEditor'
import { FileUploader, AttachedFile } from '@/components/admin/FileUploader'
import { TOOL_META, TYPE_LABELS } from '@/types/content'

const TOOLS = Object.entries(TOOL_META).map(([value, meta]) => ({ value, label: meta.label }))
const TYPES = Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))

interface ContentItem {
  id: string
  slug: string
  title: string
  description: string | null
  type: string
  tool: string
  content_body: string | null
  content_url: string | null
  download_url: string | null
  attachments: AttachedFile[]
  is_premium: boolean
  published: boolean
  sort_order: number
}

interface ContentFormProps {
  item?: ContentItem
}

export function ContentForm({ item }: ContentFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(item?.title ?? '')
  const [slug, setSlug] = useState(item?.slug ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [type, setType] = useState(item?.type ?? 'prompt')
  const [tool, setTool] = useState(item?.tool ?? 'n8n')
  const [contentBody, setContentBody] = useState(item?.content_body ?? '')
  const [contentUrl, setContentUrl] = useState(item?.content_url ?? '')
  const [downloadUrl, setDownloadUrl] = useState(item?.download_url ?? '')
  const [attachments, setAttachments] = useState<AttachedFile[]>(item?.attachments ?? [])
  const [isPremium, setIsPremium] = useState(item?.is_premium ?? true)
  const [published, setPublished] = useState(item?.published ?? false)
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0)

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSave() {
    if (!title.trim()) { setError('Укажите название'); return }
    if (!slug.trim()) { setError('Укажите slug'); return }

    setSaving(true)
    setError(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      type,
      tool,
      content_body: contentBody || null,
      content_url: contentUrl.trim() || null,
      download_url: downloadUrl.trim() || null,
      attachments,
      is_premium: isPremium,
      published,
      sort_order: sortOrder,
    }

    const url = item ? `/api/admin/content/${item.id}` : '/api/admin/content'
    const method = item ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/content')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Ошибка сохранения')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!item) return
    if (!confirm('Удалить материал?')) return
    await fetch(`/api/admin/content/${item.id}`, { method: 'DELETE' })
    router.push('/admin/content')
    router.refresh()
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{item ? 'Редактировать материал' : 'Новый материал'}</h1>
        <div className="flex gap-2">
          {item && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>Удалить</Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Сохраняю...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>}

      <div className="space-y-6">
        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Название</label>
            <input
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                if (!item) setSlug(autoSlug(e.target.value))
              }}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Название материала"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              placeholder="my-material-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Порядок сортировки</label>
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Инструмент</label>
            <select
              value={tool}
              onChange={e => setTool(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {TOOLS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Тип</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5">Описание (краткое)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              placeholder="Одна-две строки о чём материал"
            />
          </div>
        </div>

        {/* Rich content */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Контент</label>
          <RichEditor
            content={contentBody}
            onChange={setContentBody}
            placeholder="Текст материала, промпт, инструкция..."
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Ссылка на контент (content_url)</label>
            <input
              value={contentUrl}
              onChange={e => setContentUrl(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Ссылка для скачивания (download_url)</label>
            <input
              value={downloadUrl}
              onChange={e => setDownloadUrl(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* File attachments */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Прикреплённые файлы</label>
          <FileUploader files={attachments} onChange={setAttachments} />
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm">Premium (только для участников)</span>
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
