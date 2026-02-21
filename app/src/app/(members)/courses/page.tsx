import { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Course } from '@/types/course'

export const metadata: Metadata = {
  title: 'Курсы',
  description: 'AI-курсы по автоматизации, ChatGPT, N8N и вайбкодингу',
}

export default async function CoursesPage() {
  const user = await getUnifiedUser()
  const isMember = user?.role === 'member' || user?.role === 'admin'

  const supabase = createServiceClient()
  const { data: courses } = await supabase
    .from('comm_courses')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  const allCourses: Course[] = courses ?? []

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

          <div className="space-y-3">
            {allCourses.map((course, i) => (
              <CourseRow
                key={course.id}
                num={i + 1}
                title={course.title}
                description={course.description}
                slug={course.slug}
                comingSoon={course.status === 'coming_soon'}
                accessible={isMember}
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
  comingSoon,
  accessible,
}: {
  num: number
  title: string
  description: string | null
  slug?: string
  comingSoon: boolean
  accessible: boolean
}) {
  const canOpen = !comingSoon && accessible && !!slug

  const content = (
    <div
      className={`flex items-start gap-5 rounded-xl border p-5 transition-colors ${
        canOpen
          ? 'border-border bg-card hover:border-primary/30 cursor-pointer card-hover'
          : comingSoon
          ? 'border-border/40 bg-card/40 opacity-60'
          : 'border-border bg-card'
      }`}
    >
      <span className="text-2xl font-bold text-accent-brand shrink-0 w-7 pt-0.5">{num}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h2 className="font-semibold text-sm">{title}</h2>
          {comingSoon && (
            <Badge variant="secondary" className="text-xs">Скоро</Badge>
          )}
          {!comingSoon && !accessible && (
            <Badge variant="secondary" className="text-xs">Членам</Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {canOpen && (
        <span className="text-muted-foreground text-sm shrink-0">→</span>
      )}
      {!comingSoon && !accessible && (
        <span className="text-muted-foreground text-sm shrink-0">🔒</span>
      )}
    </div>
  )

  if (canOpen) {
    return <Link href={`/courses/${slug}`}>{content}</Link>
  }
  return content
}
