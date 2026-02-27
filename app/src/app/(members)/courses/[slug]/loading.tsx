export default function CourseLoading() {
  return (
    <div className="pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10">
          <div className="h-4 w-24 bg-muted/30 rounded animate-pulse mb-4" />
          <div className="h-8 w-72 bg-muted/40 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-96 bg-muted/30 rounded animate-pulse" />
          <div className="mt-6 h-1.5 bg-muted/30 rounded-full" />
        </div>
        <div className="space-y-8">
          {[1, 2].map(i => (
            <div key={i}>
              <div className="h-3 w-28 bg-muted/30 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map(j => (
                  <div key={j} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                    <div className="w-5 h-5 rounded-full bg-muted/40 animate-pulse shrink-0" />
                    <div className="flex-1 h-4 bg-muted/30 rounded animate-pulse" />
                    <div className="w-12 h-3 bg-muted/20 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
