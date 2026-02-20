import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/session'

export async function Header() {
  const session = await getSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold text-sm hover:opacity-80 transition-opacity">
          AI Комьюнити
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/tools/n8n" className="hover:text-foreground transition-colors">N8N</Link>
          <Link href="/tools/claude-code" className="hover:text-foreground transition-colors">Claude Code</Link>
          <Link href="/tools/chatgpt" className="hover:text-foreground transition-colors">ChatGPT</Link>
          <Link href="/courses" className="hover:text-foreground transition-colors">Курсы</Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden sm:block text-sm text-muted-foreground">
                {session.firstName}
              </span>
              {session.role === 'member' || session.role === 'admin' ? (
                <Button asChild size="sm" variant="secondary">
                  <Link href="/courses">Мои курсы</Link>
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link href="/join">Стать участником</Link>
                </Button>
              )}
            </>
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
