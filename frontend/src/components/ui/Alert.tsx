import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type AlertVariant = 'success' | 'error' | 'info' | 'warning'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  children: ReactNode
}

const variantStyles: Record<AlertVariant, string> = {
  success: 'border-ok bg-ok-bg text-ok',
  error: 'border-no bg-no-bg text-no',
  info: 'border-line bg-surface text-ink',
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-300',
}

export function Alert({ variant = 'info', className, children, ...props }: AlertProps) {
  const isOk = variant === 'success'
  const isNo = variant === 'error'

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-[14px] border-2 p-3.5 text-sm font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {isOk && (
        <span
          className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full bg-ok shrink-0"
          aria-hidden="true"
        />
      )}
      {isNo && (
        <span
          className="mt-0.5 inline-block h-2.5 w-2.5 rotate-45 rounded-[1px] bg-no shrink-0"
          aria-hidden="true"
        />
      )}
      <div className="flex-1">{children}</div>
    </div>
  )
}
