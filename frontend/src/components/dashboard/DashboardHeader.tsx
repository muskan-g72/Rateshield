import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatPlanLabel } from '@/types/dashboard'

interface DashboardHeaderProps {
  name: string
  email: string
  plan: string
}

function getPlanBadgeVariant(plan: string): 'default' | 'info' | 'success' {
  if (plan.toLowerCase() === 'pro') return 'success'
  if (plan.toLowerCase() === 'free') return 'info'
  return 'default'
}

export function DashboardHeader({ name, email, plan }: DashboardHeaderProps) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">{name}</h1>
          <p className="mt-1 text-sm text-muted">{email}</p>
        </div>
        <Badge variant={getPlanBadgeVariant(plan)}>{formatPlanLabel(plan)}</Badge>
      </div>
    </Card>
  )
}
