/**
 * In-Memory Sliding Window Rate Limiter for WSTAR OS API Endpoints
 * Protects AI token budgets and authentication routes from abuse.
 */

interface RateLimitRecord {
  timestamps: number[]
}

const rateLimitStore = new Map<string, RateLimitRecord>()

// Clean up stale records periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000)
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key)
      }
    }
  }, 60000)
}

export interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { maxRequests: 20, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier) || { timestamps: [] }

  // Filter timestamps within current sliding window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < options.windowMs)

  if (validTimestamps.length >= options.maxRequests) {
    const oldestTimestamp = validTimestamps[0]
    const resetMs = Math.max(0, options.windowMs - (now - oldestTimestamp))
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    }
  }

  validTimestamps.push(now)
  rateLimitStore.set(identifier, { timestamps: validTimestamps })

  return {
    allowed: true,
    remaining: options.maxRequests - validTimestamps.length,
    resetMs: options.windowMs,
  }
}
