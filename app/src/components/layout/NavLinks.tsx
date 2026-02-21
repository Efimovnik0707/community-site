'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  match?: string // prefix to match for active state
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <>
      {items.map(item => {
        const isActive = item.match
          ? pathname.startsWith(item.match)
          : pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative py-0.5 transition-colors ${
              isActive
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {item.label}
            {isActive && (
              <span className="absolute -bottom-[18px] left-0 right-0 h-px bg-foreground" />
            )}
          </Link>
        )
      })}
    </>
  )
}
