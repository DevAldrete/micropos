import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import InventoryService from '#services/inventory_service'
import { createCategoryValidator, updateCategoryValidator } from '#validators/inventory'

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

  @inject()
  async update({ params, request, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const categoryId = Number(params.id)
    const payload = await request.validateUsing(updateCategoryValidator)

    const category = await inventoryService.updateCategory(tenantId, categoryId, payload)
    return response.json(category)
  }

  @inject()
  async destroy({ params, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const categoryId = Number(params.id)

    await inventoryService.deleteCategory(tenantId, categoryId)
    return response.noContent()
  }
}
