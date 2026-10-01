import { Badge } from '@/components/ui/Badge'
import type { HealthStatus } from '@/types/health'

interface HealthStatusBadgeProps {
  status: HealthStatus | string
}

export function HealthStatusBadge({ status }: HealthStatusBadgeProps) {
  const isHealthy = status === 'healthy'
  const isUnhealthy = status === 'unhealthy'

  return (
    <Badge variant={isHealthy ? 'ok' : isUnhealthy ? 'no' : 'warning'}>
      {isHealthy ? 'Healthy' : isUnhealthy ? 'Unhealthy' : 'Degraded'}
    </Badge>
  )
}
