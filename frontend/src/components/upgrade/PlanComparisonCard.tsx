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
        'flex h-full flex-col justify-between p-6 sm:p-7 transition-all duration-150',
        isCurrent ? 'border-ink ring-2 ring-ink/10' : null,
      )}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold font-display text-ink">{plan.name}</h2>
            <p className="mt-1 text-3xl font-extrabold font-mono text-ink">{plan.price}</p>
          </div>
          {isCurrent ? <Badge variant="ok">Current plan</Badge> : null}
        </div>

        <p className="mb-4 text-sm text-muted">{plan.description}</p>

        <div className="mb-4 rounded-[10px] border border-line bg-bg p-3">
          <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider block">
            Rate limit quota
          </span>
          <span className="font-mono text-base font-bold text-ink">
            {plan.rateLimit}
          </span>
        </div>

        <ul className="mb-6 space-y-2.5 text-sm text-muted">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok mt-1.5 shrink-0" />
              <span className="text-ink text-xs sm:text-sm font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {isProPlan ? (
          isProUser ? (
            <Button variant="secondary" disabled className="w-full">
              Current plan
            </Button>
          ) : (
            <Button
              variant="primary"
              className="w-full"
              onClick={onUpgrade}
              isLoading={isUpgrading}
              disabled={isUpgrading}
            >
              Upgrade to Pro
            </Button>
          )
        ) : (
          <Button variant="secondary" disabled className="w-full opacity-60">
            {isCurrent ? 'Current plan' : 'Free tier'}
          </Button>
        )}
      </div>
    </Card>
  )
}
