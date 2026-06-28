import { Alert, Button } from '@/components/ui'
import {
  DashboardHeader,
  DashboardSkeleton,
  StatCard,
} from '@/components/dashboard'
import { useDashboard } from '@/hooks/useDashboard'
import { formatSuccessRate } from '@/types/dashboard'

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert variant="error">{error ?? 'Unable to load dashboard data.'}</Alert>
        <Button onClick={() => void refetch()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DashboardHeader name={data.name} email={data.email} plan={data.plan} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total API Keys" value={data.total_api_keys} />
        <StatCard label="Active API Keys" value={data.active_api_keys} variant="primary" />
        <StatCard label="Total Requests" value={data.total_requests} />
        <StatCard label="Approved Requests" value={data.approved_requests} variant="success" />
        <StatCard label="Blocked Requests" value={data.blocked_requests} variant="danger" />
        <StatCard
          label="Success Rate"
          value={formatSuccessRate(data.success_rate)}
          variant="primary"
        />
      </div>
    </div>
  )
}
