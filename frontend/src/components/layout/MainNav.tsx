import { NavLink } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  protected?: boolean
  public?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', protected: true },
  { label: 'API Keys', to: '/api-keys', protected: true },
  { label: 'Gateway', to: '/gateway', protected: true },
  { label: 'Health', to: '/health', protected: true },
  { label: 'Docs', to: '/docs', public: true },
]

const navLinkStyles =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150'

export function MainNav() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
      {navItems.map((item) => {
        const isEnabled = item.public || (item.protected && isAuthenticated)

        if (isEnabled) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  navLinkStyles,
                  isActive
                    ? 'bg-primary/15 text-blue-200'
                    : 'text-muted hover:bg-white/5 hover:text-slate-100',
                )
              }
            >
              {item.label}
            </NavLink>
          )
        }

        return (
          <span
            key={item.to}
            aria-disabled="true"
            title="Sign in to access"
            className={cn(navLinkStyles, 'cursor-not-allowed text-muted/50')}
          >
            {item.label}
          </span>
        )
      })}
    </nav>
  )
}
