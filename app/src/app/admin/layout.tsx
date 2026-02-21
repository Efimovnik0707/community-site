import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUnifiedUser } from '@/lib/supabase/auth'

const NAV = [
  { href: '/admin', label: 'Дашборд', exact: true },
  { href: '/admin/content', label: 'Материалы' },
  { href: '/admin/courses', label: 'Курсы' },
  { href: '/admin/streams', label: 'Эфиры' },
  { href: '/admin/products', label: 'Продукты' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUnifiedUser()
  if (!user || user.role !== 'admin') redirect('/login')

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-border flex flex-col">
        <div className="h-14 flex items-center px-4 border-b border-border">
          <Link href="/admin" className="font-semibold text-sm">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Link href="/" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← На сайт
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
