export interface DashboardData {
  name: string
  email: string
  plan: string
  total_api_keys: number
  active_api_keys: number
  total_requests: number
  approved_requests: number
  blocked_requests: number
  success_rate: number
}

export function formatSuccessRate(rate: number): string {
  return `${rate.toFixed(2)}%`
}

export function formatPlanLabel(plan: string): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()
}
