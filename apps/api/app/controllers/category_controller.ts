import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import InventoryService from '#services/inventory_service'
import { createCategoryValidator } from '#validators/inventory'

export default class CategoryController {
  @inject()
  async index({ params, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const categories = await inventoryService.getCategories(tenantId)
    return response.json(categories)
  }

  @inject()
  async store({ params, request, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const payload = await request.validateUsing(createCategoryValidator)

    const category = await inventoryService.createCategory(tenantId, payload)
    return response.created(category)
  }
}
