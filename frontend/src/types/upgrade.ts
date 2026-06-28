export interface UpgradeResponse {
  message: string
  plan: string
}

export interface PlanDefinition {
  id: 'free' | 'pro'
  name: string
  price: string
  rateLimit: string
  description: string
  features: string[]
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    rateLimit: '5 requests / minute',
    description: 'For development and testing gateway integrations.',
    features: ['JWT dashboard access', 'API key management', 'Basic analytics'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Contact',
    rateLimit: '100 requests / minute',
    description: 'For higher traffic workloads and production-style testing.',
    features: ['Everything in Free', '20x higher rate limits', 'Priority gateway access'],
  },
]

export function normalizePlan(plan: string): 'free' | 'pro' {
  return plan.toLowerCase() === 'pro' ? 'pro' : 'free'
}
