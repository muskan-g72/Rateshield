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
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-200">
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-slate-100',
          'placeholder:text-muted/70 outline-none transition-colors',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : null,
          className,
        )}
        {...props}
      />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {!error && hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
})
