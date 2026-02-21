import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

interface CourseRow {
  id: string
  title: string
  is_premium: boolean
  published: boolean
  comm_course_modules: { id: string }[]
}

export default async function AdminCoursesPage() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('comm_courses')
    .select('id, title, is_premium, published, comm_course_modules(id)')
    .order('sort_order')
  const courses: CourseRow[] = data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Курсы</h1>
        <Button asChild size="sm">
          <Link href="/admin/courses/new">+ Новый курс</Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground">Пока нет курсов.</p>
      ) : (
        <div className="space-y-2">
          {courses.map(c => (
            <Link
              key={c.id}
              href={`/admin/courses/${c.id}`}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
            >
              <span className="flex-1 font-medium text-sm truncate">{c.title}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {c.comm_course_modules?.length ?? 0} модулей
              </span>
              {c.is_premium && (
                <span className="text-xs text-primary shrink-0">Premium</span>
              )}
              <span className={`w-2 h-2 rounded-full shrink-0 ${c.published ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
