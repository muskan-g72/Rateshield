import { useState, type FormEvent } from 'react'
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
      setFormError(getErrorMessage(error, 'Unable to create account. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="Create account"
      description="Register to manage API keys and monitor your gateway usage."
      footer={<AuthFooterLink prompt="Already have an account?" linkText="Sign in" to="/login" />}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {successMessage ? <Alert variant="success">{successMessage}</Alert> : null}
        {formError ? <Alert variant="error">{formError}</Alert> : null}

        <Input
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Developer"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          disabled={Boolean(successMessage)}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          disabled={Boolean(successMessage)}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          disabled={Boolean(successMessage)}
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          disabled={Boolean(successMessage)}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={Boolean(successMessage)}>
          Create account
        </Button>
      </div>
    </AuthCard>
  )
}
