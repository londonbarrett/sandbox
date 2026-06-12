import type { ActiveEntry } from "./ttl-cache"
import { ttlCache } from "./ttl-cache"

export function getActiveEntries(): ActiveEntry<string, unknown>[] {
  return ttlCache.getAllActive()
}

export function setEntry(
  key: string,
  value: unknown,
  ttl?: number
): void {
  ttlCache.set(key, value, ttl)
}
