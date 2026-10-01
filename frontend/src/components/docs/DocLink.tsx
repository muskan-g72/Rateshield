import { Card } from '@/components/ui/Card'

interface DocLinkProps {
  href: string
  label: string
  description: string
}

export function DocLink({ href, label, description }: DocLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ok rounded-[18px]"
    >
      <Card className="h-full transition-all duration-150 group-hover:border-ink group-hover:bg-bg/40">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold font-display text-base text-ink group-hover:underline">
            {label}
          </h3>
          <span className="font-mono text-sm text-muted">↗</span>
        </div>
        <p className="mt-1.5 text-xs sm:text-sm text-muted">{description}</p>
      </Card>
    </a>
  )
}
