import { Card } from '@/components/ui/Card'
import { HealthStatusBadge } from '@/components/health/HealthStatusBadge'
import type { HealthStatus } from '@/types/health'

interface ServiceHealthCardProps {
  label: string
  status: HealthStatus
}

export function ServiceHealthCard({ label, status }: ServiceHealthCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-100">{label}</p>
          <p className="mt-1 text-xs text-muted">Backend service status</p>
        </div>
        <HealthStatusBadge status={status} />
      </div>
    </Card>
  )
}
