import {
  HealthSkeleton,
  HealthStatusBadge,
  ServiceHealthCard,
} from '@/components/health'
import { Alert, Button, Card, CardHeader } from '@/components/ui'
import { useHealth } from '@/hooks/useHealth'
import { HEALTH_SERVICES } from '@/types/health'

export function HealthPage() {
  const { health, lastUpdated, isLoading, isRefreshing, error, refresh } = useHealth(true)

  if (isLoading) {
    return <HealthSkeleton />
  }

  if (error || !health) {
    return (
      <div className="space-y-6 py-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
            System Health
          </h1>
          <p className="mt-1 text-sm text-muted">
            Monitor the live operational status of RateShield backend infrastructure.
          </p>
        </div>

        <Card>
          <CardHeader
            title="Health Check Unavailable"
            description="The health check endpoint could not be reached."
          />
          <Alert variant="error">{error ?? 'Unable to connect to health endpoint.'}</Alert>
          <div className="mt-5">
            <Button variant="primary" onClick={() => void refresh()} isLoading={isRefreshing}>
              Try again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
            System Health
          </h1>
          <p className="mt-1 text-sm text-muted">
            Live operational status across database, Redis cache, and upstream services.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refresh()} isLoading={isRefreshing}>
          Refresh health
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-mono font-semibold uppercase text-muted">Overall gateway health</p>
            <div className="mt-2">
              <HealthStatusBadge status={health.status} />
            </div>
          </div>
          <p className="text-xs font-mono text-muted">
            Last checked: <span className="font-semibold text-ink">{lastUpdated ?? '—'}</span>
          </p>
        </div>
        <p className="mt-4 pt-3 border-t border-line text-xs font-mono text-muted">
          Auto-refreshes every 30 seconds while this dashboard is active.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {HEALTH_SERVICES.map((service) => {
          const serviceVal = health.services[service.key]
          const status = typeof serviceVal === 'string' ? serviceVal : 'unhealthy'
          const detail = (health.services[`${service.key}_detail`] as string | undefined) ?? null

          return (
            <ServiceHealthCard
              key={service.key}
              label={service.label}
              subtitle={service.subtitle}
              status={status}
              detail={detail}
            />
          )
        })}
      </div>
    </div>
  )
}
