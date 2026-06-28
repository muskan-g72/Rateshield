import { Badge } from '@/components/ui/Badge'
import type { HealthStatus } from '@/types/health'

interface HealthStatusBadgeProps {
  status: HealthStatus | string
}

function resolveVariant(status: string): 'success' | 'warning' | 'danger' {
  if (status === 'healthy') return 'success'
  if (status === 'unhealthy') return 'danger'
  return 'warning'
}

function resolveLabel(status: string): string {
  if (status === 'healthy') return 'Healthy'
  if (status === 'unhealthy') return 'Unhealthy'
  return 'Warning'
}

function resolveIndicator(status: string): string {
  if (status === 'healthy') return '🟢'
  if (status === 'unhealthy') return '🔴'
  return '🟡'
}

export function HealthStatusBadge({ status }: HealthStatusBadgeProps) {
  return (
    <Badge variant={resolveVariant(status)} className="gap-1.5">
      <span aria-hidden="true">{resolveIndicator(status)}</span>
      {resolveLabel(status)}
    </Badge>
  )
}
