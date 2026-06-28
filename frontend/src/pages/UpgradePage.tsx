import { PlanComparisonCard, UpgradeSkeleton } from '@/components/upgrade'
import { Alert, Badge, Button, Card } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useUpgrade } from '@/hooks/useUpgrade'
import { formatPlanLabel } from '@/types/dashboard'
import { PLAN_DEFINITIONS } from '@/types/upgrade'

export function UpgradePage() {
  const { plan: contextPlan } = useAuth()
  const {
    plan,
    isLoading,
    isUpgrading,
    isPro,
    error,
    successMessage,
    upgrade,
    reloadPlan,
  } = useUpgrade()

  if (isLoading) {
    return <UpgradeSkeleton />
  }

  if (error && !plan) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert variant="error">{error}</Alert>
        <Button onClick={() => void reloadPlan()}>Try again</Button>
      </div>
    )
  }

  const displayPlan = contextPlan ?? plan

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">Upgrade</h1>
        <p className="mt-1 text-sm text-muted">
          Compare plans and upgrade your account to unlock higher rate limits.
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted">Your current plan</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">
              {formatPlanLabel(displayPlan ?? 'free')}
            </p>
          </div>
          <Badge variant={isPro ? 'success' : 'info'}>
            {isPro ? 'Pro plan active' : 'Free plan active'}
          </Badge>
        </div>
      </Card>

      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {PLAN_DEFINITIONS.map((planDefinition) => (
          <PlanComparisonCard
            key={planDefinition.id}
            plan={planDefinition}
            isCurrent={plan === planDefinition.id}
            isProUser={isPro}
            isUpgrading={isUpgrading}
            onUpgrade={() => void upgrade()}
          />
        ))}
      </div>
    </div>
  )
}
