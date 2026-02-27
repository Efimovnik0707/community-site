export default function LessonLoading() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3 w-16 bg-muted/30 rounded animate-pulse" />
          <div className="h-3 w-3 bg-muted/20 rounded animate-pulse" />
          <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" />
          <div className="h-3 w-3 bg-muted/20 rounded animate-pulse" />
          <div className="h-3 w-48 bg-muted/30 rounded animate-pulse" />
        </div>
        {/* Title */}
        <div className="h-8 w-80 bg-muted/40 rounded-lg animate-pulse mb-8" />
        {/* Video placeholder */}
        <div className="aspect-video rounded-2xl bg-muted/20 border border-border/60 animate-pulse mb-10" />
        {/* Content lines */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-4 bg-muted/30 rounded animate-pulse ${i === 3 ? 'w-3/4' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
