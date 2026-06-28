import { Badge, Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { PlanDefinition } from '@/types/upgrade'

interface PlanComparisonCardProps {
  plan: PlanDefinition
  isCurrent: boolean
  isProUser: boolean
  isUpgrading: boolean
  onUpgrade?: () => void
}

export function PlanComparisonCard({
  plan,
  isCurrent,
  isProUser,
  isUpgrading,
  onUpgrade,
}: PlanComparisonCardProps) {
  const isProPlan = plan.id === 'pro'

  return (
    <Card
      className={cn(
        'flex h-full flex-col',
        isCurrent ? 'border-primary/50 ring-1 ring-primary/20' : null,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-50">{plan.name}</h2>
          <p className="mt-1 text-2xl font-semibold text-primary">{plan.price}</p>
        </div>
        {isCurrent ? <Badge variant="info">Current Plan</Badge> : null}
      </div>

      <p className="mb-4 text-sm text-muted">{plan.description}</p>

      <p className="mb-3 text-sm font-medium text-slate-200">Rate limit: {plan.rateLimit}</p>

      <ul className="mb-6 space-y-2 text-sm text-muted">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="text-primary" aria-hidden="true">
              •
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isProPlan ? (
        isProUser ? (
          <Button variant="secondary" disabled className="mt-auto w-full">
            Current Plan
          </Button>
        ) : (
          <Button
            className="mt-auto w-full"
            onClick={onUpgrade}
            isLoading={isUpgrading}
            disabled={isUpgrading}
          >
            Upgrade to Pro
          </Button>
        )
      ) : (
        <Button variant="ghost" disabled className="mt-auto w-full">
          {isCurrent ? 'Current Plan' : 'Included'}
        </Button>
      )}
    </Card>
  )
}
