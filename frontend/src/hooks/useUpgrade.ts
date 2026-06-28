import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboardRequest, upgradePlanRequest } from '@/api/endpoints'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/types/api'
import { normalizePlan } from '@/types/upgrade'

export function useUpgrade() {
  const { plan: contextPlan, updatePlan } = useAuth()

  const [plan, setPlan] = useState<string | null>(contextPlan)
  const [isLoading, setIsLoading] = useState(!contextPlan)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const hasLoadedRef = useRef(false)
  const upgradeInFlightRef = useRef(false)

  const loadPlan = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const dashboard = await fetchDashboardRequest()
      setPlan(dashboard.plan)
      updatePlan(dashboard.plan)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load plan information.'))
    } finally {
      setIsLoading(false)
    }
  }, [updatePlan])

  useEffect(() => {
    if (contextPlan) {
      setPlan(contextPlan)
      setIsLoading(false)
      return
    }

    if (hasLoadedRef.current) return

    hasLoadedRef.current = true
    void loadPlan()
  }, [contextPlan, loadPlan])

  const upgrade = useCallback(async () => {
    if (upgradeInFlightRef.current || isUpgrading) return

    upgradeInFlightRef.current = true
    setIsUpgrading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await upgradePlanRequest()
      setPlan(response.plan)
      updatePlan(response.plan)
      setSuccessMessage(response.message)
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to upgrade plan.'))
    } finally {
      upgradeInFlightRef.current = false
      setIsUpgrading(false)
    }
  }, [isUpgrading, updatePlan])

  const normalizedPlan = normalizePlan(plan ?? 'free')
  const isPro = normalizedPlan === 'pro'

  return {
    plan: normalizedPlan,
    isLoading,
    isUpgrading,
    isPro,
    error,
    successMessage,
    upgrade,
    reloadPlan: loadPlan,
  }
}
