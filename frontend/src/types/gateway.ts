import axios from 'axios'

export interface WeatherResponse {
  city: string
  temperature: string
  condition: string
}

export type GatewayRequestState = 'idle' | 'loading' | 'success' | 'rate_limited' | 'error'

export function parseGatewayError(error: unknown): {
  message: string
  state: 'rate_limited' | 'error'
} {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as
      | { error?: string; detail?: string | { error?: string; message?: string }; message?: string }
      | undefined

    // 1. 429 Rate limited
    if (status === 429) {
      const headers = error.response?.headers
      const retryAfter =
        headers?.['retry-after'] ||
        headers?.['x-ratelimit-reset'] ||
        headers?.['retry_after'] ||
        '60'
      return {
        message: `Rate limit reached. Retry in ${retryAfter} seconds.`,
        state: 'rate_limited',
      }
    }

    // 2. 503 rate_limiter_unavailable
    const detailError =
      typeof data?.detail === 'object' && data?.detail !== null
        ? data?.detail.error
        : data?.detail

    if (
      status === 503 &&
      (data?.error === 'rate_limiter_unavailable' ||
        detailError === 'rate_limiter_unavailable' ||
        (typeof data?.detail === 'string' && data.detail.toLowerCase().includes('rate limiter')))
    ) {
      return {
        message: 'The rate limiter (Redis) is unavailable. Check system health.',
        state: 'error',
      }
    }

    // 3. 401 / 403 API key rejected
    if (status === 401 || status === 403) {
      return {
        message: 'API key rejected. Check that the selected key is active.',
        state: 'error',
      }
    }

    // 4. Other 5xx
    if (status && status >= 500 && status <= 599) {
      return {
        message: `The gateway returned an error (${status}).`,
        state: 'error',
      }
    }

    // 5. Network error or timeout with no response
    if (
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout')
    ) {
      return {
        message: 'The server may be waking up. Try again in a few seconds.',
        state: 'error',
      }
    }

    // 6. Other error detail from server
    if (typeof data?.detail === 'string') {
      return { message: data.detail, state: 'error' }
    }
    if (typeof data?.message === 'string') {
      return { message: data.message, state: 'error' }
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('Network Error') || error.message.includes('failed to fetch')) {
      return {
        message: 'The server may be waking up. Try again in a few seconds.',
        state: 'error',
      }
    }
    return { message: error.message, state: 'error' }
  }

  return { message: 'Unable to fetch weather data.', state: 'error' }
}
