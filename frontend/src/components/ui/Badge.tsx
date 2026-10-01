import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'ok' | 'success' | 'no' | 'danger' | 'default' | 'info' | 'warning'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  showMarker?: boolean
  children: ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  ok: 'bg-ok-bg text-ok border-ok',
  success: 'bg-ok-bg text-ok border-ok',
  no: 'bg-no-bg text-no border-no',
  danger: 'bg-no-bg text-no border-no',
  default: 'bg-surface text-ink border-line',
  info: 'bg-surface text-ink border-line',
  warning: 'bg-warning/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
}

export function Badge({
  variant = 'default',
  showMarker = true,
  className,
  children,
  ...props
}: BadgeProps) {
  const isOk = variant === 'ok' || variant === 'success'
  const isNo = variant === 'no' || variant === 'danger'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {showMarker && isOk && (
        <span
          className="inline-block h-2 w-2 rounded-full bg-ok shrink-0"
          aria-hidden="true"
        />
      )}
      {showMarker && isNo && (
        <span
          className="inline-block h-2 w-2 rotate-45 rounded-[1.5px] bg-no shrink-0"
          aria-hidden="true"
        />
      )}
      {showMarker && !isOk && !isNo && variant === 'warning' && (
        <span
          className="inline-block h-2 w-2 rounded-full bg-amber-500 shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  )
}
