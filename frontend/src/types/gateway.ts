export interface WeatherResponse {
  city: string
  temperature: string
  condition: string
}

export type GatewayRequestState = 'idle' | 'loading' | 'success' | 'error'
