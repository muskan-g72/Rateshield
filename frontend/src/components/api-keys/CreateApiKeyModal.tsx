import { useState } from 'react'
import { Alert, Input, Modal } from '@/components/ui'

interface CreateApiKeyModalProps {
  isOpen: boolean
  isLoading: boolean
  error?: string | null
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

export function CreateApiKeyModal({
  isOpen,
  isLoading,
  error,
  onClose,
  onCreate,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState('')
  const [validationError, setValidationError] = useState('')

  function handleClose() {
    if (isLoading) return
    setName('')
    setValidationError('')
    onClose()
  }

  async function handleConfirm() {
    if (isLoading) return

    const trimmedName = name.trim()

    if (!trimmedName) {
      setValidationError('Key name is required')
      return
    }

    if (trimmedName.length < 2) {
      setValidationError('Key name must be at least 2 characters')
      return
    }

    setValidationError('')
    await onCreate(trimmedName)
    setName('')
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create API Key"
      description="Give your key a descriptive name so you can identify it later."
      confirmLabel="Create key"
      cancelLabel="Cancel"
      isLoading={isLoading}
      onClose={handleClose}
      onConfirm={() => void handleConfirm()}
    >
      <div className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}

        <Input
          label="Key name"
          name="name"
          placeholder="Production app"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={validationError}
          disabled={isLoading}
          autoFocus
        />
      </div>
    </Modal>
  )
}
