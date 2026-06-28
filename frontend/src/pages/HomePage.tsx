import { Badge, Button, Card, CardHeader } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Badge variant="info">Phase 1 Foundation</Badge>
        <h1 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
          RateShield Developer Dashboard
        </h1>
        <p className="max-w-2xl text-base text-muted">
          A production-style API gateway frontend built with React, TypeScript, Tailwind CSS,
          and Axios. Authentication pages and feature modules will be added in upcoming phases.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader
            title="React Router"
            description="Client-side routing configured and ready for feature pages."
          />
        </Card>
        <Card>
          <CardHeader
            title="Axios Client"
            description="API client configured with JWT interceptors and environment variables."
          />
        </Card>
        <Card>
          <CardHeader
            title="Auth Context"
            description="Token storage and login/logout state management are in place."
          />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Session status"
          description="Authentication UI will be implemented in Phase 2."
          action={
            isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : null
          }
        />
        <p className="text-sm text-muted">
          Current status:{' '}
          <span className="font-medium text-slate-200">
            {isAuthenticated ? 'JWT token stored locally' : 'Not authenticated'}
          </span>
        </p>
      </Card>
    </div>
  )
}
