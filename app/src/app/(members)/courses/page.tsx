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

          {/* Available courses */}
          {allCourses.filter(c => c.status !== 'coming_soon').length > 0 && (
            <div className="space-y-5 mb-8">
              {allCourses
                .filter(c => c.status !== 'coming_soon')
                .map((course, i) => (
                  <CourseRow
                    key={course.id}
                    num={i + 1}
                    title={course.title}
                    description={course.description}
                    slug={course.slug}
                    comingSoon={false}
                    accessible={isMember}
                  />
                ))}
            </div>
          )}

          {/* Coming soon courses */}
          {allCourses.filter(c => c.status === 'coming_soon').length > 0 && (
            <>
              {allCourses.filter(c => c.status !== 'coming_soon').length > 0 && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider">Скоро</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
              )}
              <div className="space-y-4">
                {allCourses
                  .filter(c => c.status === 'coming_soon')
                  .map((course, i) => (
                    <CourseRow
                      key={course.id}
                      num={i + 1}
                      title={course.title}
                      description={course.description}
                      slug={course.slug}
                      comingSoon={true}
                      accessible={isMember}
                    />
                  ))}
              </div>
            </>
          )}
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
      className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all duration-200 ${
        canOpen
          ? 'border-border bg-card hover:border-primary/40 hover:shadow-sm cursor-pointer'
          : comingSoon
          ? 'border-border/30 bg-card/30 opacity-50'
          : 'border-border bg-card'
      }`}
    >
      <span className={`text-lg font-bold shrink-0 w-6 text-center ${canOpen ? 'text-primary' : 'text-muted-foreground/40'}`}>{num}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className={`font-semibold text-sm ${canOpen ? 'group-hover:text-primary transition-colors' : ''}`}>{title}</h2>
          {!comingSoon && !accessible && (
            <Badge variant="secondary" className="text-[10px] px-1.5">Участникам</Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{description}</p>
        )}
      </div>
      {canOpen && (
        <svg className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {!comingSoon && !accessible && (
        <svg className="text-muted-foreground/30 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  )

  if (canOpen) {
    return <Link href={`/courses/${slug}`}>{content}</Link>
  }
  return content
}
