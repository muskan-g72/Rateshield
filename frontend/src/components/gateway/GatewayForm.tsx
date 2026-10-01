import { Button, Card, CardHeader, Input, Spinner } from '@/components/ui'
import { ApiKeySelector } from '@/components/gateway/ApiKeySelector'
import type { ApiKey } from '@/types/apiKeys'

interface GatewayFormProps {
  activeKeys: ApiKey[]
  selectedKeyId: number | null
  apiKey: string
  city: string
  isFetching: boolean
  onSelectKey: (keyId: number) => void
  onApiKeyChange: (value: string) => void
  onFetch: () => void
}

export function GatewayForm({
  activeKeys,
  selectedKeyId,
  apiKey,
  city,
  isFetching,
  onSelectKey,
  onApiKeyChange,
  onFetch,
}: GatewayFormProps) {
  const canFetch = Boolean(apiKey.trim()) && !isFetching

  return (
    <Card>
      <CardHeader
        title="Gateway Request"
        description="Send an authenticated request to GET /gateway/weather using your API key."
      />

      <div className="space-y-4">
        <ApiKeySelector
          activeKeys={activeKeys}
          selectedKeyId={selectedKeyId}
          apiKey={apiKey}
          onSelectKey={onSelectKey}
          onApiKeyChange={onApiKeyChange}
          disabled={isFetching}
        />

        <Input
          label="City"
          name="city"
          value={city}
          readOnly
          placeholder="Populated from weather response"
          hint="The current gateway endpoint proxies weather data from upstream. This reflects the city returned."
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="button" variant="primary" onClick={onFetch} disabled={!canFetch} isLoading={isFetching}>
            Fetch weather
          </Button>
          {isFetching ? (
            <span className="inline-flex items-center gap-2 text-xs font-mono text-muted">
              <Spinner size="sm" />
              Evaluating sliding window…
            </span>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
