import { Outlet, NavLink } from 'react-router-dom'
import { Badge, Button } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Home', end: true },
]

export function AppLayout() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-3 text-slate-100">
            <span className="text-2xl" aria-hidden="true">
              🛡️
            </span>
            <span>
              <span className="block text-sm font-bold leading-none">RateShield</span>
              <span className="block text-xs text-muted">API Gateway</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/15 text-blue-200'
                      : 'text-muted hover:bg-white/5 hover:text-slate-100',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Badge variant="success">Authenticated</Badge>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Badge variant="default">Guest</Badge>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        RateShield — API Gateway with rate limiting
      </footer>
    </div>
  )
}
