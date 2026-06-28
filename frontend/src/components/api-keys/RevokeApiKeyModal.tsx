import { Modal } from '@/components/ui'
import type { ApiKey } from '@/types/apiKeys'

interface RevokeApiKeyModalProps {
  isOpen: boolean
  apiKey: ApiKey | null
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export function RevokeApiKeyModal({
  isOpen,
  apiKey,
  isLoading,
  onClose,
  onConfirm,
}: RevokeApiKeyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Revoke API key"
      description={
        apiKey
          ? `Are you sure you want to revoke "${apiKey.name}"? This key will immediately lose access to gateway endpoints.`
          : 'Are you sure you want to revoke this API key?'
      }
      confirmLabel="Revoke key"
      cancelLabel="Cancel"
      confirmVariant="danger"
      isLoading={isLoading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
