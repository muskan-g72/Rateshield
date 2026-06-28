import { apiClient } from '@/api/client'
import type { LoginCredentials, LoginResponse, RegisterData, RegisterResponse } from '@/types/auth'

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/login', credentials)
  return data
}

export async function registerRequest(payload: RegisterData): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/register', payload)
  return data
}

export async function upgradePlanRequest(): Promise<{ message: string; plan: string }> {
  const { data } = await apiClient.post<{ message: string; plan: string }>('/upgrade')
  return data
}

export async function fetchProtectedRequest(): Promise<{
  message: string
  user: { id: number; email: string }
}> {
  const { data } = await apiClient.get('/protected')
  return data
}

export async function fetchHealthRequest(): Promise<{
  status: string
  services: Record<string, string>
}> {
  const { data } = await apiClient.get('/health')
  return data
}

export async function fetchDashboardRequest(): Promise<Record<string, unknown>> {
  const { data } = await apiClient.get('/dashboard')
  return data
}

export async function fetchApiKeysRequest(): Promise<Array<Record<string, unknown>>> {
  const { data } = await apiClient.get('/api-keys')
  return data
}

export async function createApiKeyRequest(name: string): Promise<Record<string, unknown>> {
  const { data } = await apiClient.post('/api-keys', { name })
  return data
}

export async function revokeApiKeyRequest(keyId: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete(`/api-keys/${keyId}`)
  return data
}

export async function fetchGatewayWeatherRequest(apiKey: string): Promise<Record<string, unknown>> {
  const { data } = await apiClient.get('/gateway/weather', {
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
