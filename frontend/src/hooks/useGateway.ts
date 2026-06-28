import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchApiKeysRequest, fetchGatewayWeatherRequest } from '@/api/endpoints'
import {
  getLastGatewayApiKey,
  getStoredApiKeySecret,
  setLastGatewayApiKey,
} from '@/lib/apiKeyStorage'
import { getErrorMessage } from '@/types/api'
import type { ApiKey } from '@/types/apiKeys'
import type { GatewayRequestState, WeatherResponse } from '@/types/gateway'

function resolveInitialSelection(activeKeys: ApiKey[]) {
  if (activeKeys.length === 0) {
    return { keyId: null, apiKey: getLastGatewayApiKey() }
  }

  const lastApiKey = getLastGatewayApiKey()

  if (lastApiKey) {
    const matchedKey = activeKeys.find(
      (key) => getStoredApiKeySecret(key.id) === lastApiKey,
    )

    return {
      keyId: matchedKey?.id ?? activeKeys[0].id,
      apiKey: lastApiKey,
    }
  }

  const firstKey = activeKeys[0]
  const storedSecret = getStoredApiKeySecret(firstKey.id)

  return {
    keyId: firstKey.id,
    apiKey: storedSecret ?? '',
  }
}

export function useGateway() {
  const [activeKeys, setActiveKeys] = useState<ApiKey[]>([])
  const [keysLoading, setKeysLoading] = useState(true)
  const [keysError, setKeysError] = useState<string | null>(null)

  const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null)
  const [apiKey, setApiKeyState] = useState('')
  const [city, setCity] = useState('')

  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [requestState, setRequestState] = useState<GatewayRequestState>('idle')
  const [fetchError, setFetchError] = useState<string | null>(null)

  const hasLoadedRef = useRef(false)
  const fetchInFlightRef = useRef(false)

  const loadActiveKeys = useCallback(async () => {
    setKeysLoading(true)
    setKeysError(null)

    try {
      const keys = await fetchApiKeysRequest()
      const active = keys.filter((key) => key.active)
      setActiveKeys(active)

      const initial = resolveInitialSelection(active)
      setSelectedKeyId(initial.keyId)
      setApiKeyState(initial.apiKey)
    } catch (err) {
      setActiveKeys([])
      setKeysError(getErrorMessage(err, 'Unable to load API keys.'))
    } finally {
      setKeysLoading(false)
    }
  }, [])

  useEffect(() => {
    if (hasLoadedRef.current) return

    hasLoadedRef.current = true
    void loadActiveKeys()
  }, [loadActiveKeys])

  const setApiKey = useCallback((value: string) => {
    setApiKeyState(value)
    setLastGatewayApiKey(value)
  }, [])

  const selectKey = useCallback(
    (keyId: number) => {
      setSelectedKeyId(keyId)
      const storedSecret = getStoredApiKeySecret(keyId)
      if (storedSecret) {
        setApiKey(storedSecret)
      }
    },
    [setApiKey],
  )

  const fetchWeather = useCallback(async () => {
    const trimmedKey = apiKey.trim()

    if (!trimmedKey) {
      setFetchError('Select or enter an API key before fetching weather.')
      setRequestState('error')
      return
    }

    if (fetchInFlightRef.current) return

    fetchInFlightRef.current = true
    setRequestState('loading')
    setFetchError(null)
    setWeather(null)

    try {
      const response = await fetchGatewayWeatherRequest(trimmedKey)
      setWeather(response)
      setCity(response.city)
      setRequestState('success')
    } catch (err) {
      setWeather(null)
      setFetchError(getErrorMessage(err, 'Unable to fetch weather data.'))
      setRequestState('error')
    } finally {
      fetchInFlightRef.current = false
    }
  }, [apiKey])

  const isFetching = requestState === 'loading'
  const hasActiveKeys = activeKeys.length > 0

  const selectedKey =
    activeKeys.find((key) => key.id === selectedKeyId) ?? null

  return {
    activeKeys,
    keysLoading,
    keysError,
    hasActiveKeys,
    selectedKeyId,
    selectedKey,
    apiKey,
    city,
    weather,
    requestState,
    fetchError,
    isFetching,
    setApiKey,
    selectKey,
    fetchWeather,
    reloadKeys: loadActiveKeys,
  }
}
