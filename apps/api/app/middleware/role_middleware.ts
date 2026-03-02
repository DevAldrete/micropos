import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Role-based authorization middleware.
 *
 * Checks that the authenticated user's role in the current tenant
 * (available via `ctx.tenantMember.role`, set by the tenant middleware)
 * is included in the list of allowed roles.
 *
 * This middleware must be applied AFTER both `auth` and `tenant` middleware.
 *
 * Usage:
 *   middleware.role({ roles: ['owner', 'admin'] })
 */
export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options?: { roles?: string[] }) {
    const allowedRoles = options?.roles ?? []

    if (allowedRoles.length === 0) {
      // No roles specified — allow all authenticated tenant members
      return next()
    }

    const memberRole = ctx.tenantMember?.role

    if (!memberRole || !allowedRoles.includes(memberRole)) {
      return ctx.response.forbidden({
        message: 'You do not have permission to perform this action',
      })
    }

    return next()
  }
}
