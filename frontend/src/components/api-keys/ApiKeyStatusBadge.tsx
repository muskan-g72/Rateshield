import { Badge } from '@/components/ui/Badge'

interface ApiKeyStatusBadgeProps {
  active: boolean
}

export function ApiKeyStatusBadge({ active }: ApiKeyStatusBadgeProps) {
  return (
    <Badge variant={active ? 'success' : 'default'}>
      {active ? 'Active' : 'Revoked'}
    </Badge>
  )
}
