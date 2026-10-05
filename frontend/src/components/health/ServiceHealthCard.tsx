import { Card } from '@/components/ui/Card'
import { HealthStatusBadge } from '@/components/health/HealthStatusBadge'
import type { HealthStatus } from '@/types/health'

interface ServiceHealthCardProps {
  label: string
  subtitle: string
  status: HealthStatus
  detail?: string | null
}

export function ServiceHealthCard({
  label,
  subtitle,
  status,
  detail,
}: ServiceHealthCardProps) {
  const normalized = status.toLowerCase()
  const isHealthy = normalized === 'healthy'
  const isUnhealthy = normalized === 'unhealthy'

  return (
    <Card className="flex flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold font-display text-ink">{label}</p>
          <p className="mt-0.5 text-xs text-muted">{subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <HealthStatusBadge status={status} />
          {!isHealthy && detail ? (
            <span
              className={`text-[11px] font-mono font-medium tracking-tight break-all text-right ${
                isUnhealthy ? 'text-no' : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {detail}
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
