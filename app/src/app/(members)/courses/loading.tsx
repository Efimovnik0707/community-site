export default function CoursesLoading() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10">
          <div className="h-8 w-32 bg-muted/40 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="space-y-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center gap-4">
              <div className="w-6 h-6 bg-muted/40 rounded animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-muted/40 rounded animate-pulse" />
                <div className="h-3 w-80 bg-muted/30 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
