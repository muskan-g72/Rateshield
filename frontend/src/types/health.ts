export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded' | 'starting' | 'unavailable'

export interface HealthServicesMap {
  database: HealthStatus
  redis: HealthStatus
  weather_service: HealthStatus
  database_detail?: string
  redis_detail?: string
  weather_service_detail?: string
  [key: string]: unknown
}

export interface HealthResponse {
  status: HealthStatus
  services: HealthServicesMap
}

export interface HealthServiceDefinition {
  key: 'database' | 'redis' | 'weather_service'
  label: string
  subtitle: string
}

export const HEALTH_SERVICES: HealthServiceDefinition[] = [
  { key: 'database', label: 'Database', subtitle: 'PostgreSQL' },
  { key: 'redis', label: 'Redis', subtitle: 'Rate limiting and analytics' },
  { key: 'weather_service', label: 'Weather Service', subtitle: 'Upstream proxy target' },
]

export function formatHealthTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date)
}
