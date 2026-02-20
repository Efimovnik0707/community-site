import { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Course } from '@/types/course'

export const metadata: Metadata = {
  title: 'Курсы',
  description: 'AI-курсы по автоматизации, ChatGPT, N8N и вайбкодингу',
}

const COMING_SOON = [
  { title: 'Claude Code + Вайбкодинг', description: 'Разработка с AI-ассистентом: от идеи до рабочего продукта.' },
  { title: 'Lovable', description: 'No-code разработка с AI: создаём приложения без написания кода.' },
  { title: 'Агентные системы для бизнеса', description: 'Проектирование многоагентных систем для реальных задач.' },
  { title: 'Продвижение и продажи', description: 'AI-инструменты для маркетинга, лидогенерации и продаж.' },
]

// Static fallback when DB has no courses yet
const STATIC_COURSES = [
  { num: 1, title: 'N8N автоматизации', description: 'Строим рабочие автоматизации с нуля — триггеры, API, AI-агенты.', slug: 'n8n' },
  { num: 2, title: 'ChatGPT с нуля', description: 'Практический курс по работе с ChatGPT для задач бизнеса и маркетинга.', slug: 'chatgpt' },
]

export default async function CoursesPage() {
  const session = await getSession()
  const isMember = session?.role === 'member' || session?.role === 'admin'

  const supabase = createServiceClient()
  const { data: courses } = await supabase
    .from('comm_courses')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  const publishedCourses: Course[] = courses ?? []
  const useStatic = publishedCourses.length === 0

  // All rows combined for consistent numbering
  const availableRows = useStatic
    ? STATIC_COURSES
    : publishedCourses.map((c, i) => ({ num: i + 1, title: c.title, description: c.description ?? '', slug: c.slug }))

  const comingSoonRows = COMING_SOON.map((c, i) => ({
    num: availableRows.length + i + 1,
    title: c.title,
    description: c.description,
  }))

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Курсы</h1>
            <p className="text-muted-foreground">
              Структурированные программы — от основ до продвинутой автоматизации
            </p>
          </div>

          {!isMember && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-sm">Доступ к курсам — для участников комьюнити</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Оформи членство, чтобы начать обучение
                </p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/join">Вступить — $50/мес</Link>
              </Button>
            </div>
          )}

          {/* All courses in one list */}
          <div className="space-y-3">
            {availableRows.map(course => (
              <CourseRow
                key={course.num}
                num={course.num}
                title={course.title}
                description={course.description}
                slug={course.slug}
                available
                accessible={isMember}
              />
            ))}
            {comingSoonRows.map(course => (
              <CourseRow
                key={course.num}
                num={course.num}
                title={course.title}
                description={course.description}
                available={false}
                accessible={false}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

function CourseRow({
  num,
  title,
  description,
  slug,
  available,
  accessible,
}: {
  num: number
  title: string
  description: string | null
  slug?: string
  available: boolean
  accessible: boolean
}) {
  const content = (
    <div
      className={`flex items-start gap-5 rounded-xl border p-5 transition-colors ${
        available && accessible
          ? 'border-border bg-card hover:border-primary/30 cursor-pointer card-hover'
          : available && !accessible
          ? 'border-border bg-card'
          : 'border-border/40 bg-card/40 opacity-60'
      }`}
    >
      <span className="text-2xl font-bold text-accent-brand shrink-0 w-7 pt-0.5">{num}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h2 className="font-semibold text-sm">{title}</h2>
          {!available && (
            <Badge variant="secondary" className="text-xs">Скоро</Badge>
          )}
          {available && !accessible && (
            <Badge variant="secondary" className="text-xs">Членам</Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {available && accessible && (
        <span className="text-muted-foreground text-sm shrink-0">→</span>
      )}
      {available && !accessible && (
        <span className="text-muted-foreground text-sm shrink-0">🔒</span>
      )}
    </div>
  )

  if (available && accessible && slug) {
    return <Link href={`/courses/${slug}`}>{content}</Link>
  }
  return content
}
