import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AlertVariant = 'success' | 'error' | 'info' | 'warning'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  children: ReactNode
}

const variantStyles: Record<AlertVariant, string> = {
  success: 'border-success/30 bg-success/10 text-green-300',
  error: 'border-danger/30 bg-danger/10 text-red-300',
  info: 'border-primary/30 bg-primary/10 text-blue-200',
  warning: 'border-warning/30 bg-warning/10 text-amber-200',
}

export function Alert({ variant = 'info', className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
