const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const requestCache = new Map()
const inflightRequests = new Map()

const DEFAULT_CACHE_TTL = 20000 // 20 seconds for GET requests

// BUG-13 Fix: Surgical cache invalidation by path prefix instead of wiping all cache.
// Paths that should be invalidated when a mutation happens on a related resource.
const MUTATION_INVALIDATION_MAP = {
  '/assessment-attempts': ['/assessment-attempts', '/reports', '/student-profile'],
  '/reports': ['/reports'],
  '/payments': ['/payments', '/subscription'],
  '/subscription': ['/subscription'],
  '/profile': ['/profile', '/student-profile'],
}

export function clearApiCacheByPrefix(prefix) {
  for (const key of requestCache.keys()) {
    if (key.includes(prefix)) requestCache.delete(key)
  }
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const isGet = method === 'GET'
  const bypassCache = Boolean(options.bypassCache)
  const cacheKey = `${method}:${path}`

  // BUG-13 Fix: On mutation, only invalidate related cache keys (not entire cache)
  if (!isGet) {
    const matchedPrefixes = Object.entries(MUTATION_INVALIDATION_MAP)
      .filter(([mutationPath]) => path.includes(mutationPath))
      .flatMap(([, invalidated]) => invalidated)
    if (matchedPrefixes.length) {
      for (const prefix of matchedPrefixes) clearApiCacheByPrefix(prefix)
    } else {
      // Unknown mutation path — wipe only exact duplicates, not full cache
      requestCache.delete(`GET:${path}`)
    }
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

