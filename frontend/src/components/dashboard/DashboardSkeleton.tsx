export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard">
      {/* Header skeleton */}
      <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />

      {/* StatBar skeleton */}
      <div className="h-44 rounded-[18px] border-2 border-line bg-surface/50" />

      {/* Row of stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />
        <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />
        <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />
        <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />
      </div>
    </div>
  )
}
