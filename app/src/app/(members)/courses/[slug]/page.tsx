import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Course, CourseModule, Lesson, LessonProgress } from '@/types/course'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_courses')
    .select('title, description')
    .eq('slug', slug)
    .single()
  if (!data) return {}
  return { title: data.title, description: data.description }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const session = await getSession()

  // Require membership
  if (!session) redirect('/login')
  const isMember = session.role === 'member' || session.role === 'admin'
  if (!isMember) redirect('/join')

  const supabase = createServiceClient()

  // Fetch course
  const { data: course } = await supabase
    .from('comm_courses')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!course) notFound()

  // Fetch modules + lessons
  const { data: modules } = await supabase
    .from('comm_course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })

  const moduleIds = (modules ?? []).map((m: CourseModule) => m.id)

  let lessons: Lesson[] = []
  if (moduleIds.length > 0) {
    const { data } = await supabase
      .from('comm_lessons')
      .select('*')
      .in('module_id', moduleIds)
      .eq('published', true)
      .order('sort_order', { ascending: true })
    lessons = data ?? []
  }

  // Fetch progress
  let progress: LessonProgress[] = []
  const { data: progressData } = await supabase
    .from('comm_lesson_progress')
    .select('lesson_id, completed')
    .eq('telegram_id', session.telegramId)
  progress = progressData ?? []

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id))
  const totalLessons = lessons.length
  const completedCount = lessons.filter(l => completedIds.has(l.id)).length

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Course header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground -ml-2">
                <Link href="/courses">← Все курсы</Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-3">{(course as Course).title}</h1>
            {(course as Course).description && (
              <p className="text-muted-foreground">{(course as Course).description}</p>
            )}

            {/* Progress bar */}
            {totalLessons > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Прогресс</span>
                  <span>{completedCount} / {totalLessons} уроков</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: totalLessons > 0 ? `${(completedCount / totalLessons) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modules & lessons */}
          {(modules ?? []).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg mb-2">Уроки скоро появятся</p>
              <p className="text-sm">Контент добавляется каждую неделю</p>
            </div>
          ) : (
            <div className="space-y-8">
              {(modules as CourseModule[]).map(module => {
                const moduleLessons = lessons.filter(l => l.module_id === module.id)
                return (
                  <section key={module.id}>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      {module.title}
                    </h2>
                    <div className="space-y-2">
                      {moduleLessons.map(lesson => (
                        <LessonRow
                          key={lesson.id}
                          lesson={lesson}
                          courseSlug={slug}
                          completed={completedIds.has(lesson.id)}
                        />
                      ))}
                      {moduleLessons.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2 px-4">
                          Уроки готовятся...
                        </p>
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function LessonRow({
  lesson,
  courseSlug,
  completed,
}: {
  lesson: Lesson
  courseSlug: string
  completed: boolean
}) {
  const durationStr = lesson.duration
    ? `${Math.floor(lesson.duration / 60)} мин`
    : null

  return (
    <Link
      href={`/courses/${courseSlug}/${lesson.slug}`}
      className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 transition-colors group"
    >
      {/* Completion indicator */}
      <div
        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
          completed
            ? 'border-primary bg-primary'
            : 'border-border group-hover:border-primary/50'
        }`}
      >
        {completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className={`text-sm ${completed ? 'text-muted-foreground' : ''}`}>
          {lesson.title}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {lesson.youtube_id && (
          <Badge variant="secondary" className="text-xs">Видео</Badge>
        )}
        {durationStr && (
          <span className="text-xs text-muted-foreground">{durationStr}</span>
        )}
        <span className="text-muted-foreground text-sm">→</span>
      </div>
    </Link>
  )
}
