import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  title = 'No API keys yet',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-[18px] border-2 border-line bg-surface p-8 sm:p-12 text-center text-ink">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-bg font-mono text-xl font-bold">
        🔑
      </div>
      <h2 className="mt-4 font-display text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1.5 text-sm text-muted max-w-md mx-auto">{description}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
