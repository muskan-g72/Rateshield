import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DocSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function DocSection({ title, children, className }: DocSectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      {children}
    </section>
  )
}
