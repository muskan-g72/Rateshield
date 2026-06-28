import axios from 'axios'
import { apiClient } from '@/api/client'
import { clearDedupeKey, dedupeRequest } from '@/lib/dedupeRequest'
import type { LoginCredentials, LoginResponse, RegisterData, RegisterResponse } from '@/types/auth'
import type { ApiKey, CreateApiKeyResponse } from '@/types/apiKeys'
import type { DashboardData } from '@/types/dashboard'
import type { HealthResponse } from '@/types/health'
import type { UpgradeResponse } from '@/types/upgrade'
import type { WeatherResponse } from '@/types/gateway'

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/login', credentials)
  return data
}

export async function registerRequest(payload: RegisterData): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/register', payload)
  return data
}

export async function upgradePlanRequest(): Promise<UpgradeResponse> {
  const { data } = await apiClient.post<UpgradeResponse>('/upgrade')
  clearDedupeKey('dashboard')
  return data
}

export async function fetchProtectedRequest(): Promise<{
  message: string
  user: { id: number; email: string }
}> {
  return dedupeRequest('protected', async () => {
    const { data } = await apiClient.get<{
      message: string
      user: { id: number; email: string }
    }>('/protected')
    return data
  })
}

export async function fetchHealthRequest(): Promise<HealthResponse> {
  return dedupeRequest('health', async () => {
    try {
      const { data } = await apiClient.get<HealthResponse>('/health')
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 503 && error.response.data) {
        return error.response.data as HealthResponse
      }

      throw error
    }
  })
}

export async function fetchDashboardRequest(): Promise<DashboardData> {
  return dedupeRequest('dashboard', async () => {
    const { data } = await apiClient.get<DashboardData>('/dashboard')
    return data
  })
}

export async function fetchApiKeysRequest(): Promise<ApiKey[]> {
  return dedupeRequest('api-keys', async () => {
    const { data } = await apiClient.get<ApiKey[]>('/api-keys')
    return data
  })
}

export async function createApiKeyRequest(name: string): Promise<CreateApiKeyResponse> {
  const { data } = await apiClient.post<CreateApiKeyResponse>('/api-keys', { name })
  return data
}

export async function revokeApiKeyRequest(keyId: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/api-keys/${keyId}`)
  return data
}

export async function fetchGatewayWeatherRequest(apiKey: string): Promise<WeatherResponse> {
  const { data } = await apiClient.get<WeatherResponse>('/gateway/weather', {
    headers: {
      'X-API-Key': apiKey,
    },
  })
  return data
}

export async function fetchGatewayTestRequest(apiKey: string): Promise<{ message: string }> {
  const { data } = await apiClient.get('/gateway/test', {
    headers: {
      'X-API-Key': apiKey,
    },
  })
  return data
}
