import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { TYPE_LABELS, type ContentItem } from '@/types/content'

interface Props {
  item: ContentItem & { _accessible?: boolean }
  accessible: boolean
}

export function ContentCard({ item, accessible }: Props) {
  const isLocked = !accessible && item.is_premium

  const cardContent = (
    <div
      className={`group relative rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 h-full ${
        isLocked
          ? 'border-border/30 bg-card/30'
          : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
      }`}
    >
      {/* Type badge + lock */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          {TYPE_LABELS[item.type]}
        </span>
        {isLocked && (
          <span className="text-muted-foreground/50 text-xs">🔒</span>
        )}
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h3 className={`font-semibold text-sm leading-snug mb-1.5 ${isLocked ? 'text-muted-foreground/60' : 'group-hover:text-primary transition-colors'}`}>
          {item.title}
        </h3>
        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Tags — visually distinct: small, muted, no border */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded text-muted-foreground/60 bg-muted/40 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="pt-1 border-t border-border/50">
        {isLocked ? (
          <span className="text-xs text-muted-foreground/60">Только для участников</span>
        ) : item.content_url ? (
          <span className="text-xs font-medium text-primary/80">Открыть ресурс</span>
        ) : item.content_body ? (
          <span className="text-xs font-medium text-primary/80">Читать</span>
        ) : null}
      </div>
    </div>
  )

  if (isLocked) return cardContent

  if (item.content_url) {
    return (
      <a href={item.content_url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    )
  }

  if (item.content_body) {
    return (
      <Link href={`/tools/${item.tool}/${item.slug}`} className="block h-full">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
