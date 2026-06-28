import { Alert, Card, CardHeader } from '@/components/ui'
import { formatJson } from '@/lib/utils'
import type { WeatherResponse } from '@/types/gateway'

interface WeatherResultProps {
  weather: WeatherResponse | null
  error: string | null
  isLoading: boolean
}

export function WeatherResult({ weather, error, isLoading }: WeatherResultProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Response" description="Waiting for the gateway to return weather data." />
        <pre className="rounded-lg border border-border bg-surface p-4 font-mono text-sm text-muted">
          Loading…
        </pre>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Response" description="The gateway returned an error for this request." />
        <Alert variant="error">{error}</Alert>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader
          title="Response"
          description="Weather data will appear here after a successful gateway request."
        />
        <pre className="rounded-lg border border-border bg-surface p-4 font-mono text-sm text-muted">
          No response yet. Select an API key and fetch weather to begin.
        </pre>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title="Response"
        description="Formatted JSON returned from GET /gateway/weather."
      />
      <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm leading-relaxed text-blue-200">
        {formatJson(weather)}
      </pre>
    </Card>
  )
}
