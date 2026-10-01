import { Alert, Button } from '@/components/ui'
import {
  DashboardHeader,
  DashboardSkeleton,
  StatBar,
  StatCard,
} from '@/components/dashboard'
import { useDashboard } from '@/hooks/useDashboard'

export function DashboardPage() {
  const { data, isLoading, error, refetch } = useDashboard()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <Alert variant="error">{error ?? 'Unable to load dashboard data.'}</Alert>
        <Button onClick={() => void refetch()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Name, Email, Plan, Quick Actions */}
      <DashboardHeader name={data.name} email={data.email} plan={data.plan} />

      {/* 2. Proportional Bar: Approved vs Blocked Requests */}
      <StatBar
        approved={data.approved_requests}
        blocked={data.blocked_requests}
        totalRequests={data.total_requests}
        successRate={data.success_rate}
      />

      {/* 3. Row of Compact Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total API Keys"
          value={data.total_api_keys}
          hint="All registered keys"
        />
        <StatCard
          label="Active Keys"
          value={data.active_api_keys}
          hint="Ready for traffic"
          variant="ok"
        />
        <StatCard
          label="Total Requests"
          value={data.total_requests}
          hint="All time recorded"
        />
        <StatCard
          label="Account Plan"
          value={data.plan.toUpperCase()}
          hint={data.plan.toLowerCase() === 'pro' ? '100 req/min limit' : '5 req/min limit'}
        />
      </div>
    </div>
  )
}
