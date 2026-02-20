import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { LessonCompleteButton } from '@/components/content/LessonCompleteButton'
import Link from 'next/link'
import type { CourseModule, Lesson } from '@/types/course'

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
  const session = await getSession()

  if (!session) redirect('/login')
  const isMember = session.role === 'member' || session.role === 'admin'
  if (!isMember) redirect('/join')

  const supabase = createServiceClient()

  // Get course
  const { data: course } = await supabase
    .from('comm_courses')
    .select('id, title, slug')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (!course) notFound()

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

  // Check completion
  const { data: progress } = await supabase
    .from('comm_lesson_progress')
    .select('completed')
    .eq('telegram_id', session.telegramId)
    .eq('lesson_id', lesson.id)
    .single()

  const isCompleted = progress?.completed ?? false

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/courses" className="hover:text-foreground transition-colors">Курсы</Link>
            <span>/</span>
            <Link href={`/courses/${slug}`} className="hover:text-foreground transition-colors">
              {course.title}
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{lesson.title}</span>
          </div>

          {/* Lesson title */}
          <h1 className="text-2xl font-bold mb-6">{lesson.title}</h1>

          {/* YouTube video */}
          {lesson.youtube_id && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border mb-8">
              <iframe
                src={`https://www.youtube.com/embed/${lesson.youtube_id}`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/* Lesson content */}
          {lesson.content && (
            <div className="prose prose-invert prose-sm max-w-none mb-10">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}

          {/* Complete + Navigation */}
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <LessonCompleteButton
              lessonId={lesson.id}
              telegramId={session.telegramId}
              isCompleted={isCompleted}
            />

            <div className="flex items-center gap-3">
              {prevLesson && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/courses/${slug}/${prevLesson.slug}`}>← Пред.</Link>
                </Button>
              )}
              {nextLesson ? (
                <Button asChild size="sm">
                  <Link href={`/courses/${slug}/${nextLesson.slug}`}>След. →</Link>
                </Button>
              ) : (
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/courses/${slug}`}>К курсу</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
