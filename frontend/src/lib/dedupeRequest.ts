const inflightRequests = new Map<string, Promise<unknown>>()

/**
 * Coalesce identical in-flight requests (e.g. React StrictMode double mount).
 * Only use for safe-to-repeat GET-style reads.
 */
export function dedupeRequest<T>(key: string, request: () => Promise<T>): Promise<T> {
  const existing = inflightRequests.get(key)

  if (existing) {
    return existing as Promise<T>
  }

  const promise = request().finally(() => {
    inflightRequests.delete(key)
  })

  inflightRequests.set(key, promise)
  return promise
}

export function clearDedupeKey(key: string) {
  inflightRequests.delete(key)
}
