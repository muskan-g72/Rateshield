export function ApiKeysSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading API keys">
      <div className="h-16 rounded-[18px] border-2 border-line bg-surface/50" />
      <div className="h-64 rounded-[18px] border-2 border-line bg-surface/50" />
    </div>
  )
}
