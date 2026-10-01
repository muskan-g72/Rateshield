import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useSimulatorEvents } from '@/hooks/useSimulatorEvents'

interface SimRequest {
  id: string
  timestamp: number
  allowed: boolean
  slotNumber?: number
  yOffset: number // percentage between 20% and 80%
}

interface LogEntry {
  type: 'allowed' | 'blocked'
  text: string
  timestamp: number
}

const LIMIT = 8
const WINDOW_MS = 10000 // 10s
const TIMELINE_MS = 20000 // 20s

export function LimiterSimulator() {
  const { emitPacket } = useSimulatorEvents()
  const [requests, setRequests] = useState<SimRequest[]>([])
  const [log, setLog] = useState<LogEntry>({
    type: 'allowed',
    text: '200 OK · ready for requests',
    timestamp: Date.now(),
  })
  const [now, setNow] = useState<number>(Date.now())
  const [isBursting, setIsBursting] = useState(false)

  const burstTimeoutsRef = useRef<number[]>([])
  const rafRef = useRef<number | null>(null)
  const requestsRef = useRef<SimRequest[]>([])
  requestsRef.current = requests

  // Drive animation loop
  useEffect(() => {
    let active = true

    const loop = () => {
      if (!active) return
      const currentNow = Date.now()
      setNow(currentNow)

      // Prune requests older than 20s
      setRequests((prev) => {
        const filtered = prev.filter((r) => currentNow - r.timestamp <= TIMELINE_MS)
        if (filtered.length !== prev.length) {
          return filtered
        }
        return prev
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      burstTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const sendSingleRequest = useCallback(() => {
    const currentNow = Date.now()
    const currentRequests = requestsRef.current

    // Count allowed requests within the 10s window
    const allowedInWindow = currentRequests.filter(
      (r) => r.allowed && currentNow - r.timestamp <= WINDOW_MS,
    )

    const isAllowed = allowedInWindow.length < LIMIT
    const yOffset = 18 + Math.floor(Math.random() * 64) // 18% to 82%

    if (isAllowed) {
      const slot = allowedInWindow.length + 1
      const newReq: SimRequest = {
        id: `${currentNow}-${Math.random()}`,
        timestamp: currentNow,
        allowed: true,
        slotNumber: slot,
        yOffset,
      }

      setRequests((prev) => [...prev, newReq])
      setLog({
        type: 'allowed',
        text: `200 OK · slot ${slot} of ${LIMIT} used`,
        timestamp: currentNow,
      })
      emitPacket({
        id: newReq.id,
        allowed: true,
        timestamp: currentNow,
        slotNumber: slot,
      })
    } else {
      // Find oldest allowed request in window to calculate retry time
      const sortedAllowed = [...allowedInWindow].sort((a, b) => a.timestamp - b.timestamp)
      const oldest = sortedAllowed[0]
      const retryMs = oldest ? oldest.timestamp + WINDOW_MS - currentNow : WINDOW_MS
      const retrySec = Math.max(0.1, retryMs / 1000).toFixed(1)

      const newReq: SimRequest = {
        id: `${currentNow}-${Math.random()}`,
        timestamp: currentNow,
        allowed: false,
        yOffset,
      }

      setRequests((prev) => [...prev, newReq])
      setLog({
        type: 'blocked',
        text: `429 Too Many Requests · try again in ${retrySec}s`,
        timestamp: currentNow,
      })
      emitPacket({
        id: newReq.id,
        allowed: false,
        timestamp: currentNow,
      })
    }
  }, [emitPacket])

  const handleBurst = useCallback(() => {
    if (isBursting) return
    setIsBursting(true)

    burstTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    burstTimeoutsRef.current = []

    for (let i = 0; i < 12; i++) {
      const t = window.setTimeout(() => {
        sendSingleRequest()
        if (i === 11) {
          setIsBursting(false)
        }
      }, i * 70)
      burstTimeoutsRef.current.push(t)
    }
  }, [isBursting, sendSingleRequest])

  const handleReset = useCallback(() => {
    burstTimeoutsRef.current.forEach((t) => window.clearTimeout(t))
    burstTimeoutsRef.current = []
    setIsBursting(false)
    setRequests([])
    setLog({
      type: 'allowed',
      text: '200 OK · limiter reset to 0/8',
      timestamp: Date.now(),
    })
  }, [])

  // Calculate current window usage
  const activeInWindow = requests.filter((r) => r.allowed && now - r.timestamp <= WINDOW_MS).length
  const isFull = activeInWindow >= LIMIT

  return (
    <div
      className="relative rounded-[20px] border-2 border-ink bg-surface p-5 sm:p-6 text-ink shadow-hero transition-colors duration-150"
      aria-label="Live Rate Limiter Simulator"
    >
      {/* Header with Title and n / 8 counter */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ok animate-pulse" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-ink">
              Live sliding window
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            10s rolling window · 8 req max limit
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-2 rounded-full border-2 border-line bg-bg px-3.5 py-1">
          <span className="text-xs font-semibold text-muted">Active:</span>
          <span
            className={cn(
              'font-mono text-sm font-bold',
              isFull ? 'text-no' : 'text-ok',
            )}
          >
            {activeInWindow} / {LIMIT}
          </span>
        </div>
      </div>

      {/* Simulator Visual Track */}
      <div className="my-5">
        <div
          className="relative h-28 sm:h-32 w-full overflow-hidden rounded-[12px] border-2 border-ink bg-bg"
          aria-label="Rate limit timeline representation"
        >
          {/* Background Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-15">
            <div className="border-r border-ink" />
            <div className="border-r border-ink" />
            <div className="border-r border-ink" />
            <div />
          </div>

          {/* Left half: Past / Expired window (10s - 20s ago) */}
          <div className="absolute inset-y-0 left-0 w-1/2 flex items-start justify-start p-2 pointer-events-none">
            <span className="text-[10px] font-mono text-muted/70 uppercase tracking-wider font-semibold">
              Past (expired)
            </span>
          </div>

          {/* Right half: Active 10s Window highlighted with ok-bg and thick ink left border */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-ok-bg/35 border-l-2 border-ink flex items-start justify-end p-2 pointer-events-none">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-ok font-bold uppercase tracking-wider bg-surface/80 rounded-full px-2 py-0.5 border border-ok/30">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Active window (10s)
            </span>
          </div>

          {/* Animated Request Markers */}
          {requests.map((req) => {
            const ageMs = now - req.timestamp
            if (ageMs > TIMELINE_MS || ageMs < 0) return null

            // 0s ago = 100% (far right), 20s ago = 0% (far left)
            const leftPct = Math.max(0, Math.min(100, 100 - (ageMs / TIMELINE_MS) * 100))

            return (
              <div
                key={req.id}
                style={{
                  left: `${leftPct}%`,
                  top: `${req.yOffset}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 transition-transform duration-75 pointer-events-none"
                title={
                  req.allowed
                    ? `Allowed request (200 OK) · ${(ageMs / 1000).toFixed(1)}s ago`
                    : `Blocked request (429 Too Many Requests) · ${(ageMs / 1000).toFixed(1)}s ago`
                }
              >
                {req.allowed ? (
                  // Allowed: Circle marker
                  <div className="flex items-center justify-center h-4 w-4 rounded-full bg-ok border border-ink text-[9px] font-mono font-bold text-white shadow-xs">
                    {req.slotNumber ? req.slotNumber : ''}
                  </div>
                ) : (
                  // Blocked: Rotated square marker
                  <div className="flex items-center justify-center h-4 w-4 rotate-45 rounded-[2px] bg-no border border-ink shadow-xs">
                    <span className="-rotate-45 text-[8px] font-mono font-black text-white">✕</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Axis Labels */}
        <div className="mt-1.5 flex justify-between px-1 text-[11px] font-mono text-muted font-medium">
          <span>20s ago</span>
          <span className="font-semibold text-ink">10s ago (window start)</span>
          <span className="font-semibold text-ink">Now</span>
        </div>
      </div>

      {/* Live Status Log Line */}
      <div className="mb-5">
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'flex items-center justify-between gap-2 rounded-[10px] border-2 px-3.5 py-2 text-xs sm:text-sm font-mono font-semibold transition-colors duration-150',
            log.type === 'allowed'
              ? 'border-ok/60 bg-ok-bg text-ok'
              : 'border-no/60 bg-no-bg text-no',
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {log.type === 'allowed' ? (
              <span className="h-2 w-2 rounded-full bg-ok shrink-0" aria-hidden="true" />
            ) : (
              <span className="h-2 w-2 rotate-45 rounded-[1px] bg-no shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{log.text}</span>
          </div>
          <span className="text-[10px] opacity-75 shrink-0">Live</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t-2 border-line">
        <Button
          size="sm"
          variant="primary"
          onClick={sendSingleRequest}
          className="flex-1 min-w-[120px]"
        >
          Send request
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleBurst}
          disabled={isBursting}
          className="flex-1 min-w-[120px]"
        >
          {isBursting ? 'Bursting (12)…' : 'Burst of 12'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="px-3"
          title="Reset simulator track"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
