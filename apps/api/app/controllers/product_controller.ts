import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import InventoryService from '#services/inventory_service'
import { createProductValidator, updateProductValidator } from '#validators/inventory'

export default class ProductController {
  @inject()
  async index({ params, request, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const categoryId = request.input('categoryId')

    const products = await inventoryService.getProducts(
      tenantId,
      categoryId ? Number(categoryId) : undefined
    )
    return response.json(products)
  }

  @inject()
  async store({ params, request, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const payload = await request.validateUsing(createProductValidator)

    const product = await inventoryService.createProduct(tenantId, payload)
    return response.created(product)
  }

  @inject()
  async update({ params, request, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const productId = Number(params.id)
    const payload = await request.validateUsing(updateProductValidator)

    const product = await inventoryService.updateProduct(tenantId, productId, payload)
    return response.json(product)
  }

  @inject()
  async destroy({ params, response }: HttpContext, inventoryService: InventoryService) {
    const tenantId = Number(params.tenant_id)
    const productId = Number(params.id)

    await inventoryService.deleteProduct(tenantId, productId)
    return response.noContent()
  }
}
