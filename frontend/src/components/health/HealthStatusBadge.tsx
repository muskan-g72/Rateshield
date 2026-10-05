import { Badge } from '@/components/ui/Badge'
import type { HealthStatus } from '@/types/health'

interface HealthStatusBadgeProps {
  status: HealthStatus | string
}

export function HealthStatusBadge({ status }: HealthStatusBadgeProps) {
  const normalized = status.toLowerCase()

  if (normalized === 'healthy') {
    return <Badge variant="ok">Healthy</Badge>
  }

  if (normalized === 'unhealthy') {
    return <Badge variant="no">Unhealthy</Badge>
  }

  if (normalized === 'starting') {
    return <Badge variant="warning">Starting</Badge>
  }

  if (normalized === 'unavailable') {
    return <Badge variant="warning">Unavailable</Badge>
  }

  return <Badge variant="warning">Degraded</Badge>
}
