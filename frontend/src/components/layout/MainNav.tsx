import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface MainNavProps {
  onItemClick?: () => void
}

export function MainNav({ onItemClick }: MainNavProps) {
  const navLinkStyles =
    'rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ok'

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/api-keys', label: 'API Keys' },
    { to: '/gateway', label: 'Gateway' },
    { to: '/health', label: 'Health' },
    { to: '/docs', label: 'Docs' },
  ]

  return (
    <nav className="flex flex-wrap items-center gap-1.5" aria-label="Main navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              navLinkStyles,
              isActive
                ? 'bg-ink text-bg'
                : 'text-muted hover:bg-ink/5 hover:text-ink',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
