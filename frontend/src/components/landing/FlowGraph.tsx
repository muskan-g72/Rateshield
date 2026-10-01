import { useState, useEffect, useRef, useCallback } from 'react'
import { useSimulatorEvents } from '@/hooks/useSimulatorEvents'
import type { PacketEvent } from '@/context/SimulatorEventContext'
import { cn } from '@/lib/utils'

interface FlowNode {
  id: string
  name: string
  sublabel: string
  description: string
  isSpecial?: boolean
}

const NODES: FlowNode[] = [
  {
    id: 'client',
    name: 'Client',
    sublabel: 'User / SDK',
    description: 'Sends API requests with JWT bearer tokens or X-API-Key credentials.',
  },
  {
    id: 'auth',
    name: 'Auth (JWT)',
    sublabel: 'JWT verify',
    description: 'Validates bearer token signatures and matches user account quotas.',
  },
  {
    id: 'redis',
    name: 'Redis window',
    sublabel: 'Lua sliding window',
    description: 'Evaluates requests against sliding window in sub-millisecond atomic Lua script.',
    isSpecial: true,
  },
  {
    id: 'gateway',
    name: 'Gateway',
    sublabel: 'FastAPI',
    description: 'Asynchronous router handling request dispatch, metrics, and security headers.',
  },
  {
    id: 'weather',
    name: 'Weather service',
    sublabel: 'Upstream proxy',
    description: 'Upstream backend service serving data payload to authorized traffic.',
  },
]

interface ActivePacket {
  id: string
  allowed: boolean
  startTime: number
  phase: 'forward' | 'shake' | 'return' | 'done'
  shakeStartTime?: number
  returnStartTime?: number
  isUserTriggered?: boolean
}

