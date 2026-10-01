import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function RequestPath() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setHasRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      num: 1,
      title: 'Sign in',
      detail: 'JWT bearer authentication',
      description: 'Log in with credentials to receive a signed JWT access token for session management.',
      isHighlighted: false,
      delayMs: 100,
    },
    {
      num: 2,
      title: 'Create a key',
      detail: 'SHA-256 hash storage',
      description: 'Generate API keys for your applications. The plaintext key is shown once; only its hash is stored.',
      isHighlighted: false,
      delayMs: 250,
    },
    {
      num: 3,
      title: 'Call the gateway',
      detail: 'X-API-Key header',
      description: 'Your application sends upstream calls to the gateway attaching the secret API key in headers.',
      isHighlighted: false,
      delayMs: 400,
    },
    {
      num: 4,
      title: 'Window check',
      detail: 'Redis sliding window',
      description: 'Redis counts calls in the sliding window. Allowed traffic passes instantly; exceeding quota returns 429.',
      isHighlighted: true,
      delayMs: 550,
    },
    {
      num: 5,
      title: 'See the result',
      detail: 'Real-time dashboard',
      description: 'Inspect live analytics, approved vs. blocked ratios, and success rates on your control panel.',
      isHighlighted: false,
      delayMs: 700,
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="request-path"
      className="py-12 sm:py-16 border-t-2 border-line scroll-mt-20"
    >
      <div className="space-y-4 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink font-display">
          What happens to one request.
        </h2>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          From incoming HTTP invocation to Redis sliding window atomic verification and dashboard telemetry.
        </p>
      </div>

      {/* Steps List / Flow */}
      <div className="mt-8 relative">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                transitionDelay: hasRevealed ? `${step.delayMs}ms` : '0ms',
              }}
              className={cn(
                'relative flex flex-col justify-between rounded-[18px] border-2 p-5 transition-all duration-500 ease-out',
                hasRevealed
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-6 scale-95',
                step.isHighlighted
                  ? 'border-ok bg-ok-bg/30 text-ink ring-2 ring-ok/30'
                  : 'border-line bg-surface text-ink',
              )}
            >
              <div>
                {/* Step header with Number Pill that scales in */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    style={{
                      transitionDelay: hasRevealed ? `${step.delayMs + 100}ms` : '0ms',
                    }}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full font-mono font-bold text-sm border-2 transition-all duration-300 ease-out',
                      hasRevealed ? 'scale-100' : 'scale-0',
                      step.isHighlighted
                        ? 'border-ok bg-ok text-white'
                        : 'border-ink bg-bg text-ink',
                    )}
                  >
                    {step.num}
                  </div>
                  {step.isHighlighted && (
                    <span className="rounded-full bg-ok px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                      Core Gateway
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold font-display text-ink tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-xs font-mono font-semibold text-muted">
                  {step.detail}
                </p>

                <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {step.isHighlighted && (
                <div className="mt-4 pt-3 border-t border-ok/30 text-[11px] font-mono font-semibold text-ok flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                  Atomic Redis EVAL
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
