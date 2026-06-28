export interface ApiErrorResponse {
  detail?: string | Array<{ msg: string }>
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: ApiErrorResponse } }).response
    const detail = response?.data?.detail

    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail.length > 0) return detail[0]?.msg ?? fallback
  }

  if (error instanceof Error) return error.message

  return fallback
}
