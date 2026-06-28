import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  className?: string
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm leading-relaxed text-blue-200',
        className,
      )}
    >
      {code}
    </pre>
  )
}
