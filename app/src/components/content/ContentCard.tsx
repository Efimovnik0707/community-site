import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TYPE_LABELS, type ContentItem } from '@/types/content'

interface Props {
  item: ContentItem & { _accessible?: boolean }
  accessible: boolean
}

export function ContentCard({ item, accessible }: Props) {
  const isLocked = !accessible && item.is_premium

  return (
    <div
      className={`relative rounded-xl border p-5 flex flex-col gap-3 transition-colors ${
        isLocked
          ? 'border-border/40 bg-card/40'
          : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {TYPE_LABELS[item.type]}
          </Badge>
          {item.is_premium && (
            <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
              Members
            </Badge>
          )}
        </div>
        {isLocked && (
          <span className="text-muted-foreground text-sm shrink-0">🔒</span>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className={`font-semibold text-sm leading-snug mb-1 ${isLocked ? 'text-muted-foreground' : ''}`}>
          {item.title}
        </h3>
        {item.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-auto pt-1">
        {isLocked ? (
          <Button asChild size="sm" variant="outline" className="w-full text-xs">
            <Link href="/join">Открыть доступ</Link>
          </Button>
        ) : item.content_url ? (
          <Button asChild size="sm" variant="secondary" className="w-full text-xs">
            <a href={item.content_url} target="_blank" rel="noopener noreferrer">
              Открыть →
            </a>
          </Button>
        ) : item.content_body ? (
          <Button asChild size="sm" variant="secondary" className="w-full text-xs">
            <Link href={`/tools/${item.tool}/${item.slug}`}>
              Читать →
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
