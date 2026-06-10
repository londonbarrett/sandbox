class GlobalTTLCache {
  private cache
  private defaultTtl

  constructor(defaultTtlMs = 10000) {
    this.cache = new Map()
    this.defaultTtl = defaultTtlMs

    // Background active cleanup loop
    if (typeof window === "undefined") {
      setInterval(() => this.evictExpired(), 5000)
    }
  }

  set(key, value, ttlMs = this.defaultTtl) {
    const expiry = Date.now() + Number(ttlMs)
    this.cache.set(key, { value, expiry })
  }

  get(key) {
    if (!this.cache.has(key)) return null
    const entry = this.cache.get(key)

    // Passive deletion
    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }
    return entry.value
  }

  evictExpired() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  getAllActive() {
    const now = Date.now()
    const activeData = []
    for (const [key, entry] of this.cache.entries()) {
      if (now <= entry.expiry) {
        activeData.push({
          key,
          value: entry.value,
          timeLeftMs: entry.expiry - now,
        })
      }
    }
    return activeData
  }
}

// Prevent multiple instances in Next.js hot-reloading
const globalForCache = global
export const ttlCache = globalForCache.ttlCache || new GlobalTTLCache()
if (process.env.NODE_ENV !== "production")
  globalForCache.ttlCache = ttlCache
