import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TenantService from '#services/tenant_service'
import { createTenantValidator } from '#validators/tenant'

export default class TenantController {
  @inject()
  async index({ auth, response }: HttpContext, tenantService: TenantService) {
    const user = auth.user!
    const tenants = await tenantService.getUserTenants(user.id)
    return response.json(tenants)
  }

  @inject()
  async store({ request, auth, response }: HttpContext, tenantService: TenantService) {
    const payload = await request.validateUsing(createTenantValidator)
    const user = auth.user!

    const tenant = await tenantService.createTenant(user, payload)
    return response.created(tenant)
  }
}
