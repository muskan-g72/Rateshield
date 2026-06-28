export type HealthStatus = 'healthy' | 'unhealthy'

export interface HealthResponse {
  status: HealthStatus
  services: {
    database: HealthStatus
    redis: HealthStatus
    weather_service: HealthStatus
  }
}

export interface HealthServiceDefinition {
  key: keyof HealthResponse['services']
  label: string
}

export const HEALTH_SERVICES: HealthServiceDefinition[] = [
  { key: 'database', label: 'Database' },
  { key: 'redis', label: 'Redis' },
  { key: 'weather_service', label: 'Weather Service' },
]

export function formatHealthTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date)
}
