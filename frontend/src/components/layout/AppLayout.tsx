import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ShieldLogo } from '@/components/landing/ShieldLogo'
import { MainNav } from '@/components/layout/MainNav'
import { Footer } from '@/components/landing/Footer'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isHomePage = location.pathname === '/'

  function handleLogout() {
    logout()
    setMobileMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink selection:bg-ok-bg selection:text-ok transition-colors duration-150">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b-2 border-line bg-surface/95 backdrop-blur-md transition-colors duration-150">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand / Logo */}
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2.5 text-ink transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ok rounded-lg p-1"
          >
            <ShieldLogo size={32} />
            <span className="font-display text-[26px] font-extrabold tracking-tight text-ink leading-none">
              RateShield
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <MainNav />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2.5">
                <span className="max-w-[160px] truncate text-xs font-mono font-medium text-muted">
                  {user?.email}
                </span>
                {!isHomePage && (
                  <NavLink to="/dashboard">
                    <Button size="sm" variant="secondary">
                      Dashboard
                    </Button>
                  </NavLink>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <NavLink to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </NavLink>
                <NavLink to="/dashboard">
                  <Button variant="primary" size="sm">
                    Open dashboard
                  </Button>
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-line bg-surface text-ink hover:border-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ok"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-line bg-surface px-4 pt-3 pb-5 space-y-3">
            <MainNav onItemClick={() => setMobileMenuOpen(false)} />

            <div className="border-t border-line pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="text-xs font-mono text-muted truncate px-1">
                    Signed in as {user?.email}
                  </div>
                  <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" size="sm">
                      Open dashboard
                    </Button>
                  </NavLink>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </NavLink>
                  <NavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Create account
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
