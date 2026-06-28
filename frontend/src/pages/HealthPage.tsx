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
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Health</h1>
          <p className="mt-1 text-sm text-muted">
            Monitor the status of RateShield backend services.
          </p>
        </div>

        <Card>
          <CardHeader
            title="Health check unavailable"
            description="The health endpoint could not be reached."
          />
          <Alert variant="error">{error ?? 'Unable to load health data.'}</Alert>
          <div className="mt-4">
            <Button onClick={() => void refresh()} isLoading={isRefreshing}>
              Try again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Health</h1>
          <p className="mt-1 text-sm text-muted">
            Monitor the status of RateShield backend services.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void refresh()} isLoading={isRefreshing}>
          Refresh
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted">Overall status</p>
            <div className="mt-2">
              <HealthStatusBadge status={health.status} />
            </div>
          </div>
          <p className="text-sm text-muted">
            Last updated: <span className="text-slate-200">{lastUpdated ?? '—'}</span>
          </p>
        </div>
        <p className="mt-3 text-xs text-muted">Auto-refreshes every 30 seconds while this page is open.</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {HEALTH_SERVICES.map((service) => (
          <ServiceHealthCard
            key={service.key}
            label={service.label}
            status={health.services[service.key]}
          />
        ))}
      </div>
    </div>
  )
}
