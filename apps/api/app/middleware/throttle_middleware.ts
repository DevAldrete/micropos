import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Simple in-memory rate limiter middleware.
 *
 * Uses a sliding window approach keyed by IP address.
 * For a distributed deployment, replace the in-memory Map with Redis.
 *
 * Usage:
 *   middleware.throttle({ maxAttempts: 10, windowSeconds: 60 })
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Periodically clean up expired entries (every 5 minutes)
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < 300_000)
      if (entry.timestamps.length === 0) {
        store.delete(key)
      }
    }
  },
  5 * 60 * 1000
)

export default class ThrottleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options?: { maxAttempts?: number; windowSeconds?: number }
  ) {
    const maxAttempts = options?.maxAttempts ?? 10
    const windowMs = (options?.windowSeconds ?? 60) * 1000

    const ip = ctx.request.ip()
    const key = `${ip}:${ctx.request.url()}`
    const now = Date.now()

    let entry = store.get(key)
    if (!entry) {
      entry = { timestamps: [] }
      store.set(key, entry)
    }

    // Remove timestamps outside the window
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)

    if (entry.timestamps.length >= maxAttempts) {
      const oldestInWindow = entry.timestamps[0]
      const retryAfter = Math.ceil((oldestInWindow + windowMs - now) / 1000)

      ctx.response.header('Retry-After', String(retryAfter))
      ctx.response.header('X-RateLimit-Limit', String(maxAttempts))
      ctx.response.header('X-RateLimit-Remaining', '0')

      return ctx.response.tooManyRequests({
        message: 'Too many requests. Please try again later.',
        retryAfter,
      })
    }

    entry.timestamps.push(now)

    ctx.response.header('X-RateLimit-Limit', String(maxAttempts))
    ctx.response.header('X-RateLimit-Remaining', String(maxAttempts - entry.timestamps.length))

    return next()
  }
}