export function FlowGraph() {
  const { subscribePackets } = useSimulatorEvents()
  const containerRef = useRef<HTMLDivElement>(null)

  const [hoveredNode, setHoveredNode] = useState<FlowNode | null>(null)
  const [packets, setPackets] = useState<ActivePacket[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [isMobile, setIsMobile] = useState(false)

  const packetsRef = useRef<ActivePacket[]>([])
  packetsRef.current = packets
  const rafRef = useRef<number | null>(null)
  const idleTimerRef = useRef<number | null>(null)

  // Check reduced motion & window size
  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionMedia.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    motionMedia.addEventListener('change', handleMotionChange)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      motionMedia.removeEventListener('change', handleMotionChange)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Visibility and Intersection Observer to pause idle animation
  useEffect(() => {
    let isVisible = true
    let isIntersecting = true

    const updatePauseState = () => {
      setIsPaused(!isVisible || !isIntersecting)
    }

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible'
      updatePauseState()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          isIntersecting = entry.isIntersecting
          updatePauseState()
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      observer.disconnect()
    }
  }, [])

  // Spawn packet helper
  const spawnPacket = useCallback((allowed: boolean, isUser = false) => {
    if (prefersReducedMotion) return

    const newPacket: ActivePacket = {
      id: `${Date.now()}-${Math.random()}`,
      allowed,
      startTime: Date.now(),
      phase: 'forward',
      isUserTriggered: isUser,
    }

    setPackets((prev) => [...prev.slice(-15), newPacket])
  }, [prefersReducedMotion])

  // Listen to simulator events
  useEffect(() => {
    const unsubscribe = subscribePackets((event: PacketEvent) => {
      spawnPacket(event.allowed, true)
    })
    return unsubscribe
  }, [subscribePackets, spawnPacket])

  // Idle loop: spawn a packet every ~1.4s, roughly 1 in 5 blocked
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    let count = 0
    const interval = window.setInterval(() => {
      count++
      // Roughly 1 in 5 is blocked
      const isBlocked = count % 5 === 0
      spawnPacket(!isBlocked, false)
    }, 1400)

    idleTimerRef.current = interval

    return () => {
      window.clearInterval(interval)
    }
  }, [isPaused, prefersReducedMotion, spawnPacket])

  // Main animation frame loop for packets
  useEffect(() => {
    if (prefersReducedMotion) return

    let active = true

    const loop = () => {
      if (!active) return
      const currentNow = Date.now()
      setNow(currentNow)

      // Forward travel time: 2000ms (Client to Weather)
      // Client to Redis is 50% (1000ms)
      const FORWARD_FULL_MS = 2200
      const TO_REDIS_MS = 1100
      const SHAKE_DURATION_MS = 350
      const RETURN_MS = 1100

      setPackets((prev) => {
        let changed = false
        const next: ActivePacket[] = []

        for (const p of prev) {
          if (p.phase === 'forward') {
            const elapsed = currentNow - p.startTime
            if (p.allowed) {
              if (elapsed >= FORWARD_FULL_MS + 200) {
                // Done
                changed = true
                continue
              }
            } else {
              // Blocked packet
              if (elapsed >= TO_REDIS_MS) {
                p.phase = 'shake'
                p.shakeStartTime = currentNow
                changed = true
              }
            }
            next.push(p)
          } else if (p.phase === 'shake') {
            const shakeElapsed = currentNow - (p.shakeStartTime || currentNow)
            if (shakeElapsed >= SHAKE_DURATION_MS) {
              p.phase = 'return'
              p.returnStartTime = currentNow
              changed = true
            }
            next.push(p)
          } else if (p.phase === 'return') {
            const returnElapsed = currentNow - (p.returnStartTime || currentNow)
            if (returnElapsed >= RETURN_MS + 200) {
              // Done
              changed = true
              continue
            }
            next.push(p)
          }
        }

        return changed ? next : prev
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [prefersReducedMotion])

  // Desktop coordinate map (horizontal 1000 x 220)
  // Nodes at x = 90, 295, 500, 705, 910
  const DESKTOP_POS = [
    { x: 90, y: 110 },
    { x: 295, y: 110 },
    { x: 500, y: 110 },
    { x: 705, y: 110 },
    { x: 910, y: 110 },
  ]

  // Mobile coordinate map (vertical 360 x 580)
  // Nodes at y = 50, 165, 280, 395, 510, x = 180
  const MOBILE_POS = [
    { x: 180, y: 50 },
    { x: 180, y: 165 },
    { x: 180, y: 280 },
    { x: 180, y: 395 },
    { x: 180, y: 510 },
  ]

  const nodePositions = isMobile ? MOBILE_POS : DESKTOP_POS

  // Calculate packet screen position & styling
  const getPacketRender = (packet: ActivePacket) => {
    const FORWARD_FULL_MS = 2200
    const TO_REDIS_MS = 1100
    const RETURN_MS = 1100

    const p0 = nodePositions[0]
    const p2 = nodePositions[2]
    const p4 = nodePositions[4]

    let posX = p0.x
    let posY = p0.y
    let isBlockedStyle = false
    let isShaking = false
    let opacity = 1
    let show429Tag = false

    if (packet.phase === 'forward') {
      const elapsed = now - packet.startTime
      if (packet.allowed) {
        const prog = Math.min(1, Math.max(0, elapsed / FORWARD_FULL_MS))
        posX = p0.x + (p4.x - p0.x) * prog
        posY = p0.y + (p4.y - p0.y) * prog
        if (elapsed > FORWARD_FULL_MS) {
          opacity = Math.max(0, 1 - (elapsed - FORWARD_FULL_MS) / 200)
        }
      } else {
        const prog = Math.min(1, Math.max(0, elapsed / TO_REDIS_MS))
        posX = p0.x + (p2.x - p0.x) * prog
        posY = p0.y + (p2.y - p0.y) * prog
      }
    } else if (packet.phase === 'shake') {
      posX = p2.x
      posY = p2.y
      isBlockedStyle = true
      isShaking = true
      show429Tag = true

      // Lateral shake
      const shakeElapsed = now - (packet.shakeStartTime || now)
      const shakeOffset = Math.sin(shakeElapsed * 0.05) * 5
      if (isMobile) {
        posX += shakeOffset
      } else {
        posY += shakeOffset
      }
    } else if (packet.phase === 'return') {
      isBlockedStyle = true
      show429Tag = true
      const elapsed = now - (packet.returnStartTime || now)
      const prog = Math.min(1, Math.max(0, elapsed / RETURN_MS))
      // Returning from Redis (p2) to Client (p0)
      posX = p2.x + (p0.x - p2.x) * prog
      posY = p2.y + (p0.y - p2.y) * prog

      if (elapsed > RETURN_MS) {
        opacity = Math.max(0, 1 - (elapsed - RETURN_MS) / 200)
      }
    }

    return { posX, posY, isBlockedStyle, isShaking, opacity, show429Tag }
  }

  return (
    <section className="py-6 sm:py-10 border-t-2 border-line">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ok animate-pulse" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-ink tracking-tight">
              Interactive request pipeline
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            Live telemetry matching simulator events · Hover any node to inspect role
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-ok font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-ok" />
            Allowed (200 OK)
          </span>
          <span className="flex items-center gap-1.5 text-no font-semibold">
            <span className="h-2.5 w-2.5 rotate-45 rounded-[1px] bg-no" />
            Blocked (429)
          </span>
        </div>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="relative rounded-[20px] border-2 border-line bg-surface p-4 sm:p-6 overflow-hidden select-none"
      >
        {/* Tooltip Overlay (if hovering a node) */}
        <div
          className={cn(
            'pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-150',
            hoveredNode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
          )}
        >
          {hoveredNode && (
            <div className="rounded-full border-2 border-ink bg-bg px-4 py-1.5 text-xs font-mono font-bold text-ink shadow-hero-sm whitespace-nowrap flex items-center gap-2">
              <span className="text-ok">●</span>
              <span>{hoveredNode.name}:</span>
              <span className="text-muted font-normal">{hoveredNode.description}</span>
            </div>
          )}
        </div>

        {/* SVG Pipeline Canvas */}
        <svg
          viewBox={isMobile ? '0 0 360 560' : '0 0 1000 220'}
          className="w-full h-auto overflow-visible"
          aria-label="Interactive architecture flow diagram"
        >
          <defs>
            {/* Soft grid pattern for aesthetic */}
            <pattern id="flow-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--color-line)" opacity="0.5" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#flow-grid)" opacity="0.3" rx="14" />

          {/* Connecting Edge Track Line */}
          {isMobile ? (
            <line
              x1={MOBILE_POS[0].x}
              y1={MOBILE_POS[0].y}
              x2={MOBILE_POS[4].x}
              y2={MOBILE_POS[4].y}
              stroke="var(--color-line)"
              strokeWidth="4"
              strokeDasharray="6 6"
            />
          ) : (
            <line
              x1={DESKTOP_POS[0].x}
              y1={DESKTOP_POS[0].y}
              x2={DESKTOP_POS[4].x}
              y2={DESKTOP_POS[4].y}
              stroke="var(--color-line)"
              strokeWidth="4"
              strokeDasharray="6 6"
            />
          )}

          {/* Animated Packets */}
          {!prefersReducedMotion &&
            packets.map((packet) => {
              const { posX, posY, isBlockedStyle, opacity, show429Tag } =
                getPacketRender(packet)

              return (
                <g key={packet.id} opacity={opacity} className="pointer-events-none">
                  {isBlockedStyle ? (
                    // Blocked Packet: Rotated square
                    <g transform={`translate(${posX}, ${posY})`}>
                      <rect
                        x="-7"
                        y="-7"
                        width="14"
                        height="14"
                        rx="2"
                        transform="rotate(45)"
                        className="fill-no stroke-ink stroke-[1.5]"
                      />
                      {show429Tag && (
                        <g transform="translate(0, -18)">
                          <rect
                            x="-16"
                            y="-9"
                            width="32"
                            height="16"
                            rx="8"
                            className="fill-no-bg stroke-no stroke-1"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            className="font-mono text-[9px] font-black fill-no"
                          >
                            429
                          </text>
                        </g>
                      )}
                    </g>
                  ) : (
                    // Allowed Packet: Circle
                    <g transform={`translate(${posX}, ${posY})`}>
                      <circle
                        r="7"
                        className="fill-ok stroke-ink stroke-[1.5]"
                      />
                      <circle
                        r="3"
                        className="fill-white"
                      />
                    </g>
                  )}
                </g>
              )
            })}

          {/* Reduced Motion fallback static markers */}
          {prefersReducedMotion && (
            <g className="pointer-events-none">
              {/* Allowed packet near Gateway */}
              <g transform={isMobile ? 'translate(180, 440)' : 'translate(780, 110)'}>
                <circle r="7" className="fill-ok stroke-ink stroke-[1.5]" />
                <circle r="3" className="fill-white" />
              </g>
              {/* Blocked packet returning to Client */}
              <g transform={isMobile ? 'translate(180, 200)' : 'translate(360, 110)'}>
                <rect x="-7" y="-7" width="14" height="14" rx="2" transform="rotate(45)" className="fill-no stroke-ink stroke-[1.5]" />
                <g transform="translate(0, -16)">
                  <rect x="-14" y="-8" width="28" height="15" rx="7" className="fill-no-bg stroke-no stroke-1" />
                  <text x="0" y="3" textAnchor="middle" className="font-mono text-[9px] font-black fill-no">429</text>
                </g>
              </g>
            </g>
          )}

          {/* 5 Nodes */}
          {NODES.map((node, index) => {
            const pos = nodePositions[index]
            const isHovered = hoveredNode?.id === node.id
            const isRedis = node.id === 'redis'
            const nodeW = isMobile ? 190 : index === 2 ? 148 : 134
            const nodeH = isMobile ? 56 : 64

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x - nodeW / 2}, ${pos.y - nodeH / 2})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-all duration-150"
              >
                {/* Node Box */}
                <rect
                  width={nodeW}
                  height={nodeH}
                  rx="14"
                  className={cn(
                    'transition-colors duration-150',
                    isHovered
                      ? 'fill-bg stroke-ink stroke-[2.5]'
                      : isRedis
                        ? 'fill-ok-bg/35 stroke-ink stroke-2'
                        : 'fill-surface stroke-line stroke-2',
                  )}
                />

                {/* Redis Node Special Border Tag */}
                {isRedis && (
                  <circle
                    cx={nodeW - 12}
                    cy="12"
                    r="4"
                    className="fill-ok"
                  />
                )}

                {/* Node Title */}
                <text
                  x={nodeW / 2}
                  y={nodeH / 2 - 4}
                  textAnchor="middle"
                  className={cn(
                    'font-display text-xs sm:text-sm font-extrabold tracking-tight',
                    isHovered ? 'fill-ink' : 'fill-ink',
                  )}
                >
                  {node.name}
                </text>

                {/* Node Mono Sublabel */}
                <text
                  x={nodeW / 2}
                  y={nodeH / 2 + 14}
                  textAnchor="middle"
                  className={cn(
                    'font-mono text-[10px] font-semibold',
                    isRedis ? 'fill-ok' : 'fill-muted',
                  )}
                >
                  {node.sublabel}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}
