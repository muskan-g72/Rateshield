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
        <label htmlFor="api-key-select" className="block text-sm font-medium text-slate-200">
          Active API key
        </label>
        <select
          id="api-key-select"
          value={selectedKeyId ?? ''}
          onChange={(event) => onSelectKey(Number(event.target.value))}
          disabled={disabled || activeKeys.length === 0}
          className={cn(
            'w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-slate-100',
            'outline-none transition-colors duration-150',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {activeKeys.map((key) => (
            <option key={key.id} value={key.id}>
              {key.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted">
          Keys are listed by name. Paste the secret below if it was not stored in this session.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="API key secret"
            name="apiKey"
            type="password"
            autoComplete="off"
            placeholder="Paste your API key"
            value={apiKey}
            onChange={(event) => onApiKeyChange(event.target.value)}
            disabled={disabled}
            hint="Only shown once at creation. Stored in this browser session if created here."
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="md"
          className="sm:mb-0 sm:shrink-0"
          onClick={() => void handleCopy()}
          disabled={disabled || !apiKey.trim()}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      {copyError ? <p className="text-sm text-red-300">{copyError}</p> : null}

      <p className="text-xs text-muted">
        Need a new key?{' '}
        <Link to="/api-keys" className="font-medium text-primary hover:text-primary-hover">
          Manage API keys
        </Link>
      </p>
    </div>
  )
}
