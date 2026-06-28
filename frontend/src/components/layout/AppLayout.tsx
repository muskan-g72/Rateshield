import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { MainNav } from '@/components/layout/MainNav'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <NavLink
            to="/"
            className="group flex items-center gap-4 text-slate-100 transition-opacity duration-150 hover:opacity-90"
          >
            <span className="text-[1.75rem] leading-none" aria-hidden="true">
              🛡️
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight tracking-tight">
                RateShield
              </span>
              <span className="block text-xs text-muted">API Gateway</span>
            </span>
          </NavLink>

          <MainNav />

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden max-w-[180px] truncate text-sm text-muted sm:block">
                  {user?.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-primary/15 text-blue-200'
                        : 'text-muted hover:bg-white/5 hover:text-slate-100',
                    )
                  }
                >
                  Login
                </NavLink>
                <NavLink to="/register">
                  <Button size="sm">Register</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-4 sm:px-6">
        <Outlet />
      </main>

      <footer
        className={cn(
          'mt-auto border-t border-border/60 py-2.5 text-center text-xs text-muted/70',
        )}
      >
        RateShield — API Gateway with rate limiting
      </footer>
    </div>
  )
}
