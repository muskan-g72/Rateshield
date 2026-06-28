import { Skeleton } from '@/components/dashboard/DashboardSkeleton'

export function UpgradeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-16 w-full max-w-sm rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  )
}
