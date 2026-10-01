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
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function openCreateModal() {
    clearActionError()
    setFeedbackMessage(null)
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
      setFeedbackMessage({ type: 'success', text: `Key created: "${name}"` })
      setCreatedKey({ id: created.id, name: created.name, apiKey: created.api_key })
    } catch {
      // Error surfaced via actionError in hook
    }
  }

  async function handleRevokeConfirm() {
    if (!keyToRevoke || isSubmitting) return

    const keyName = keyToRevoke.name
    try {
      await revokeKey(keyToRevoke.id)
      setKeyToRevoke(null)
      clearActionError()
      setFeedbackMessage({ type: 'success', text: `Key revoked: "${keyName}"` })
    } catch {
      // Error surfaced via actionError in hook
    }
  }

  if (isLoading) {
    return <ApiKeysSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-8">
        <Alert variant="error">{error}</Alert>
        <Button onClick={() => void loadKeys()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
            API Keys
          </h1>
          <p className="mt-1 text-sm text-muted">
            Create and manage secret keys used to authenticate gateway requests.
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary">
          Create key
        </Button>
      </div>

      {/* Action feedback notifications */}
      {feedbackMessage && !isCreateOpen && !keyToRevoke && (
        <Alert
          variant={feedbackMessage.type === 'success' ? 'success' : 'error'}
          className="transition-all"
        >
          {feedbackMessage.text}
        </Alert>
      )}

      {actionError && !isCreateOpen && !keyToRevoke ? (
        <Alert variant="error">{actionError}</Alert>
      ) : null}

      {/* Table or Empty State */}
      {keys.length === 0 ? (
        <EmptyState
          title="No API keys yet"
          description="Create your first API key to start sending authenticated requests through the gateway."
          action={<Button onClick={openCreateModal}>Create your first key</Button>}
        />
      ) : (
        <ApiKeyTable
          keys={keys}
          onRevoke={(key) => {
            clearActionError()
            setFeedbackMessage(null)
            setKeyToRevoke(key)
          }}
        />
      )}

      {/* Modals */}
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
