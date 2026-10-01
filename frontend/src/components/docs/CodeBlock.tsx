import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface CodeBlockProps {
  code: string
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative mt-3 rounded-[12px] border-2 border-line bg-surface p-4 text-ink">
      <div className="absolute right-3 top-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => void handleCopy()}
          className="text-xs px-2.5 py-1"
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="overflow-x-auto pr-16 font-mono text-xs sm:text-sm leading-relaxed text-ink">
        <code>{code}</code>
      </pre>
    </div>
  )
}
