import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Fields that should never appear in logs.
 * Matched case-insensitively against body keys at the top level.
 */
const SENSITIVE_FIELDS = new Set([
  'password',
  'password_confirmation',
  'passwordConfirmation',
  'secret',
  'token',
  'authorization',
  'creditCard',
  'credit_card',
  'ssn',
])

function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body

  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]'
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    logger.info(
      `[REQ] ${ctx.request.method()} ${ctx.request.url()} | body: ${JSON.stringify(sanitizeBody(ctx.request.body()))}`
    )

    await next()

    logger.info(
      `[RES] ${ctx.request.method()} ${ctx.request.url()} | status: ${ctx.response.getStatus()}`
    )
  }
}
