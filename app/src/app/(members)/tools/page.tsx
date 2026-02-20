import { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/badge'
import { TOOL_META, type ToolSlug } from '@/types/content'

export const metadata: Metadata = {
  title: 'Инструменты',
  description: 'Шаблоны, промпты и скиллы по AI-инструментам',
}

export default function ToolsPage() {
  const tools = Object.entries(TOOL_META) as [ToolSlug, typeof TOOL_META[ToolSlug]][]

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Инструменты</h1>
            <p className="text-muted-foreground">
              Шаблоны, промпты, скиллы и воркфлоу — готовые к использованию
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {tools.map(([slug, meta]) => (
              meta.locked ? (
                <div
                  key={slug}
                  className="rounded-xl border border-border/40 bg-card/40 p-6 opacity-60 cursor-not-allowed"
                >
                  <div className="text-3xl mb-4">{meta.icon}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-semibold text-sm">{meta.label}</h2>
                    <Badge variant="secondary" className="text-xs">Скоро</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{meta.description}</p>
                </div>
              ) : (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 group card-hover"
                >
                  <div className="text-3xl mb-4">{meta.icon}</div>
                  <h2 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                    {meta.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">{meta.description}</p>
                </Link>
              )
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
