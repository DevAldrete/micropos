import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import TenantMember from '#models/tenant_member'

/**
 * Tenant authorization middleware.
 *
 * Ensures that the authenticated user is a member of the tenant referenced
 * by the `:tenant_id` route parameter. If the user is not a member, the
 * request is rejected with a 403 Forbidden response.
 *
 * This middleware must be applied AFTER the `auth` middleware so that
 * `ctx.auth.user` is guaranteed to exist.
 *
 * On success it attaches `ctx.tenantMember` with the membership record
 * (includes role) so downstream controllers can use it for role-based checks.
 */
export default class TenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const tenantId = Number(ctx.params.tenant_id)
    const user = ctx.auth.user!

    if (!tenantId || Number.isNaN(tenantId)) {
      return ctx.response.badRequest({ message: 'Invalid tenant ID' })
    }

    const membership = await TenantMember.query()
      .where('tenantId', tenantId)
      .where('userId', user.id)
      .first()

    if (!membership) {
      return ctx.response.forbidden({
        message: 'You do not have access to this tenant',
      })
    }

    // Attach membership to the context so controllers can check roles
    ctx.tenantMember = membership

    return next()
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    tenantMember: TenantMember
  }
}
