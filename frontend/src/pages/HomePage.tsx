import { Link } from 'react-router-dom'
import { Button, Card, CardHeader } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div>
      <section className="space-y-2.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
          RateShield Developer Dashboard
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Manage API keys, monitor gateway traffic, and test protected endpoints from a
          single developer-focused control panel.
        </p>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader
            title="Usage analytics"
            description="Track total, approved, and blocked requests with success rate metrics."
          />
        </Card>
        <Card>
          <CardHeader
            title="API key management"
            description="Create, list, and revoke keys tied to your account."
          />
        </Card>
        <Card>
          <CardHeader
            title="Gateway testing"
            description="Send authenticated requests to protected upstream services."
          />
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Session"
          description={
            isAuthenticated
              ? 'You are signed in and can access protected routes.'
              : 'Sign in to access your dashboard.'
          }
          action={
            isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign in</Button>
              </Link>
            )
          }
        />
        <p className="text-sm text-muted">
          {isAuthenticated ? (
            <>
              Status:{' '}
              <span className="font-medium text-slate-200">
                Signed in as {user?.email}
              </span>
            </>
          ) : (
            <>
              Status:{' '}
              <span className="font-medium text-slate-200">Not signed in</span>
              <span className="mt-1 block text-xs">
                Sign in to view your dashboard, manage API keys, and monitor gateway health.
              </span>
            </>
          )}
        </p>
      </Card>
    </div>
  )
}
