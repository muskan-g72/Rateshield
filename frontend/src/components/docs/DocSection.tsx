import type { ReactNode } from 'react'

interface DocSectionProps {
  title: string
  children: ReactNode
}

export function DocSection({ title, children }: DocSectionProps) {
  return (
    <section className="space-y-2.5 rounded-[18px] border-2 border-line bg-surface p-6 sm:p-7 text-ink">
      <h2 className="text-lg sm:text-xl font-bold font-display text-ink tracking-tight">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
