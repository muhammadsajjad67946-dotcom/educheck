const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const requestCache = new Map()
const inflightRequests = new Map()

const DEFAULT_CACHE_TTL = 20000 // 20 seconds for GET requests

export function clearApiCache() {
  requestCache.clear()
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const isGet = method === 'GET'
  const bypassCache = Boolean(options.bypassCache)
  const cacheKey = `${method}:${path}`

  // If mutation, clear GET cache so next reads are fresh
  if (!isGet) {
    requestCache.clear()
  }

  // Check cache for GET
  if (isGet && !bypassCache) {
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() < cached.expiresAt) {
      return structuredClone(cached.data)
    }

    // Check inflight deduplication for GET
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey).then((data) => structuredClone(data))
    }
  }

  const { bypassCache: _, cacheTtl: _ttl, ...fetchOptions } = options

  const fetchPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(fetchOptions.headers || {}) },
        ...fetchOptions,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        const error = new Error(data.message || 'Request failed')
        error.status = response.status
        error.code = data.code
        error.data = data
        throw error
      }

      if (isGet) {
        const ttl = typeof options.cacheTtl === 'number' ? options.cacheTtl : DEFAULT_CACHE_TTL
        if (ttl > 0) {
          requestCache.set(cacheKey, { data, expiresAt: Date.now() + ttl })
        }
      }

      return data
    } finally {
      if (isGet) {
        inflightRequests.delete(cacheKey)
      }
    }
  })()

  if (isGet) {
    inflightRequests.set(cacheKey, fetchPromise)
  }

  return fetchPromise
}

