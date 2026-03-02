import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client.
   *
   * We shape all errors into a consistent JSON envelope so frontend
   * consumers always get the same structure:
   *
   * ```json
   * { "message": "...", "status": 422, "errors": [...] }
   * ```
   */
  async handle(error: unknown, ctx: HttpContext) {
    const err = error as Record<string, unknown>
    const status = typeof err?.['status'] === 'number' ? err['status'] : 500
    const message = typeof err?.['message'] === 'string' ? err['message'] : 'Internal server error'

    // VineJS validation errors carry a `messages` array
    const errors = Array.isArray(err?.['messages']) ? err['messages'] : undefined

    ctx.response.status(status).json({
      message,
      status,
      ...(errors ? { errors } : {}),
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
