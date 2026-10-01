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
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <Alert variant="error">{error}</Alert>
        <Button onClick={() => void reloadPlan()}>Try again</Button>
      </div>
    )
  }

  const displayPlan = contextPlan ?? plan

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
          Upgrade plan
        </h1>
        <p className="mt-1 text-sm text-muted">
          Compare tier quotas and unlock higher rate limits for production workloads.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-mono font-semibold uppercase text-muted">Your active subscription</p>
            <p className="mt-1 text-xl font-extrabold font-display text-ink">
              {formatPlanLabel(displayPlan ?? 'free')} Tier
            </p>
          </div>
          <Badge variant={isPro ? 'ok' : 'info'}>
            {isPro ? 'Pro plan active' : 'Free plan active'}
          </Badge>
        </div>
      </Card>

      {/* Alerts */}
      {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {/* Two-Plan Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-2">
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
