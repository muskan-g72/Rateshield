import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export type StatCardVariant = 'default' | 'ok' | 'no'

export interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  variant?: StatCardVariant
}

const valueStyles: Record<StatCardVariant, string> = {
  default: 'text-ink',
  ok: 'text-ok',
  no: 'text-no',
}

export function StatCard({ label, value, hint, variant = 'default' }: StatCardProps) {
  return (
    <Card className="flex flex-col justify-between p-5">
      <div>
        <p className="text-xs font-semibold text-muted tracking-tight">{label}</p>
        <p className={cn('mt-2 text-2xl sm:text-3xl font-extrabold font-mono tracking-tight', valueStyles[variant])}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      {hint ? <p className="mt-2 text-xs font-mono text-muted">{hint}</p> : null}
    </Card>
  )
}
