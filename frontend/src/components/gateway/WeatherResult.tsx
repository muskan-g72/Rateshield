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
        <CardHeader title="Response payload" description="Waiting for the gateway to return weather data." />
        <pre className="rounded-[12px] border-2 border-line bg-bg p-4 font-mono text-xs sm:text-sm text-muted">
          Evaluating Redis sliding window…
        </pre>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Response error" description="The gateway returned an error or 429 quota block for this request." />
        <Alert variant="error">{error}</Alert>
      </Card>
    )
  }

  if (!weather) {
    return (
      <Card>
        <CardHeader
          title="Response payload"
          description="Weather data will appear here after a successful gateway request."
        />
        <pre className="rounded-[12px] border-2 border-line bg-bg p-4 font-mono text-xs sm:text-sm text-muted">
          No response yet. Select an active API key and fetch weather to test.
        </pre>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title="200 OK Response"
        description="Formatted JSON returned from GET /gateway/weather."
      />
      <pre className="overflow-x-auto rounded-[12px] border-2 border-ok/40 bg-ok-bg/15 p-4 font-mono text-xs sm:text-sm leading-relaxed text-ink">
        {formatJson(weather)}
      </pre>
    </Card>
  )
}
