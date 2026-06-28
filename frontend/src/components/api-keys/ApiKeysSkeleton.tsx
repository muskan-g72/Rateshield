import { Skeleton } from '@/components/dashboard/DashboardSkeleton'

export function ApiKeysSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="border-b border-border bg-surface px-4 py-3">
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border-b border-border px-4 py-4 last:border-b-0">
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
