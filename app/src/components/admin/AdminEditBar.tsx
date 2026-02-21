import Link from 'next/link'

interface AdminEditBarProps {
  label: string
  href: string
}

export function AdminEditBar({ label, href }: AdminEditBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-500/30 bg-amber-950/90 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 h-11 flex items-center justify-between gap-4">
        <span className="text-xs text-amber-400/70 font-mono">admin</span>
        <Link
          href={href}
          className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-100 transition-colors font-medium"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          {label}
        </Link>
      </div>
    </div>
  )
}
