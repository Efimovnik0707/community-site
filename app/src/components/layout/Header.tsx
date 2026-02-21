import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUnifiedUser } from '@/lib/supabase/auth'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { NavLinks } from './NavLinks'

const PUBLIC_NAV = [
  { href: '/tools/n8n', label: 'N8N', match: '/tools/n8n' },
  { href: '/tools/claude-code', label: 'Claude Code', match: '/tools/claude-code' },
  { href: '/tools/chatgpt', label: 'ChatGPT', match: '/tools/chatgpt' },
  { href: '/courses', label: 'Курсы', match: '/courses' },
  { href: '/p', label: 'Продукты', match: '/p' },
]

const MEMBERS_NAV = [
  { href: '/streams', label: 'Эфиры', match: '/streams' },
]

export async function Header() {
  const user = await getUnifiedUser()
  const isMember = user?.role === 'member' || user?.role === 'admin'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm hover:opacity-80 transition-opacity shrink-0">
          AI Комьюнити
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLinks items={PUBLIC_NAV} />
          {isMember && <NavLinks items={MEMBERS_NAV} />}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            isMember ? (
              <>
                <span className="hidden sm:block text-sm text-muted-foreground mr-1">
                  {user.firstName ?? user.email?.split('@')[0]}
                </span>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/courses">Мои курсы</Link>
                </Button>
                {user.telegramId ? (
                  <LogoutButton />
                ) : (
                  <Button asChild size="sm" variant="ghost">
                    <Link href="/my">Кабинет</Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/my">Мои продукты</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/join">Вступить</Link>
                </Button>
              </>
            )
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">Войти</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/join">Вступить</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
