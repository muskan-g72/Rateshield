import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-12 text-center">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  )
}
