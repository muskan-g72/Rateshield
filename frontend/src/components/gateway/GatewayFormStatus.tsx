import { Badge } from '@/components/ui'
import type { GatewayRequestState } from '@/types/gateway'

interface GatewayFormStatusProps {
  requestState: GatewayRequestState
}

export function GatewayFormStatus({ requestState }: GatewayFormStatusProps) {
  if (requestState === 'idle' || requestState === 'loading') return null

  if (requestState === 'success') {
    return <Badge variant="ok">200 OK · Request succeeded</Badge>
  }

  if (requestState === 'rate_limited') {
    return <Badge variant="no">Rate limited</Badge>
  }

  if (requestState === 'error') {
    return <Badge variant="default">Request failed</Badge>
  }

  return null
}
