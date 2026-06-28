import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboardRequest } from '@/api/endpoints'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/types/api'
import type { DashboardData } from '@/types/dashboard'

export function useDashboard() {
  const { updatePlan } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)

  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchDashboardRequest()
      setData(response)
      updatePlan(response.plan)
    } catch (err) {
      setData(null)
      setError(getErrorMessage(err, 'Unable to load dashboard data.'))
    } finally {
      setIsLoading(false)
    }
  }, [updatePlan])

  useEffect(() => {
    if (hasLoadedRef.current) return

    hasLoadedRef.current = true
    void loadDashboard()
  }, [loadDashboard])

  return {
    data,
    isLoading,
    error,
    refetch: loadDashboard,
  }
}
