export interface ApiKey {
  id: number
  name: string
  active: boolean
  created_at: string
}

export interface CreateApiKeyResponse {
  id: number
  api_key: string
  name: string
  active: boolean
}

export function formatApiKeyDate(dateString: string): string {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
