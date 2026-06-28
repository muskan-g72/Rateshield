import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthCard, AuthFooterLink } from '@/components/auth/AuthCard'
import { Alert, Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/types/api'
import { validateLoginForm } from '@/lib/validation'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const prefilledEmail =
    (location.state as { email?: string } | null)?.email ?? ''

  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')

    const validationErrors = validateLoginForm(email, password)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email: email.trim(), password })
      navigate(redirectPath, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to sign in. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      description="Access your RateShield dashboard with your account credentials."
      footer={<AuthFooterLink prompt="Don't have an account?" linkText="Register" to="/register" />}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {formError ? <Alert variant="error">{formError}</Alert> : null}

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </div>
    </AuthCard>
  )
}
