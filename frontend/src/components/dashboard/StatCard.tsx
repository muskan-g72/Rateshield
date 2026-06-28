import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type StatCardVariant = 'default' | 'success' | 'danger' | 'primary'

interface StatCardProps {
  label: string
  value: string | number
  variant?: StatCardVariant
}

const valueStyles: Record<StatCardVariant, string> = {
  default: 'text-slate-100',
  success: 'text-success',
  danger: 'text-danger',
  primary: 'text-primary',
}

export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  return (
    <Card className="text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={cn('text-3xl font-bold tracking-tight', valueStyles[variant])}>{value}</p>
    </Card>
  )
}
