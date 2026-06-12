export type CacheEntry<V> = {
  value: V
  expiry: number
}

export type ActiveEntry<K, V> = {
  key: K
  value: V
  timeLeftMs: number
}

export type CacheConfig = {
  maxSize?: number // LRU Capacity limit
  defaultTTL?: number // Default TTL in ms
  activeCleanup?: boolean // Toggle background interval cleanup
  cleanupInterval?: number // Interval duration in ms
}

export class AdvancedTTLCache<K, V> {
  // Map preserves insertion order. The first item is always the oldest (LRU).
  private cache = new Map<K, CacheEntry<V>>()
  private inflightRequests = new Map<K, Promise<V>>()
  private timer: ReturnType<typeof setInterval> | null = null

  constructor(private config: CacheConfig = {}) {
    if (this.config.activeCleanup) {
      this.startActiveCleanup()
    }
  }

  /**
   * Core SET operation with LRU tracking and strict input guards
   */
  public set(key: K, value: V, customTTL?: number): void {
    const ttl = customTTL ?? this.config.defaultTTL

    // Edge Case: Drop zero or negative TTLs immediately to prevent memory dead-weight
    if (ttl !== undefined && ttl <= 0) return

    // Edge Case: Use performance.now() (monotonic clock) to prevent NTP system clock skew bugs
    const expiry =
      ttl === Infinity || ttl === undefined
        ? Infinity
        : performance.now() + ttl

    // Edge Case: Delete key first if it exists to reset insertion order (fixes LRU position)
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (
      this.config.maxSize &&
      this.cache.size >= this.config.maxSize
    ) {
      // LRU Eviction: Evict the least recently used item (first item in the Map iterator)
      const oldestKey = this.cache.keys().next().value
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, { value, expiry })
  }

  /**
   * Core GET operation with Lazy Eviction and LRU rank updates
   */
  public get(key: K): V | undefined {
    const entry = this.cache.get(key)

    if (!entry) return undefined

    // Lazy Eviction: Prune item immediately if current monotonic time has passed expiry
    if (performance.now() > entry.expiry) {
      this.cache.delete(key)
      return undefined
    }

    // LRU Logic: Refresh position on read by deleting and re-inserting to the end of the Map
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.value
  }

  /**
   * Cache Stampede Protection (Request Collapsing)
   * Collapses multiple concurrent identical requests into a single shared execution promise.
   */
  public async getOrFetch(
    key: K,
    fetcher: () => Promise<V>,
    customTTL?: number
  ): Promise<V> {
    const cachedValue = this.get(key)
    if (cachedValue !== undefined) return cachedValue

    // If a request for this key is already in flight, reuse its promise
    let inflight = this.inflightRequests.get(key)
    if (!inflight) {
      inflight = fetcher().finally(() => {
        this.inflightRequests.delete(key) // Cleanup tracking once finished
      })
      this.inflightRequests.set(key, inflight)
    }

    try {
      const data = await inflight
      this.set(key, data, customTTL)
      return data
    } catch (error) {
      throw error // Propagate fetch errors to the caller
    }
  }

  /**
   * Active Eviction Strategy
   * Periodically sweeps the map to clean stale records, preventing silent memory accumulation.
   */
  private startActiveCleanup(): void {
    const interval = this.config.cleanupInterval ?? 10000 // Default to 10 seconds

    this.timer = setInterval(() => {
      const now = performance.now()
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiry) {
          this.cache.delete(key)
        }
      }
    }, interval)

    // Node.js Optimisation: Prevent the event loop from staying active during local tests
    if (this.timer && typeof this.timer.unref === "function") {
      this.timer.unref()
    }
  }

  public delete(key: K): boolean {
    return this.cache.delete(key)
  }

  public clear(): void {
    this.cache.clear()
    this.inflightRequests.clear()
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  public size(): number {
    return this.cache.size
  }

  getAllActive(): ActiveEntry<K, V>[] {
    const now = performance.now()
    const active: ActiveEntry<K, V>[] = []
    for (const [key, entry] of this.cache) {
      if (now <= entry.expiry) {
        active.push({
          key,
          value: entry.value,
          timeLeftMs: entry.expiry - now,
        })
      }
    }
    return active
  }
}

export const ttlCache = new AdvancedTTLCache<string, unknown>({
  maxSize: 1000,
  defaultTTL: 60000,
})
