import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerRequest } from '@/api/endpoints'
import { AuthCard, AuthFooterLink } from '@/components/auth/AuthCard'
import { Alert, Button, Input } from '@/components/ui'
import { getErrorMessage } from '@/types/api'
import { validateRegisterForm } from '@/lib/validation'

export function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    setSuccessMessage('')

    const validationErrors = validateRegisterForm(name, email, password, confirmPassword)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await registerRequest({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      setSuccessMessage(`${response.message}. Redirecting to sign in…`)

      window.setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { email: email.trim() },
        })
      }, 1500)
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Create account"
      description="Register to generate API keys, manage rate limits, and test endpoints."
      footer={<AuthFooterLink prompt="Already have an account?" linkText="Sign in" to="/login" />}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
        {formError ? <Alert variant="error">{formError}</Alert> : null}
        {isWakingUp && !formError && !successMessage ? (
          <Alert variant="info">
            Waking up the server... Render free tier may take up to 50 seconds to cold start.
          </Alert>
        ) : null}

        <Input
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Alex Chen"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
          }}
          error={errors.name}
          disabled={Boolean(successMessage)}
          autoFocus
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="alex@company.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
          }}
          error={errors.email}
          disabled={Boolean(successMessage)}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
          }}
          error={errors.password}
          disabled={Boolean(successMessage)}
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }))
          }}
          error={errors.confirmPassword}
          disabled={Boolean(successMessage)}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isSubmitting}
          disabled={Boolean(successMessage)}
        >
          Create account
        </Button>
      </div>
    </AuthCard>
  )
}
