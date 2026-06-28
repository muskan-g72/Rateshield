import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/api-keys/EmptyState'
import { ApiKeysSkeleton } from '@/components/api-keys/ApiKeysSkeleton'
import { GatewayForm, GatewayFormStatus, WeatherResult } from '@/components/gateway'
import { Alert, Button } from '@/components/ui'
import { useGateway } from '@/hooks/useGateway'

export function GatewayPage() {
  const {
    activeKeys,
    keysLoading,
    keysError,
    hasActiveKeys,
    selectedKeyId,
    apiKey,
    city,
    weather,
    requestState,
    fetchError,
    isFetching,
    setApiKey,
    selectKey,
    fetchWeather,
    reloadKeys,
  } = useGateway()

  if (keysLoading) {
    return <ApiKeysSkeleton />
  }

  if (keysError) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert variant="error">{keysError}</Alert>
        <Button onClick={() => void reloadKeys()}>Try again</Button>
      </div>
    )
  }

  if (!hasActiveKeys) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Gateway</h1>
          <p className="mt-1 text-sm text-muted">
            Test authenticated requests against the protected weather endpoint.
          </p>
        </div>

        <EmptyState
          title="No active API keys"
          description="Create an active API key before testing gateway requests. Keys authenticate calls to protected upstream services."
          action={
            <Link to="/api-keys">
              <Button>Go to API Keys</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Gateway</h1>
          <p className="mt-1 text-sm text-muted">
            Test authenticated requests against the protected weather endpoint.
          </p>
        </div>
        <GatewayFormStatus requestState={requestState} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GatewayForm
          activeKeys={activeKeys}
          selectedKeyId={selectedKeyId}
          apiKey={apiKey}
          city={city}
          isFetching={isFetching}
          onSelectKey={selectKey}
          onApiKeyChange={setApiKey}
          onFetch={() => void fetchWeather()}
        />

        <WeatherResult weather={weather} error={fetchError} isLoading={isFetching} />
      </div>
    </div>
  )
}
