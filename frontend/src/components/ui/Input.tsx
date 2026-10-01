import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-[10px] border-2 border-line bg-surface px-3.5 py-2.5 text-sm text-ink',
          'placeholder:text-muted/60 outline-none transition-all duration-150',
          'focus:border-ok focus:ring-3 focus:ring-ok/20',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error ? 'border-no focus:border-no focus:ring-no/20' : null,
          className,
        )}
        {...props}
      />

      {error ? <p className="text-xs font-semibold text-no">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
})
