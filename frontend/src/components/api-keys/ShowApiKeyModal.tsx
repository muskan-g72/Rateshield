import { useState } from 'react'
import { Alert, Button, Modal } from '@/components/ui'
import { saveApiKeySecret } from '@/lib/apiKeyStorage'

interface ShowApiKeyModalProps {
  isOpen: boolean
  apiKey: string | null
  keyName?: string
  keyId?: number
  onClose: () => void
}

export function ShowApiKeyModal({ isOpen, apiKey, keyName, keyId, onClose }: ShowApiKeyModalProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  async function handleCopy() {
    if (!apiKey) return

    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setCopyError('')
      window.setTimeout(() => setCopied(false), 3000)
    } catch {
      setCopied(false)
      setCopyError('Unable to copy automatically. Select and copy the key manually.')
    }
  }

  function handleClose() {
    if (apiKey && keyId) {
      saveApiKeySecret(keyId, apiKey)
    }
    setCopied(false)
    setCopyError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Save your API key"
      description={
        keyName
          ? `Your new key "${keyName}" was created successfully.`
          : 'Your new API key was created successfully.'
      }
      cancelLabel="Done"
      onClose={handleClose}
    >
      <div className="space-y-4">
        <Alert variant="warning">
          Copy this key now. For security reasons, it will not be shown again.
        </Alert>

        <div className="rounded-[12px] border-2 border-ink bg-bg p-3.5">
          <label className="block text-[11px] font-mono font-bold uppercase text-muted mb-1.5">
            Plaintext Secret
          </label>
          <code className="block break-all font-mono text-sm font-bold text-ink select-all">
            {apiKey}
          </code>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="primary" size="sm" onClick={() => void handleCopy()}>
            {copied ? 'Key copied' : 'Copy key'}
          </Button>
          {copied ? (
            <span className="text-xs font-mono font-semibold text-ok flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-ok" />
              Copied to clipboard
            </span>
          ) : null}
        </div>

        {copyError ? <Alert variant="error">{copyError}</Alert> : null}
      </div>
    </Modal>
  )
}
