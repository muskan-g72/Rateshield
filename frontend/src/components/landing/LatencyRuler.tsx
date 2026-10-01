import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function LatencyRuler() {
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

  return (
    <section
      ref={sectionRef}
      id="load-test"
      className="py-12 sm:py-16 border-t-2 border-line scroll-mt-20"
    >
      <div className="space-y-4 w-full max-w-none">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink font-display">
          Held steady under 50 users.
        </h2>
        <p className="w-full max-w-none text-sm sm:text-base text-muted leading-relaxed">
          Tested under high concurrency with automated locust load generation. RateShield maintains
          sub-second gateway proxy latencies while strictly enforcing quota boundaries.
        </p>
      </div>

      {/* Latency Ruler Card */}
      <div className="mt-8 rounded-[18px] border-2 border-line bg-surface p-6 sm:p-8 text-ink">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b-2 border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ok" aria-hidden="true" />
            <h3 className="font-bold font-display text-base sm:text-lg text-ink">
              Gateway response latency distribution
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-muted">
            0ms – 700ms benchmark
          </span>
        </div>

        {/* Ruler Container */}
        <div
          className="relative mt-16 mb-16 pt-2 pb-2"
          role="region"
          aria-label="Latency distribution ruler from 0 to 700 milliseconds: Median 180ms, Average 204ms, p95 460ms, p99 640ms"
        >
          {/* Top Labels: Median (180ms) and p95 (460ms) */}
          <div className="absolute -top-12 inset-x-0 h-10 pointer-events-none">
            {/* Median: 180ms / 700ms = 25.7% (Drops in at ~800ms) */}
            <div
              className={cn(
                'absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out',
                hasRevealed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4',
              )}
              style={{
                left: '25.71%',
                transitionDelay: hasRevealed ? '800ms' : '0ms',
              }}
            >
              <span className="rounded-full bg-ok px-2.5 py-0.5 text-[11px] font-mono font-bold text-white shadow-xs">
                Median 180 ms
              </span>
              <div className="h-4 w-0.5 bg-ink mt-0.5" />
            </div>

            {/* p95: 460ms / 700ms = 65.7% (Drops in at ~1000ms) */}
            <div
              className={cn(
                'absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out',
                hasRevealed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-4',
              )}
              style={{
                left: '65.71%',
                transitionDelay: hasRevealed ? '1000ms' : '0ms',
              }}
            >
              <span className="rounded-full bg-no px-2.5 py-0.5 text-[11px] font-mono font-bold text-white shadow-xs">
                p95 460 ms
              </span>
              <div className="h-4 w-0.5 bg-ink mt-0.5" />
            </div>
          </div>

          {/* The Horizontal Latency Bar (fills over 800ms) */}
          <div className="relative h-6 w-full overflow-hidden rounded-full border-2 border-ink bg-bg flex">
            {/* 65% green zone */}
            <div
              className="h-full bg-ok transition-all duration-800 ease-out flex items-center justify-end pr-2 overflow-hidden"
              style={{ width: hasRevealed ? '65.71%' : '0%' }}
            >
              <span className="text-[10px] font-mono font-black text-white/80 uppercase">
                Optimal
              </span>
            </div>

            {/* 35% coral zone */}
            <div
              className="h-full bg-no transition-all duration-800 ease-out flex items-center justify-end pr-2 overflow-hidden"
              style={{
                width: hasRevealed ? '34.29%' : '0%',
                transitionDelay: hasRevealed ? '400ms' : '0ms',
              }}
            >
              <span className="text-[10px] font-mono font-black text-white/80 uppercase">
                Tail
              </span>
            </div>
          </div>

          {/* Bottom Labels: Average (204ms) and p99 (640ms) */}
          <div className="absolute -bottom-12 inset-x-0 h-10 pointer-events-none">
            {/* Average: 204ms / 700ms = 29.14% (Drops in at ~900ms) */}
            <div
              className={cn(
                'absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out',
                hasRevealed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4',
              )}
              style={{
                left: '29.14%',
                transitionDelay: hasRevealed ? '900ms' : '0ms',
              }}
            >
              <div className="h-4 w-0.5 bg-ink mb-0.5" />
              <span className="rounded-full border-2 border-ink bg-surface px-2.5 py-0.5 text-[11px] font-mono font-bold text-ink shadow-xs">
                Average 204 ms
              </span>
            </div>

            {/* p99: 640ms / 700ms = 91.43% (Drops in at ~1100ms) */}
            <div
              className={cn(
                'absolute -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out',
                hasRevealed
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4',
              )}
              style={{
                left: '91.43%',
                transitionDelay: hasRevealed ? '1100ms' : '0ms',
              }}
            >
              <div className="h-4 w-0.5 bg-ink mb-0.5" />
              <span className="rounded-full border-2 border-no bg-no-bg px-2.5 py-0.5 text-[11px] font-mono font-bold text-no shadow-xs">
                p99 640 ms
              </span>
            </div>
          </div>
        </div>

        {/* Axis tick labels */}
        <div className="flex justify-between border-t border-line pt-2 text-xs font-mono text-muted">
          <span>0 ms</span>
          <span>175 ms</span>
          <span>350 ms</span>
          <span>525 ms</span>
          <span>700 ms</span>
        </div>

        {/* Test Summary Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t-2 border-line pt-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Throughput
            </span>
            <p className="font-mono text-xl sm:text-2xl font-extrabold text-ok">
              ~95 req/s
            </p>
            <p className="text-xs text-muted">Steady throughput</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Failure Rate
            </span>
            <p className="font-mono text-xl sm:text-2xl font-extrabold text-ok">
              0%
            </p>
            <p className="text-xs text-muted">Zero dropped requests</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Concurrency
            </span>
            <p className="font-mono text-xl sm:text-2xl font-extrabold text-ink">
              50 users
            </p>
            <p className="text-xs text-muted">5 spawned per sec</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Total Traffic
            </span>
            <p className="font-mono text-xl sm:text-2xl font-extrabold text-ink">
              11,468
            </p>
            <p className="text-xs text-muted">Requests processed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
