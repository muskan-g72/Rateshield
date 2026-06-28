const LAST_API_KEY_STORAGE_KEY = 'rateshield_gateway_last_api_key'
const API_KEY_SECRETS_STORAGE_KEY = 'rateshield_api_key_secrets'

type ApiKeySecretMap = Record<string, string>

function readSecretMap(): ApiKeySecretMap {
  try {
    const raw = sessionStorage.getItem(API_KEY_SECRETS_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ApiKeySecretMap
  } catch {
    return {}
  }
}

function writeSecretMap(map: ApiKeySecretMap) {
  sessionStorage.setItem(API_KEY_SECRETS_STORAGE_KEY, JSON.stringify(map))
}

export function getLastGatewayApiKey(): string {
  return sessionStorage.getItem(LAST_API_KEY_STORAGE_KEY) ?? ''
}

export function setLastGatewayApiKey(apiKey: string) {
  sessionStorage.setItem(LAST_API_KEY_STORAGE_KEY, apiKey)
}

export function getStoredApiKeySecret(keyId: number): string | null {
  const map = readSecretMap()
  return map[String(keyId)] ?? null
}

export function saveApiKeySecret(keyId: number, apiKey: string) {
  const map = readSecretMap()
  map[String(keyId)] = apiKey
  writeSecretMap(map)
}
