import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { ApiKey } from '@/types/apiKeys'

interface ApiKeySelectorProps {
  activeKeys: ApiKey[]
  selectedKeyId: number | null
  apiKey: string
  onSelectKey: (keyId: number) => void
  onApiKeyChange: (value: string) => void
  disabled?: boolean
}

export function ApiKeySelector({
  activeKeys,
  selectedKeyId,
  apiKey,
  onSelectKey,
  onApiKeyChange,
  disabled = false,
}: ApiKeySelectorProps) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')

  async function handleCopy() {
    if (!apiKey.trim()) {
      setCopyError('Enter an API key before copying.')
      return
    }

    try {
      await navigator.clipboard.writeText(apiKey.trim())
      setCopied(true)
      setCopyError('')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setCopyError('Unable to copy automatically.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="api-key-select" className="block text-sm font-semibold text-ink">
          Active API key
        </label>
        <select
          id="api-key-select"
          value={selectedKeyId ?? ''}
          onChange={(event) => onSelectKey(Number(event.target.value))}
          disabled={disabled || activeKeys.length === 0}
          className={cn(
            'w-full rounded-[10px] border-2 border-line bg-surface px-3.5 py-2.5 text-sm font-medium text-ink',
            'outline-none transition-colors duration-150',
            'focus:border-ok focus:ring-3 focus:ring-ok/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {activeKeys.map((key) => (
            <option key={key.id} value={key.id}>
              {key.name} (key_#{key.id})
            </option>
          ))}
        </select>
        <p className="text-xs text-muted">
          Keys are listed by name. The key secret will autofill if saved in your session.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="API key secret"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder="Paste your key secret"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            disabled={disabled}
            hint="Attached as the X-API-Key header to authenticate gateway proxy requests."
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="sm:mb-0.5 sm:shrink-0"
          onClick={() => void handleCopy()}
          disabled={disabled || !apiKey.trim()}
        >
          {copied ? 'Copied' : 'Copy secret'}
        </Button>
      </div>

      {copyError ? <p className="text-xs text-no font-semibold">{copyError}</p> : null}

      <p className="text-xs text-muted">
        Need another key?{' '}
        <Link to="/api-keys" className="font-bold text-ink underline hover:opacity-80">
          Manage API keys
        </Link>
      </p>
    </div>
  )
}
