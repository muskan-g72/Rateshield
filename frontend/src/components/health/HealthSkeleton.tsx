export function HealthSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading health status">
      <div className="h-16 rounded-[18px] border-2 border-line bg-surface/50" />
      <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 rounded-[18px] border-2 border-line bg-surface/50" />
        <div className="h-24 rounded-[18px] border-2 border-line bg-surface/50" />
        <div className="h-24 rounded-[18px] border-2 border-line bg-surface/50" />
      </div>
    </div>
  )
}
