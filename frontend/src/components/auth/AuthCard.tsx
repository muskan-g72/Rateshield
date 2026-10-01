import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ShieldLogo } from '@/components/landing/ShieldLogo'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthCard({ title, description, children, footer, onSubmit }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md py-8 sm:py-12">
      <Card className="p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <ShieldLogo size={36} className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-display">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted max-w-xs">{description}</p>
        </div>

        {onSubmit ? <form onSubmit={onSubmit}>{children}</form> : children}

        {footer ? (
          <div className="mt-6 border-t-2 border-line pt-4 text-center text-xs text-muted">
            {footer}
          </div>
        ) : null}
      </Card>
    </div>
  )
}

interface AuthFooterLinkProps {
  prompt: string
  linkText: string
  to: string
}

export function AuthFooterLink({ prompt, linkText, to }: AuthFooterLinkProps) {
  return (
    <p>
      {prompt}{' '}
      <Link
        to={to}
        className="font-bold text-ink underline hover:opacity-80 transition-opacity"
      >
        {linkText}
      </Link>
    </p>
  )
}
