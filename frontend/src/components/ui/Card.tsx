import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isHero?: boolean
}

export function Card({ children, className, isHero = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[18px] border-2 border-line bg-surface p-5 sm:p-6 text-ink transition-colors duration-150',
        isHero && 'border-ink shadow-hero',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: ReactNode
}

export function CardHeader({ title, description, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-4', className)} {...props}>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-ink font-display">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
