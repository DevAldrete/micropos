import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

export default class RequestLoggerMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    logger.info(
      `[REQ] ${ctx.request.method()} ${ctx.request.url()} | body: ${JSON.stringify(ctx.request.body())}`
    )

    await next()

    logger.info(
      `[RES] ${ctx.request.method()} ${ctx.request.url()} | status: ${ctx.response.getStatus()}`
    )
  }
}
