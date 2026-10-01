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
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <Alert variant="error">{keysError}</Alert>
        <Button onClick={() => void reloadKeys()}>Try again</Button>
      </div>
    )
  }

  if (!hasActiveKeys) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
            Gateway
          </h1>
          <p className="mt-1 text-sm text-muted">
            Test authenticated requests against the protected rate-limited weather endpoint.
          </p>
        </div>

        <EmptyState
          title="No active API keys found"
          description="Create an active API key before testing gateway requests. Keys authenticate calls to protected upstream services."
          action={
            <Link to="/api-keys">
              <Button variant="primary">Create key</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
            Gateway Tester
          </h1>
          <p className="mt-1 text-sm text-muted">
            Test authenticated requests against the protected weather endpoint.
          </p>
        </div>
        <GatewayFormStatus requestState={requestState} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
