import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createApiKeyRequest,
  fetchApiKeysRequest,
  revokeApiKeyRequest,
} from '@/api/endpoints'
import { getErrorMessage } from '@/types/api'
import type { ApiKey, CreateApiKeyResponse } from '@/types/apiKeys'

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const actionInFlightRef = useRef(false)
  const hasLoadedRef = useRef(false)

  const loadKeys = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchApiKeysRequest()
      setKeys(data)
    } catch (err) {
      setKeys([])
      setError(getErrorMessage(err, 'Unable to load API keys.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (hasLoadedRef.current) return

    hasLoadedRef.current = true
    void loadKeys()
  }, [loadKeys])

  const createKey = useCallback(async (name: string): Promise<CreateApiKeyResponse> => {
    if (actionInFlightRef.current) {
      throw new Error('A key operation is already in progress.')
    }

    actionInFlightRef.current = true
    setIsSubmitting(true)
    setActionError(null)

    try {
      const created = await createApiKeyRequest(name)

      setKeys((current) => [
        ...current,
        {
          id: created.id,
          name: created.name,
          active: created.active,
          created_at: new Date().toISOString(),
        },
      ])

      return created
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to create API key.')
      setActionError(message)
      throw new Error(message)
    } finally {
      actionInFlightRef.current = false
      setIsSubmitting(false)
    }
  }, [])

  const revokeKey = useCallback(async (keyId: number) => {
    if (actionInFlightRef.current) {
      throw new Error('A key operation is already in progress.')
    }

    actionInFlightRef.current = true
    setIsSubmitting(true)
    setActionError(null)

    try {
      await revokeApiKeyRequest(keyId)

      setKeys((current) =>
        current.map((key) => (key.id === keyId ? { ...key, active: false } : key)),
      )
    } catch (err) {
      const message = getErrorMessage(err, 'Unable to revoke API key.')
      setActionError(message)
      throw new Error(message)
    } finally {
      actionInFlightRef.current = false
      setIsSubmitting(false)
    }
  }, [])

  return {
    keys,
    isLoading,
    error,
    actionError,
    isSubmitting,
    loadKeys,
    createKey,
    revokeKey,
    clearActionError: () => setActionError(null),
  }
}
