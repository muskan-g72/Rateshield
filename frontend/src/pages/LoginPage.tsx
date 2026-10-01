import { useState, useEffect, type FormEvent } from 'react'
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
  const [isWakingUp, setIsWakingUp] = useState(false)

  useEffect(() => {
    let timer: number
    if (isSubmitting) {
      timer = window.setTimeout(() => setIsWakingUp(true), 2500)
    } else {
      setIsWakingUp(false)
    }
    return () => window.clearTimeout(timer)
  }, [isSubmitting])

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
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      description="Access your RateShield dashboard and API key control panel."
      footer={<AuthFooterLink prompt="Don't have an account?" linkText="Create an account" to="/register" />}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {formError ? <Alert variant="error">{formError}</Alert> : null}
        {isWakingUp && !formError ? (
          <Alert variant="info">
            Waking up the server... Render free tier may take up to 50 seconds to cold start.
          </Alert>
        ) : null}

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
          }}
          error={errors.email}
          autoFocus
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your account password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
          }}
          error={errors.password}
        />

        <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isSubmitting}>
          Sign in
        </Button>
      </div>
    </AuthCard>
  )
}
