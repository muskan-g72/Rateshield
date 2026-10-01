export function UpgradeSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading upgrade plans">
      <div className="h-16 rounded-[18px] border-2 border-line bg-surface/50" />
      <div className="h-28 rounded-[18px] border-2 border-line bg-surface/50" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-96 rounded-[18px] border-2 border-line bg-surface/50" />
        <div className="h-96 rounded-[18px] border-2 border-line bg-surface/50" />
      </div>
    </div>
  )
}
