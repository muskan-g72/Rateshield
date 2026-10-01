import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button, type ButtonVariant } from '@/components/ui/Button'

export interface ModalProps {
  isOpen: boolean
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: ButtonVariant
  isLoading?: boolean
  onConfirm?: () => void
  onClose: () => void
}

export function Modal({
  isOpen,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
  onConfirm,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full max-w-md rounded-[20px] border-2 border-line bg-surface p-6',
          'text-ink shadow-2xl transition-all duration-150',
        )}
      >
        <h2 id="modal-title" className="text-xl font-bold font-display tracking-tight text-ink">
          {title}
        </h2>

        {description ? <p className="mt-1.5 text-sm text-muted">{description}</p> : null}

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          {onConfirm ? (
            <Button
              variant={confirmVariant}
              size="sm"
              onClick={() => {
                if (isLoading) return
                onConfirm()
              }}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {confirmLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
