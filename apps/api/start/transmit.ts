/*
|--------------------------------------------------------------------------
| Transmit (SSE) configuration
|--------------------------------------------------------------------------
|
| This file registers the SSE routes and authorizes tenant-scoped channels.
| Every channel follows the pattern `tenants/:id/<resource>` so that only
| authenticated members of a tenant can subscribe to its real-time events.
|
*/

import transmit from '@adonisjs/transmit/services/main'
import TenantMember from '#models/tenant_member'
import { middleware } from '#start/kernel'

/**
 * Register the built-in transmit routes:
 *   GET  /__transmit/events      – SSE event stream
 *   POST /__transmit/subscribe   – subscribe to a channel
 *   POST /__transmit/unsubscribe – unsubscribe from a channel
 *
 * We apply auth middleware so only authenticated users can connect.
 */
transmit.registerRoutes((route) => {
  route.use(middleware.auth())
})

/*
|--------------------------------------------------------------------------
| Channel authorization
|--------------------------------------------------------------------------
|
| Channels with dynamic `:id` segments are private. The authorize callback
| verifies that the authenticated user is a member of the given tenant.
|
| Channel naming convention:
|   tenants/:id/inventory   – product & category mutations
|   tenants/:id/orders      – order & payment mutations
|   tenants/:id/customers   – customer mutations
|   tenants/:id/team        – team membership mutations
|
*/

async function isTenantMember(ctx: any, tenantId: string): Promise<boolean> {
  const user = ctx.auth?.user
  if (!user) return false

  const membership = await TenantMember.query()
    .where('tenantId', Number(tenantId))
    .where('userId', user.id)
    .first()

  return !!membership
}

transmit.authorize<{ id: string }>('tenants/:id/inventory', (ctx, { id }) => {
  return isTenantMember(ctx, id)
})

transmit.authorize<{ id: string }>('tenants/:id/orders', (ctx, { id }) => {
  return isTenantMember(ctx, id)
})

transmit.authorize<{ id: string }>('tenants/:id/customers', (ctx, { id }) => {
  return isTenantMember(ctx, id)
})

transmit.authorize<{ id: string }>('tenants/:id/team', (ctx, { id }) => {
  return isTenantMember(ctx, id)
})
