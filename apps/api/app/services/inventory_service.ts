import Category from '#models/category'
import Product from '#models/product'
import transmit from '@adonisjs/transmit/services/main'
import type { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

interface CreateCategoryPayload {
  name: string
  description?: string | null
}

interface CreateProductPayload {
  categoryId?: number | null
  name: string
  description?: string | null
  price: number
  stock: number
  sku?: string | null
}

export default class InventoryService {
  /**
   * Create a new category for a tenant
   */
  async createCategory(tenantId: number, payload: CreateCategoryPayload): Promise<Category> {
    const category = await Category.create({
      tenantId,
      ...payload,
    })

    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'category:created' })
    return category
  }

  /**
   * Get all categories for a tenant
   */
  async getCategories(tenantId: number): Promise<Category[]> {
    return await Category.query().where('tenantId', tenantId).orderBy('name', 'asc')
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    tenantId: number,
    categoryId: number,
    payload: Partial<CreateCategoryPayload>
  ): Promise<Category> {
    const category = await Category.query()
      .where('tenantId', tenantId)
      .where('id', categoryId)
      .firstOrFail()

    category.merge(payload)
    await category.save()

    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'category:updated' })
    return category
  }

  /**
   * Delete a category
   */
  async deleteCategory(tenantId: number, categoryId: number): Promise<void> {
    const category = await Category.query()
      .where('tenantId', tenantId)
      .where('id', categoryId)
      .firstOrFail()

    await category.delete()
    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'category:deleted' })
  }

  /**
   * Create a new product for a tenant
   */
  async createProduct(tenantId: number, payload: CreateProductPayload): Promise<Product> {
    const product = await Product.create({
      tenantId,
      ...payload,
    })

    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'product:created' })
    return product
  }

  /**
   * Update an existing product
   */
  async updateProduct(
    tenantId: number,
    productId: number,
    payload: Partial<CreateProductPayload>
  ): Promise<Product> {
    const product = await Product.query()
      .where('tenantId', tenantId)
      .where('id', productId)
      .firstOrFail()

    product.merge(payload)
    await product.save()

    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'product:updated' })
    return product
  }

  /**
   * Get products for a tenant, optionally paginated.
   * When page/perPage are provided, returns a paginated result.
   * Otherwise returns all products (used by POS terminal).
   */
  async getProducts(
    tenantId: number,
    options: { categoryId?: number; page?: number; perPage?: number } = {}
  ): Promise<Product[] | ModelPaginatorContract<Product>> {
    const query = Product.query()
      .where('tenantId', tenantId)
      .preload('category')
      .orderBy('name', 'asc')

    if (options.categoryId) {
      query.where('categoryId', options.categoryId)
    }

    if (options.page) {
      return await query.paginate(options.page, options.perPage ?? 20)
    }

    return await query
  }

  /**
   * Adjust stock manually
   */
  async adjustStock(tenantId: number, productId: number, quantityChange: number): Promise<Product> {
    const product = await Product.query()
      .where('tenantId', tenantId)
      .where('id', productId)
      .firstOrFail()

    product.stock += quantityChange
    await product.save()

    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'product:updated' })
    return product
  }

  /**
   * Delete a product
   */
  async deleteProduct(tenantId: number, productId: number): Promise<void> {
    const product = await Product.query()
      .where('tenantId', tenantId)
      .where('id', productId)
      .firstOrFail()

    await product.delete()
    transmit.broadcast(`tenants/${tenantId}/inventory`, { event: 'product:deleted' })
  }
}
