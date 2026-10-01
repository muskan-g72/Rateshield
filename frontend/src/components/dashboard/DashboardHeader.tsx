import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatPlanLabel } from '@/types/dashboard'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

interface DashboardHeaderProps {
  name: string
  email: string
  plan: string
}

export function DashboardHeader({ name, email, plan }: DashboardHeaderProps) {
  const isPro = plan.toLowerCase() === 'pro'

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
              {name}
            </h1>
            <Badge variant={isPro ? 'ok' : 'info'}>
              {formatPlanLabel(plan)}
            </Badge>
          </div>
          <p className="mt-1 text-sm font-mono text-muted">{email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/api-keys">
            <Button size="sm" variant="secondary">
              Manage keys
            </Button>
          </Link>
          <Link to="/gateway">
            <Button size="sm" variant="secondary">
              Test gateway
            </Button>
          </Link>
          {!isPro && (
            <Link to="/upgrade">
              <Button size="sm" variant="primary">
                Upgrade to Pro
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
