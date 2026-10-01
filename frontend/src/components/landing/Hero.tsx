import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { LimiterSimulator } from '@/components/landing/LimiterSimulator'
import { useAuth } from '@/hooks/useAuth'

export function Hero() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none -z-10" />

      {/* 4 Drifting Ambient OK-colored Glow Dots (30s+ loops) */}
      <div className="absolute top-10 left-8 h-20 w-20 rounded-full bg-ok/10 blur-xl animate-drift-1 pointer-events-none -z-10" />
      <div className="absolute bottom-12 left-1/3 h-28 w-28 rounded-full bg-ok/10 blur-2xl animate-drift-2 pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-12 h-24 w-24 rounded-full bg-ok/10 blur-xl animate-drift-3 pointer-events-none -z-10" />
      <div className="absolute top-3/4 right-1/4 h-16 w-16 rounded-full bg-ok/10 blur-lg animate-drift-1 pointer-events-none -z-10" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Value Prop */}
        <div className="space-y-6 lg:col-span-6">
          <div className="space-y-3">
            <h1 className="reveal-hero-title font-display font-extrabold text-[clamp(3rem,8vw,6.5rem)] tracking-[-0.04em] leading-[0.9] text-ink">
              RateShield
            </h1>

            <div className="reveal-hero-subtitle font-display font-extrabold text-[clamp(1.5rem,3vw,2.25rem)] tracking-tight leading-[1.1]">
              <span className="block text-ok whitespace-normal lg:whitespace-nowrap">
                Let good traffic through.
              </span>
              <span className="block text-no">
                Stop the rest.
              </span>
            </div>
          </div>

          <p className="reveal-hero-body text-base sm:text-lg leading-relaxed text-muted font-normal max-w-xl">
            RateShield is an API gateway that checks each call against a Redis sliding window,
            so one key can't flood your service and honest traffic never waits.
          </p>

          <div className="reveal-hero-buttons flex flex-wrap items-center gap-3 pt-2">
            <Link to={isAuthenticated ? '/dashboard' : '/login'}>
              <Button size="lg" variant="primary">
                Open dashboard
              </Button>
            </Link>

            <a
              href="https://rateshield-k9s8.onrender.com/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary">
                Read the API docs
              </Button>
            </a>
          </div>
        </div>

        {/* Right Column: Live Limiter Simulator */}
        <div className="lg:col-span-6">
          <LimiterSimulator />
        </div>
      </div>
    </section>
  )
}
