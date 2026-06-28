import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchHealthRequest } from '@/api/endpoints'
import { getErrorMessage } from '@/types/api'
import type { HealthResponse } from '@/types/health'
import { formatHealthTimestamp } from '@/types/health'

const AUTO_REFRESH_MS = 30_000

export function useHealth(autoRefresh = true) {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMountedRef = useRef(true)
  const hasLoadedRef = useRef(false)
  const refreshInFlightRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const loadHealth = useCallback(async (isManualRefresh = false) => {
    if (refreshInFlightRef.current) return

    refreshInFlightRef.current = true

    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setError(null)

    try {
      const data = await fetchHealthRequest()

      if (!isMountedRef.current) return

      setHealth(data)
      setLastUpdated(new Date())
    } catch (err) {
      if (!isMountedRef.current) return

      setHealth(null)
      setError(getErrorMessage(err, 'Unable to reach the health endpoint.'))
    } finally {
      refreshInFlightRef.current = false

      if (!isMountedRef.current) return

      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (hasLoadedRef.current) return

    hasLoadedRef.current = true
    void loadHealth()
  }, [loadHealth])

  useEffect(() => {
    if (!autoRefresh) return

    const intervalId = window.setInterval(() => {
      void loadHealth(true)
    }, AUTO_REFRESH_MS)

    return () => window.clearInterval(intervalId)
  }, [autoRefresh, loadHealth])

  return {
    health,
    lastUpdated: lastUpdated ? formatHealthTimestamp(lastUpdated) : null,
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadHealth(true),
  }
}
