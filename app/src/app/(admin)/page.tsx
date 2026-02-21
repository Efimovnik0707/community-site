import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = createServiceClient()

  const [
    { count: contentCount },
    { count: courseCount },
    { count: streamCount },
  ] = await Promise.all([
    supabase.from('comm_content_items').select('*', { count: 'exact', head: true }),
    supabase.from('comm_courses').select('*', { count: 'exact', head: true }),
    supabase.from('comm_streams').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Материалы', count: contentCount ?? 0, href: '/admin/content' },
    { label: 'Курсы', count: courseCount ?? 0, href: '/admin/courses' },
    { label: 'Эфиры', count: streamCount ?? 0, href: '/admin/streams' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Дашборд</h1>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
          >
            <p className="text-3xl font-bold mb-1">{s.count}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link href="/admin/content/new" className="rounded-xl border border-dashed border-border p-6 text-center hover:border-primary/30 transition-colors">
          <p className="text-sm font-medium">+ Новый материал</p>
        </Link>
        <Link href="/admin/courses/new" className="rounded-xl border border-dashed border-border p-6 text-center hover:border-primary/30 transition-colors">
          <p className="text-sm font-medium">+ Новый курс</p>
        </Link>
        <Link href="/admin/streams/new" className="rounded-xl border border-dashed border-border p-6 text-center hover:border-primary/30 transition-colors">
          <p className="text-sm font-medium">+ Новый эфир</p>
        </Link>
      </div>
    </div>
  )
}
