import { Badge } from '@/components/ui'
import type { GatewayRequestState } from '@/types/gateway'

interface GatewayFormStatusProps {
  requestState: GatewayRequestState
}

export function GatewayFormStatus({ requestState }: GatewayFormStatusProps) {
  if (requestState === 'idle') return null

  if (requestState === 'success') {
    return <Badge variant="success">Request succeeded</Badge>
  }

  if (requestState === 'error') {
    return <Badge variant="danger">Request failed</Badge>
  }

  return null
}
