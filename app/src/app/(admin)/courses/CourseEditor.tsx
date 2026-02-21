'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Lesson {
  id: string
  title: string
  slug: string
  sort_order: number
  published: boolean
  youtube_id: string | null
  loom_id: string | null
  duration: number | null
}

interface Module {
  id: string
  title: string
  sort_order: number
  comm_lessons: Lesson[]
}

interface Course {
  id: string
  slug: string
  title: string
  description: string | null
  is_premium: boolean
  published: boolean
  sort_order: number
  comm_course_modules: Module[]
}

interface CourseEditorProps {
  course: Course
}

function formatDuration(s: number | null) {
  if (!s) return ''
  const m = Math.floor(s / 60)
  return `${m} мин`
}

export function CourseEditor({ course }: CourseEditorProps) {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>(
    [...course.comm_course_modules].sort((a, b) => a.sort_order - b.sort_order)
  )
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(modules.map(m => m.id)))

  async function addModule() {
    if (!newModuleTitle.trim()) return
    setAddingModule(true)
    const res = await fetch('/api/admin/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: course.id, title: newModuleTitle.trim(), sort_order: modules.length }),
    })
    if (res.ok) {
      const data = await res.json()
      setModules(prev => [...prev, { ...data, comm_lessons: [] }])
      setNewModuleTitle('')
      setExpandedModules(prev => new Set([...prev, data.id]))
    }
    setAddingModule(false)
  }

  async function deleteModule(moduleId: string) {
    if (!confirm('Удалить модуль со всеми уроками?')) return
    await fetch(`/api/admin/modules/${moduleId}`, { method: 'DELETE' })
    setModules(prev => prev.filter(m => m.id !== moduleId))
  }

  function toggleModule(moduleId: string) {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{course.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/courses/${course.id}/settings`}>Настройки</Link>
          </Button>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        {modules.map((mod, modIdx) => (
          <div key={mod.id} className="border border-border rounded-xl overflow-hidden">
            {/* Module header */}
            <div
              className="flex items-center gap-3 px-4 py-3 bg-card cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => toggleModule(mod.id)}
            >
              <span className="text-muted-foreground text-xs w-5 shrink-0">{modIdx + 1}</span>
              <span className="flex-1 font-medium text-sm">{mod.title}</span>
              <span className="text-xs text-muted-foreground shrink-0">{mod.comm_lessons.length} уроков</span>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); deleteModule(mod.id) }}
                className="text-muted-foreground hover:text-destructive text-xs shrink-0 ml-2"
              >
                ✕
              </button>
              <span className="text-muted-foreground text-xs shrink-0">{expandedModules.has(mod.id) ? '▲' : '▼'}</span>
            </div>

            {/* Lessons */}
            {expandedModules.has(mod.id) && (
              <div className="divide-y divide-border">
                {[...mod.comm_lessons].sort((a, b) => a.sort_order - b.sort_order).map((lesson, lessonIdx) => (
                  <Link
                    key={lesson.id}
                    href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent/20 transition-colors"
                  >
                    <span className="text-muted-foreground text-xs w-5 shrink-0">{lessonIdx + 1}</span>
                    <span className="flex-1 text-sm truncate">{lesson.title}</span>
                    {lesson.duration && (
                      <span className="text-xs text-muted-foreground shrink-0">{formatDuration(lesson.duration)}</span>
                    )}
                    {(lesson.youtube_id || lesson.loom_id) && (
                      <span className="text-xs text-muted-foreground shrink-0">▶</span>
                    )}
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lesson.published ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  </Link>
                ))}

                {/* Add lesson */}
                <div className="px-4 py-2.5">
                  <Link
                    href={`/admin/courses/${course.id}/lessons/new?module=${mod.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    + Добавить урок
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add module */}
        <div className="flex gap-2">
          <input
            value={newModuleTitle}
            onChange={e => setNewModuleTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addModule()}
            placeholder="Название нового модуля..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button size="sm" onClick={addModule} disabled={addingModule || !newModuleTitle.trim()}>
            Добавить
          </Button>
        </div>
      </div>
    </div>
  )
}
