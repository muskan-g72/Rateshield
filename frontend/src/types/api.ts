import axios from 'axios'

export interface ApiValidationErrorItem {
  loc?: (string | number)[]
  msg: string
  type?: string
}

export interface ApiErrorResponse {
  detail?: string | ApiValidationErrorItem[]
  message?: string
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (typeof error === 'string') return error

  if (axios.isAxiosError(error)) {
    // 1. Network Error / Sleeping backend
    if (
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('Network Error')
    ) {
      return 'Server is waking up. Try again in a few seconds.'
    }

    const status = error.response.status
    const data = error.response.data as ApiErrorResponse | undefined

    // 2. 404 Not Found
    if (status === 404) {
      if (import.meta.env.DEV) {
        const method = (error.config?.method || 'GET').toUpperCase()
        const fullUrl = error.config?.url?.startsWith('http')
          ? error.config.url
          : `${error.config?.baseURL ? error.config.baseURL.replace(/\/+$/, '') : ''}${error.config?.url ? (error.config.url.startsWith('/') ? error.config.url : `/${error.config.url}`) : ''}`
        return `Endpoint not found: ${method} ${fullUrl}`
      }
      return "Can't reach the RateShield API. Check the API URL."
    }

    // 3. 409 Conflict (or 400 with duplicate email detail)
    if (
      status === 409 ||
      (status === 400 &&
        typeof data?.detail === 'string' &&
        (data.detail.toLowerCase().includes('already registered') ||
          data.detail.toLowerCase().includes('already exists')))
    ) {
      return 'An account with this email already exists.'
    }

    // 4. 422 Validation Error
    if (status === 422) {
      if (Array.isArray(data?.detail) && data.detail.length > 0) {
        const firstError = data.detail[0]
        if (firstError?.msg) {
          const field = firstError.loc && firstError.loc.length > 1
            ? String(firstError.loc[firstError.loc.length - 1])
            : ''
          return field ? `${field}: ${firstError.msg}` : firstError.msg
        }
      }
      if (typeof data?.detail === 'string') return data.detail
    }

    // 5. Explicit error detail from server
    if (typeof data?.detail === 'string') {
      return data.detail
    }

    if (typeof data?.message === 'string') {
      return data.message
    }
  }

  if (error instanceof Error) {
    if (
      error.message.includes('Network Error') ||
      error.message.includes('failed to fetch')
    ) {
      return 'Server is waking up. Try again in a few seconds.'
    }
    return error.message
  }

  return fallback
}
