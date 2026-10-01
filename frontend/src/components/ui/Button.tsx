import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-ink text-bg border-2 border-transparent hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:hover:opacity-50 disabled:hover:translate-y-0',
  secondary:
    'bg-transparent text-ink border-2 border-ink hover:bg-ink/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:hover:bg-transparent disabled:hover:translate-y-0',
  ghost:
    'bg-transparent text-muted hover:text-ink hover:bg-ink/5 border-2 border-transparent hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:hover:translate-y-0',
  danger:
    'bg-no text-bg border-2 border-transparent hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:hover:translate-y-0',
  'outline-danger':
    'bg-transparent text-no border-2 border-no hover:bg-no-bg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:hover:translate-y-0',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1 text-xs sm:text-sm font-semibold',
  md: 'px-5 py-2 text-sm font-semibold',
  lg: 'px-6 py-2.5 text-base font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ok',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  )
})
