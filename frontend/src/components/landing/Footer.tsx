import { ShieldLogo } from '@/components/landing/ShieldLogo'

export function Footer() {
  return (
    <footer className="border-t-2 border-line bg-surface py-10 text-ink transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldLogo size={24} />
            <span className="text-xs text-muted">
              © 2026 RateShield — Secure API gateway with Redis-powered rate limiting.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-muted font-medium">
            <a
              href="https://github.com/muskan-g72/Rateshield"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink hover:underline"
            >
              GitHub Repository
            </a>
            <a
              href="https://rateshield-k9s8.onrender.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink hover:underline"
            >
              Swagger Docs
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
