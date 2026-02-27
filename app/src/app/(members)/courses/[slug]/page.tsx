import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LessonCheckbox } from '@/components/content/LessonCheckbox'
import { AdminEditBar } from '@/components/admin/AdminEditBar'
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
  const user = await getUnifiedUser()

  if (!user) redirect('/login')
  const isMember = user.role === 'member' || user.role === 'admin'

  const supabase = createServiceClient()

  // Fetch course
  const { data: course } = await supabase
    .from('comm_courses')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!course) notFound()

  // Fetch modules + lessons (all logged-in users can see the structure)
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

  // Fetch progress (only if Telegram identity available)
  let progress: LessonProgress[] = []
  if (user.telegramId) {
    const { data: progressData } = await supabase
      .from('comm_lesson_progress')
      .select('lesson_id, completed')
      .eq('telegram_id', user.telegramId)
    progress = progressData ?? []
  }

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id))

  // For progress bar: count only accessible lessons
  const accessibleLessons = lessons.filter(l => isMember || !(course as Course).is_premium || l.is_free)
  const totalLessons = accessibleLessons.length
  const completedCount = accessibleLessons.filter(l => completedIds.has(l.id)).length

  const isAdmin = user.role === 'admin'
  const isPremiumCourse = (course as Course).is_premium

  return (
    <>
      <Header />
      <main className={`pt-24 ${isAdmin ? 'pb-32' : 'pb-20'}`}>
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

            {/* Progress bar (only for members or free courses) */}
            {(isMember || !isPremiumCourse) && totalLessons > 0 && (
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
                      {moduleLessons.map(lesson => {
                        const isLocked = isPremiumCourse && !isMember && !lesson.is_free
                        return (
                          <LessonRow
                            key={lesson.id}
                            lesson={lesson}
                            courseSlug={slug}
                            completed={completedIds.has(lesson.id)}
                            isLocked={isLocked}
                          />
                        )
                      })}
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

          {/* CTA for non-members on premium courses */}
          {isPremiumCourse && !isMember && (
            <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Полный доступ к курсу</p>
              <p className="font-semibold mb-4">Откройте все уроки, вступив в комьюнити</p>
              <Button asChild>
                <Link href="/join">Вступить в клуб</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      {isAdmin && (
        <AdminEditBar
          label={`Редактировать курс: ${(course as Course).title}`}
          href={`/admin/courses/${course.id}`}
        />
      )}
    </>
  )
}

function LessonRow({
  lesson,
  courseSlug,
  completed,
  isLocked,
}: {
  lesson: Lesson
  courseSlug: string
  completed: boolean
  isLocked: boolean
}) {
  const durationStr = lesson.duration
    ? `${Math.floor(lesson.duration / 60)} мин`
    : null

  if (isLocked) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3 opacity-60">
        <svg className="shrink-0 text-muted-foreground/50" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span className="text-sm text-muted-foreground flex-1 min-w-0">{lesson.title}</span>
        <div className="flex items-center gap-3 shrink-0">
          {durationStr && (
            <span className="text-xs text-muted-foreground/60">{durationStr}</span>
          )}
          <Badge variant="outline" className="text-xs border-muted-foreground/20 text-muted-foreground/60">
            Участникам
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 transition-colors group">
      {/* Clickable completion checkbox */}
      <LessonCheckbox lessonId={lesson.id} isCompleted={completed} />

      {/* Row link */}
      <Link
        href={`/courses/${courseSlug}/${lesson.slug}`}
        className="flex-1 flex items-center gap-3 min-w-0"
      >
        <span className={`text-sm flex-1 min-w-0 ${completed ? 'text-muted-foreground' : ''}`}>
          {lesson.title}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          {lesson.is_free && (
            <Badge variant="secondary" className="text-xs">Бесплатно</Badge>
          )}
          {lesson.youtube_id && (
            <Badge variant="secondary" className="text-xs">Видео</Badge>
          )}
          {durationStr && (
            <span className="text-xs text-muted-foreground">{durationStr}</span>
          )}
          <span className="text-muted-foreground text-sm">→</span>
        </div>
      </Link>
    </div>
  )
}
