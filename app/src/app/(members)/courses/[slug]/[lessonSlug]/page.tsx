import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { LessonCompleteButton } from '@/components/content/LessonCompleteButton'
import { AdminEditBar } from '@/components/admin/AdminEditBar'
import Link from 'next/link'
import type { CourseModule, Lesson } from '@/types/course'
import { CodeCopyButton } from '@/components/content/CodeCopyButton'

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonSlug } = await params
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_lessons')
    .select('title')
    .eq('slug', lessonSlug)
    .single()
  return { title: data?.title ?? 'Урок' }
}

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params
  const user = await getUnifiedUser()

  if (!user) redirect('/login')
  const isMember = user.role === 'member' || user.role === 'admin'

  const supabase = createServiceClient()

  // Get course
  const { data: course } = await supabase
    .from('comm_courses')
    .select('id, title, slug, is_premium')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (!course) notFound()

  // Premium courses require membership; free courses are open to all logged-in users
  if (course.is_premium && !isMember) redirect('/join')

  // Get lesson via module
  const { data: modules } = await supabase
    .from('comm_course_modules')
    .select('id, title, sort_order')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })

  const moduleIds = (modules ?? []).map((m: CourseModule) => m.id)

  let lesson: Lesson | null = null
  if (moduleIds.length > 0) {
    const { data } = await supabase
      .from('comm_lessons')
      .select('*')
      .eq('slug', lessonSlug)
      .in('module_id', moduleIds)
      .eq('published', true)
      .single()
    lesson = data
  }
  if (!lesson) notFound()

  // Get all lessons for prev/next navigation
  const { data: allLessons } = await supabase
    .from('comm_lessons')
    .select('id, slug, title, module_id, sort_order')
    .in('module_id', moduleIds)
    .eq('published', true)
    .order('sort_order', { ascending: true })

  const lessons: Lesson[] = allLessons ?? []
  const currentIdx = lessons.findIndex(l => l.id === lesson!.id)
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null

  // Check completion (only if Telegram identity available)
  const { data: progress } = user.telegramId ? await supabase
    .from('comm_lesson_progress')
    .select('completed')
    .eq('telegram_id', user.telegramId)
    .eq('lesson_id', lesson.id)
    .single() : { data: null }

  const isCompleted = progress?.completed ?? false

  const isAdmin = user.role === 'admin'

  return (
    <>
      <Header />
      <main className={`pt-24 ${isAdmin ? 'pb-32' : 'pb-20'}`}>
        <div className="mx-auto max-w-3xl px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Link href="/courses" className="hover:text-foreground transition-colors">Курсы</Link>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-muted-foreground/40 shrink-0">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Link href={`/courses/${slug}`} className="hover:text-foreground transition-colors truncate max-w-[200px]">
              {course.title}
            </Link>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-muted-foreground/40 shrink-0">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-foreground truncate">{lesson.title}</span>
          </nav>

          {/* Lesson title */}
          <h1 className="text-3xl font-bold mb-8 leading-tight">{lesson.title}</h1>

          {/* Video (YouTube or Loom) */}
          {lesson.youtube_id && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm mb-10">
              <iframe
                src={`https://www.youtube.com/embed/${lesson.youtube_id}`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}
          {lesson.loom_id && !lesson.youtube_id && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm mb-10">
              <iframe
                src={`https://www.loom.com/embed/${lesson.loom_id}`}
                title={lesson.title}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/* File attachments */}
          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="mb-10 rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border/40">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
                  <svg className="text-primary" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5l-4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold">Материалы к уроку</h3>
                <span className="text-xs text-muted-foreground/50 ml-auto">{lesson.attachments.length} {lesson.attachments.length === 1 ? 'файл' : 'файла'}</span>
              </div>
              <div className="space-y-0.5">
                {lesson.attachments.map(f => (
                  <a
                    key={f.url}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:bg-primary/5 transition-colors"
                  >
                    <svg className="shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="group-hover:text-foreground transition-colors">{f.name}</span>
                    <span className="text-[11px] text-muted-foreground/40 ml-auto shrink-0">
                      {f.size < 1024 * 1024 ? `${(f.size / 1024).toFixed(0)} KB` : `${(f.size / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Lesson content */}
          {lesson.content && (
            <div id="lesson-content" className="prose prose-invert prose-base max-w-none mb-10">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              <CodeCopyButton containerId="lesson-content" />
            </div>
          )}

          {/* Complete + Navigation */}
          <div className="border-t border-border/60 pt-8 mt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <LessonCompleteButton
                lessonId={lesson.id}
                telegramId={user.telegramId}
                isCompleted={isCompleted}
              />

              <div className="flex items-center gap-2.5">
                {prevLesson && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/courses/${slug}/${prevLesson.slug}`} className="gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Пред.
                    </Link>
                  </Button>
                )}
                {nextLesson ? (
                  <Button asChild size="sm">
                    <Link href={`/courses/${slug}/${nextLesson.slug}`} className="gap-1.5">
                      След.
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/courses/${slug}`}>К курсу</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {isAdmin && (
        <AdminEditBar
          label={`Редактировать урок: ${lesson.title}`}
          href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
        />
      )}
    </>
  )
}
