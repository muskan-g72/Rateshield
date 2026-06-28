import { useState } from 'react'
import {
  ApiKeyTable,
  ApiKeysSkeleton,
  CreateApiKeyModal,
  EmptyState,
  RevokeApiKeyModal,
  ShowApiKeyModal,
} from '@/components/api-keys'
import { Alert, Button } from '@/components/ui'
import { useApiKeys } from '@/hooks/useApiKeys'
import { saveApiKeySecret, setLastGatewayApiKey } from '@/lib/apiKeyStorage'
import type { ApiKey } from '@/types/apiKeys'

export function ApiKeysPage() {
  const {
    keys,
    isLoading,
    error,
    actionError,
    isSubmitting,
    loadKeys,
    createKey,
    revokeKey,
    clearActionError,
  } = useApiKeys()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState<{ id: number; name: string; apiKey: string } | null>(
    null,
  )
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null)

  function openCreateModal() {
    clearActionError()
    setIsCreateOpen(true)
  }

  async function handleCreate(name: string) {
    if (isSubmitting) return

    try {
      const created = await createKey(name)
      saveApiKeySecret(created.id, created.api_key)
      setLastGatewayApiKey(created.api_key)
      setIsCreateOpen(false)
      clearActionError()
      setCreatedKey({ id: created.id, name: created.name, apiKey: created.api_key })
    } catch {
      // Error surfaced via actionError in hook
    }
  }

  async function handleRevokeConfirm() {
    if (!keyToRevoke || isSubmitting) return

    try {
      await revokeKey(keyToRevoke.id)
      setKeyToRevoke(null)
      clearActionError()
    } catch {
      // Error surfaced via actionError in hook
    }
  }

  if (isLoading) {
    return <ApiKeysSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <Alert variant="error">{error}</Alert>
        <Button onClick={() => void loadKeys()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">API Keys</h1>
          <p className="mt-1 text-sm text-muted">
            Create and manage keys used to authenticate gateway requests.
          </p>
        </div>
        <Button onClick={openCreateModal}>Create API Key</Button>
      </div>

      {actionError && !isCreateOpen && !keyToRevoke ? (
        <Alert variant="error">{actionError}</Alert>
      ) : null}

      {keys.length === 0 ? (
        <EmptyState
          title="No API keys yet"
          description="Create your first API key to start sending authenticated requests through the gateway."
          action={<Button onClick={openCreateModal}>Create API Key</Button>}
        />
      ) : (
        <ApiKeyTable
          keys={keys}
          onRevoke={(key) => {
            clearActionError()
            setKeyToRevoke(key)
          }}
        />
      )}

      <CreateApiKeyModal
        isOpen={isCreateOpen}
        isLoading={isSubmitting}
        error={actionError}
        onClose={() => {
          setIsCreateOpen(false)
          clearActionError()
        }}
        onCreate={handleCreate}
      />

      <ShowApiKeyModal
        isOpen={Boolean(createdKey)}
        apiKey={createdKey?.apiKey ?? null}
        keyName={createdKey?.name}
        keyId={createdKey?.id}
        onClose={() => setCreatedKey(null)}
      />

      <RevokeApiKeyModal
        isOpen={Boolean(keyToRevoke)}
        apiKey={keyToRevoke}
        isLoading={isSubmitting}
        onClose={() => {
          setKeyToRevoke(null)
          clearActionError()
        }}
        onConfirm={() => void handleRevokeConfirm()}
      />
    </div>
  )
}
