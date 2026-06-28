import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

interface AuthCardProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthCard({ title, description, children, footer, onSubmit }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">{title}</h1>
          <p className="text-sm text-muted">{description}</p>
        </div>

        {onSubmit ? <form onSubmit={onSubmit}>{children}</form> : children}

        {footer ? <div className="mt-6 border-t border-border pt-4 text-sm text-muted">{footer}</div> : null}
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
      <Link to={to} className="font-medium text-primary hover:text-primary-hover">
        {linkText}
      </Link>
    </p>
  )
}
