import { cn } from '@/lib/utils'

interface ShieldLogoProps {
  className?: string
  size?: number
}

export function ShieldLogo({ className, size = 28 }: ShieldLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 text-ink', className)}
      aria-hidden="true"
    >
      {/* Outer Shield with 2px ink stroke */}
      <path
        d="M16 3L5 7.5V14.5C5 21.5 9.7 27.5 16 29C22.3 27.5 27 21.5 27 14.5V7.5L16 3Z"
        className="stroke-current fill-surface"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pulse line inside shield in ok green */}
      <path
        d="M8.5 16.5H12L14 12L17.5 21L19.5 16.5H23.5"
        className="stroke-ok"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
